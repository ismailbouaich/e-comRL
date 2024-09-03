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
use App\Models\ShippingZone;
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
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email',
            'phone' => 'required',
            'customer_id' => 'required',
            'products' => 'required|array|min:1',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'address' => 'required',
            'zip_code' => 'required',
            'city' => 'required',
            'country' => 'required',
            
        ]);
    
        // Find an available delivery worker
        $deliveryWorker = User::findAvailableDeliveryWorker();

    
        if (!$deliveryWorker) {
            return response()->json(['message' => 'No available delivery worker. Please try again later.'], 500);
        }
        
        $stripe = new \Stripe\StripeClient('sk_test_51OoXr0GpFbRloXFo1L4MXy4mw18FpStW1CZHdCJLiic5nOqAoyNLXQBnhP9wXH3pB0zxjjv4pzdI1ugYyIWI3fn300HV6v4WjC');
    
        $lineItems = [];     
        foreach ($validatedData['products'] as $item) {
            $product = Product::findOrFail($item['product_id']);
          
            // Check stock quantity
            if ($product->stock_quantity < $item['quantity']) {
                return response()->json(['error' => 'Insufficient stock for product ' . $product->product_name], 400);
            }
          
            // $discountedPrice = $this->getDiscountedPrice($product, $item['quantity']);

            $unitPrice = $this->getDiscountedPrice($product, 1);
          
            $product->decrement('stock_quantity', $item['quantity']);
          
            $lineItems[] = $this->formatLineItem($product, $unitPrice, $item['quantity']);
        }
    
        try {
            // Create a new Stripe Checkout session
            $checkout_session = $stripe->checkout->sessions->create([
                'payment_method_types' => ['card'],
                'line_items' => $lineItems,
                'mode' => 'payment',
                'success_url' => route('checkout.success', [], true) . "?session_id={CHECKOUT_SESSION_ID}",
                'cancel_url' => route('checkout.failed', [], true),
                
            ]);
        } catch (\Stripe\Exception\ApiErrorException $e) {
            return response()->json(['error' => 'Stripe API error: ' . $e->getMessage()], 500);
        }

        $shippingCost = ShippingZone::calculateShipping($validatedData['city'], $validatedData['country']);

        $lineItems[] = [
            'price_data' => [
                'currency' => 'usd',
                'product_data' => [
                    'name' => 'Shipping',
                    'description' => 'Shipping cost',
                ],
                'unit_amount' => $shippingCost * 100, // Convert to cents
            ],
            'quantity' => 1,
        ];
        $checkout_session = $stripe->checkout->sessions->create([
            'payment_method_types' => ['card'],
            'line_items' => $lineItems,
            'mode' => 'payment',
            'success_url' => route('checkout.success', [], true) . "?session_id={CHECKOUT_SESSION_ID}",
            'cancel_url' => route('checkout.failed', [], true),
        ]);
    
        DB::beginTransaction();
        try {
            $order = Order::create([
                'first_name' => $validatedData['first_name'],
                'last_name' => $validatedData['last_name'],
                'email' => $validatedData['email'],
                'phone' => $validatedData['phone'],
                'customer_id' => $validatedData['customer_id'],
                'delivery_worker_id' => $deliveryWorker->id,
                'session_id' => $checkout_session->id,
                'shipping_cost' => $shippingCost,
                'latitude'=>$request->latitude
                , 'longitude'=>$request->longitude
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
                    'A new order has been placed by ' . $validatedData['first_name'] .$validatedData['last_name']. '.',
                    'http://127.0.0.1:8000/orders/'. $order->id,
                );
                $admin->notify($notification);
            }
    
            $qrCodeData = "order/{$order->id}/customer/{$order->first_name} {$order->last_name} /date/{$order->created_at}";
            $qrCode = QrCode::size(300)->generate($qrCodeData);
            $qrCodeBase64 = base64_encode($qrCode);
            // Send the email
            Mail::to($validatedData['email'])->send(new OrderSuccessEmail([
                'name' => $validatedData['first_name'],
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
    
    
    
     private function formatLineItem($product, $unitPrice, $quantity)
     
     {
        $unitPriceInCents = $unitPrice * 100;
            return [
                'price_data' => [
                'currency' => 'usd',
                'product_data' => [
                    'name' => $product->product_name,
                    'description' => $product->description,
                ],
                'unit_amount' => $unitPriceInCents, 
                ],
                'quantity' => $quantity,
            ];
         }

    public function calculateShipping(Request $request)
            {
                $validatedData = $request->validate([
                    'city' => 'required',
                    'country' => 'required',
                ]);

                $shippingCost = ShippingZone::calculateShipping($validatedData['city'], $validatedData['country']);

                return response()->json(['shippingCost' => $shippingCost]);
            }
                
    public function success(Request $request)
    {
        
        try {
            $sessionId = $request->query('session_id');
            $stripe = new \Stripe\StripeClient('sk_test_51OoXr0GpFbRloXFo1L4MXy4mw18FpStW1CZHdCJLiic5nOqAoyNLXQBnhP9wXH3pB0zxjjv4pzdI1ugYyIWI3fn300HV6v4WjC');
 
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


    public function failed()  {

        return redirect('http://localhost:3000/failed');
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
    public function orderHistory($userId)
    {
        

     $orders = DB::table('orders')
     ->join('order_details', 'orders.id', '=', 'order_details.order_id')
     ->join('products', 'order_details.product_id', '=', 'products.id')
     ->select(
         'orders.id as order_id',
         'orders.status',
         'orders.created_at as order_date',
         'products.product_name',
         'order_details.quantity',
         'order_details.total_price',
         'order_details.city',
         'order_details.address',
         'order_details.zip_code'
     )
     ->where('orders.customer_id', $userId)
     ->get();

 $groupedOrders = $orders->groupBy('order_id')->map(function ($order) {
     $firstItem = $order->first();
     return [
         'order_id' => $firstItem->order_id,
         'status' => $firstItem->status,
         'order_date' => $firstItem->order_date,
         'products' => $order->map(function ($item) {
             return [
                 'name' => $item->product_name,
                 'quantity' => $item->quantity,
                 'total' => $item->total_price
             ];
         }),
         'subtotal' => $order->sum('total_price'),
         'shipping' => 17.00, // You might want to make this dynamic
         'total' => $order->sum('total_price'),
         'shipping_address' => [
             'city' => $firstItem->city,
             'address' => $firstItem->address,
             'zip_code' => $firstItem->zip_code
         ],
         'note' => 'new order' // You might want to store this in the database
     ];
 })->values();

 return response()->json($groupedOrders);

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
