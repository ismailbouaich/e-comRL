<?php

namespace App\Http\Controllers\Api;

use App\Models\User;

use App\Models\Order;
use App\Models\Product;
use App\Models\Discount;
use Stripe\StripeClient;
use App\Models\OrderDetail;
use Illuminate\Http\Request;
use App\Mail\OrderSuccessEmail;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
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
        $validatedData = $request->validate([
            'customer_name' => 'required',
            'customer_id' => 'required',
            'products' => 'required|array|min:1',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
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
        
        $stripe = new StripeClient(env('STRIPE_SECRET'));
    
        $lineItems = [];     
        foreach ($validatedData['products'] as $item) {
            $product = Product::findOrFail($item['product_id']);
          
            // Check stock quantity
            if ($product->stock_quantity < $item['quantity']) {
                return response()->json(['error' => 'Insufficient stock for product ' . $product->product_name], 400);
            }
          
            $discountedPrice = $this->getDiscountedPrice($product, $item['quantity']);
          
            $product->decrement('stock_quantity', $item['quantity']);
          
            $lineItems[] = $this->formatLineItem($product, $discountedPrice, $item['quantity']);
        }
    
        try {
            // Create a new Stripe Checkout session
            $checkout_session = $stripe->checkout->sessions->create([
                'payment_method_types' => ['card'],
                'line_items' => $lineItems,
                'mode' => 'payment',
                'success_url' => route('checkout.success', [], true) . "?session_id={CHECKOUT_SESSION_ID}",
                'cancel_url' => route('checkout.cancel', [], true),
            ]);
        } catch (\Stripe\Exception\ApiErrorException $e) {
            return response()->json(['error' => 'Stripe API error: ' . $e->getMessage()], 500);
        }
    
        DB::beginTransaction();
        try {
            $order = Order::create([
                'customer_name' => $validatedData['customer_name'],
                'customer_id' => $validatedData['customer_id'],
                'delivery_worker_id' => $deliveryWorker->id,
                'session_id' => $checkout_session->id,
            ]);
    
            foreach ($validatedData['products'] as $item) {
                $product = Product::findOrFail($item['product_id']);
    
                $discountedPrice = $this->getDiscountedPrice($product, $item['quantity']);  
    
                OrderDetail::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'address' => $validatedData['address'],
                    'zip_code' => $validatedData['zip_code'],
                    'city' => $validatedData['city'],
                    'total_price' => $discountedPrice,
                    'quantity' => $item['quantity'],
                ]);
            }
    
            DB::commit();
    
            $admins = User::whereHas('role', function ($query) {
                $query->where('name', 'admin');
            })->get();
    
            foreach ($admins as $admin) {
                $notification = new \MBarlow\Megaphone\Types\Important(
                    'New Order Placed',
                    'A new order has been placed by ' . $validatedData['customer_name'] . '.',
                    'https://example.com/order-details', // Optional: URL
                    'View Order Details' // Optional: Link Text
                );
                $admin->notify($notification);
            }
    
            $qrCodeData = "order/{$order->id}/customer/{$order->customer_name}/date/{$order->created_at}";
        $qrCode = QrCode::size(300)->generate($qrCodeData);
        $qrCodeBase64 = base64_encode($qrCode);
            // Send the email
            Mail::to('ismailbouaichi10@gmail.com')->send(new OrderSuccessEmail([
                'name' => $validatedData['customer_name'],
                'qrCode' => $qrCodeBase64
            ]));
    
            return response()->json([
                'message' => 'Your Order has been passed Successfully',
                'stripe_url' => $checkout_session->url,
                'session_id' => $checkout_session->id
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Database error: ' . $e->getMessage()], 500);
        }
    }
    
    public function getDiscountedPrice(Product $product, $quantity)
    {
        $discount = $product->discounts()->current()->first();
        $price = $product->price;
    
        if ($discount) {
            if ($discount->discount_type === 'percentage') {
                $price -= ($price * ($discount->discount_value / 100));
            } else {
                $price -= $discount->discount_value;
            }
        }
    
        return $price * $quantity;
   
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
            $product->increment('stock_quantity', $orderDetail->quantity);
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
