<?php

namespace App\Http\Controllers\Api;

use Stripe\Stripe;
use App\Models\User;

use App\Models\Order;
use App\Models\Product;
use Stripe\PaymentIntent;
use App\Models\OrderDetail;
use Illuminate\Http\Request;
use Stripe\Checkout\Session;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;


class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validateData = $request->validate([
            'customer_name' => 'required',
            'customer_id' => 'required',
            'products' => 'required|array|min:1', // Ensure cart_items is an array with at least one item
            'products.*.product_id' => 'required|exists:products,id', // Validate each product_id in the cart
            'products.*.quantity' => 'required|integer|min:1', // Ensure quantity is a positive integer
            'address' => 'required',
            'zip_code' => 'required',
            'city' => 'required',
        ]);
    
        // Find an available delivery worker
        $deliveryWorker = User::whereHas('role', function ($query) {
            $query->where('name', 'delivery_worker');
        })
            ->whereDoesntHave('assignedOrders', function ($query) {
                $query->where('status', 'not_complete');
            })
            ->inRandomOrder()
            ->first();
    
        if (!$deliveryWorker) {
            return response()->json(['message' => 'No available delivery worker. Please try again later.'], 500);
        }
    
        $stripe = new \Stripe\StripeClient('sk_test_51OoXr0GpFbRloXFo1L4MXy4mw18FpStW1CZHdCJLiic5nOqAoyNLXQBnhP9wXH3pB0zxjjv4pzdI1ugYyIWI3fn300HV6v4WjC');
    
        // Initialize an array to store line items for Stripe
        $lineItems = [];     
        // Iterate through each item in the cart
        foreach ($validateData['products'] as $item) {
            $product = Product::findOrFail($item['product_id']);
            if ($product->stock_quantity < $item['quantity'])
             {
                
                return response()->json(['error' => 'Insufficient stock for product ' . $product->product_name], 400);
            }

            $product->decrement('stock_quantity', $item['quantity']);
        
        }
            $totalPrice = $product->price * $item['quantity'];
            // Add each item to the line items array
            $lineItems[] = $this->formatLineItem($product, $totalPrice, $item['quantity']);
        
            try {
        // Create a new Stripe Checkout session
        $checkout_session = $stripe->checkout->sessions->create([
            'payment_method_types' => ['card'],
            'line_items' => $lineItems,
            'mode' => 'payment',
            'success_url' => route('checkout.success', [], true)."?session_id={CHECKOUT_SESSION_ID}",
            'cancel_url' => route('checkout.cancel', [], true),
        ]);
    } catch (\Stripe\Exception\ApiErrorException $e) {
        return response()->json(['error' => 'Stripe API error: ' . $e->getMessage()], 500);
    }
    DB::beginTransaction();
try {

    $order = Order::create([
        'customer_name' => $validateData['customer_name'],
        'customer_id' => $validateData['customer_id'],
        'delivery_worker_id' => $deliveryWorker->id,
        'session_id' => $checkout_session->id,
    ]);

    // Iterate through cart items and create order details
    foreach ($validateData['products'] as $item) {
        $product = Product::findOrFail($item['product_id']);
        $totalPrice = $product->price * $item['quantity'];

        OrderDetail::create([
            'order_id' => $order->id,
            'product_id' => $item['product_id'],
            'address' => $validateData['address'],
            'zip_code' => $validateData['zip_code'],
            'city' => $validateData['city'],
            'total_price' => $totalPrice,
            'amount' => $item['quantity'],
        ]);
        

    }
    DB::commit();
} catch (\Exception $e) {
    DB::rollBack();
    return response()->json(['error' => 'Database error: ' . $e->getMessage()], 500);
}
        // Create the order
       
        $product->save();
    
        return response()->json([
            'message' => 'Your Order has been passed Successfully',
            'stripe_url' => $checkout_session->url,
            'session_id' => $checkout_session->id
        ]);
    }
    
    
    private function formatLineItem($product, $totalPrice, $quantity) {
        return [
            'price_data' => [
                'currency' => 'usd',
                'product_data' => [
                    'name' => $product->product_name,
                    'description' => $product->description,
                ],
                'unit_amount' => $totalPrice,
            ],
            'quantity' => $quantity,
        ];
    }
    
    
    public function success(Request $request)
    {
        
        try {
            // Retrieve the session ID from the request
            $sessionId = $request->query('session_id');
            \Log::info('Session ID: ' . $sessionId);
            
            // Retrieve the session from Stripe using the session ID
            $stripe = new \Stripe\StripeClient('sk_test_51OoXr0GpFbRloXFo1L4MXy4mw18FpStW1CZHdCJLiic5nOqAoyNLXQBnhP9wXH3pB0zxjjv4pzdI1ugYyIWI3fn300HV6v4WjC');  
            $session = $stripe->checkout->sessions->retrieve($sessionId);
            \Log::info('Session retrieved from Stripe: ' . json_encode($session));
            
            // Retrieve the order based on the session ID
            $order = Order::where('session_id', $sessionId)->first();
            \Log::info('Order retrieved: ' . json_encode($order));
    
            // Handle session retrieval error
            if (!$session || !$order) {
                \Log::error('Session or order not found.');
                throw new NotFoundHttpException;
            }
            $order->status="paid";
    
            
            $order->save();
    
            // Perform any additional actions (e.g., send email to customer)
    
            // Return a success response
            return redirect('http://localhost:3000/confirmed?id='.$sessionId
            /*,201,[
                'qrCodeBase64' => urlencode($qrCodeBase64),
                'order' => $order
            ]*/);
        } catch (\Throwable $th) {
            \Log::error('Error in success method: ' . $th->getMessage());
            throw $th; // Rethrow the exception for Laravel to handle
        }
    }
    public function generateQrCode(Request $request)
    {
        $sessionId = $request->query('id');
        $order = Order::where('session_id', $sessionId)->first();
    
        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }
    
        $qrCodeData = "order/{$order->id}/customer/{$order->customer_name}/date/{$order->created_at}";
        $qrCode = QrCode::size(300)->generate($qrCodeData);
        $qrCodeBase64 = base64_encode($qrCode);
    
        return response()->json(['qrCodeBase64' => $qrCodeBase64, 'order' => $order], 200);
    }
    
     public function cancel()
    {
        

    }
    public function webhook()
    {
        // This is your Stripe CLI webhook secret for testing your endpoint locally.
        $endpoint_secret = 'whsec_5270383984d1ba5c82a0ecf0094ed586e7763d93fb2f9808c1c46b6cd8536415';

        $payload = @file_get_contents('php://input');
        $sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];
        $event = null;

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                 $sig_header, 
                 $endpoint_secret
            );
        } catch (\UnexpectedValueException $e) {
            // Invalid payload
            return response('', 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            // Invalid signature
            return response('', 400);
        }

// Handle the event
        switch ($event->type) {
            case 'checkout.session.completed':
                $session = $event->data->object;
                $sessionId = $session->id;
                $order = Order::where('session_id', $session->id)->first();
                if ($order && $order->status === 'unpaid') {
                    $order->status = 'paid';
                    $order->save();
                }

            // ... handle other event types
            default:
                echo 'Received unknown event type ' . $event->type;
        }

        return response('');
    }
    
    
   
    

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
