<?php

namespace App\Http\Controllers\Api;

use Stripe\Stripe;
use App\Models\User;

use App\Models\Order;
use App\Models\Product;
use App\Models\Discount;
use Stripe\StripeClient;
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
        $deliveryWorker = User::findAvailableDeliveryWorker();
    
        if (!$deliveryWorker) {
            return response()->json(['message' => 'No available delivery worker. Please try again later.'], 500);
        }
    
        $stripe = new StripeClient(env('STRIPE_SECRET'));
    
        $lineItems = [];     
        foreach ($validateData['products'] as $item) {
            $product = Product::findOrFail($item['product_id']);
          
            // Check stock quantity
            if ($product->stock_quantity < $item['quantity']) {
              return response()->json(['error' => 'Insufficient stock for product ' . $product->product_name], 400);
            }
          
            $discount = $this->getDiscountedPrice($product);
            $totalPrice = $discount ? $discount : ($product->price * $item['quantity']);  // Use discount if available, otherwise original price
          
            $product->decrement('stock_quantity', $item['quantity']);
          
            $lineItems[] = $this->formatLineItem($product, $totalPrice, $item['quantity']);
            }
            try {
        // Create a new Stripe Checkout session
        $checkout_session = $stripe->checkout->sessions->create([
            'payment_method_types' => ['card'],
            'line_items' => $lineItems,
            'mode' => 'payment',
            'success_url' => route('checkout.success', [], true)."?session_id={CHECKOUT_SESSION_ID}",
            'cancel_url' => route('checkout.cancel', [], true),
        ]);
                } 
                catch (\Stripe\Exception\ApiErrorException $e) {
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

                $discount = $this->getDiscountedPrice($product);
                $totalPrice = $discount ? $discount : ($product->price * $item['quantity']);  

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
            public function getDiscountedPrice(Product $product)
        {
                $activeDiscounts = Discount::where('is_active', true)->get();
                foreach ($activeDiscounts as $discount)
                 {
                        if ($discount->applies_to_all_products || (isset($discount->product_ids) && in_array($product->id, json_decode($discount->product_ids)))) {
                        return $discount->calculateDiscountedPrice($product);
                        }
                  }
                return null; 
        }
    
    
            private function formatLineItem($product, $totalPrice, $quantity) {
            $totalPriceInCents = $totalPrice * 100; 
            return [
                'price_data' => [
                'currency' => 'usd',
                'product_data' => [
                    'name' => $product->product_name,
                    'description' => $product->description,
                ],
                'unit_amount' => $totalPriceInCents, 
                ],
                'quantity' => $quantity,
            ];
            }
    
    public function success(Request $request)
    {
        
        try {
            $sessionId = $request->query('session_id');
            $stripe = new \Stripe\StripeClient(env('STRIPE_SECRET'));  
            $session = $stripe->checkout->sessions->retrieve($sessionId);
            $order = Order::where('session_id', $sessionId)->first();
            if (!$session || !$order) {
                throw new NotFoundHttpException;
            }
            $order->status="paid";
    
            
            $order->save();
    
            // Return a success response
            return redirect('http://localhost:3000/confirmed?id='.$sessionId);
        } catch (\Throwable $th) {
            \Log::error('Error in success method: ' . $th->getMessage());
            throw $th; 
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

    
    public function cancel(Request $request)
    {
        $validatedData = $request->validate([
            'order_id' => 'required|exists:orders,id',
        ]);
    
        $order = Order::find($validatedData['order_id']);
    
        if ($order->status === 'canceled') {
            return response()->json(['message' => 'Order is already canceled.'], 400);
        }
    
        if ($order->status === 'paid') {
           
            try {
                $stripe = new StripeClient(env('STRIPE_SECRET'));
                $refund = $stripe->refunds->create([
                    'payment_intent' => $order->session_id,
                ]);
    
                if ($refund->status !== 'succeeded') {
                    return response()->json(['message' => 'Failed to process refund. Please try again.'], 500);
                }
            } catch (\Stripe\Exception\ApiErrorException $e) {
                return response()->json(['message' => 'Stripe API error: ' . $e->getMessage()], 500);
            }
        }
    
        $order->status = 'canceled';
        $order->save();
    
        $orderDetails = $order->orderDetails;
        foreach ($orderDetails as $orderDetail) {
            $product = Product::find($orderDetail->product_id);
            $product->increment('stock_quantity', $orderDetail->amount);
        }
    
        return response()->json(['message' => 'Order has been canceled and payment refunded successfully.'], 200);
    }
    
    public function webhook()
    {
        
        $endpoint_secret = env('STRIPE_WEBHOOK_SECRET');

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
