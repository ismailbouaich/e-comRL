<?php

namespace App\Http\Controllers\Api;

use App\Models\Order;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class DeliveryController extends Controller
{


    public function getDeliveryWorkerOrders(Request $request)
    {
        try {
            $deliveryWorkerId = Auth::id();

            $orders = Order::where('delivery_worker_id', $deliveryWorkerId)
            ->whereIn('status', ['paid', 'onProgress'])
                ->with(['orderDetails' => function ($query) {
                    $query->select('id', 'order_id', 'product_id', 'total_price', 'quantity', 'city', 'address', 'zip_code');
                }])
                ->select('id', 'first_name', 'last_name', 'email', 'phone', 'status', 'shipping_cost','latitude', 'longitude')
                ->get();

            if ($orders->isEmpty()) {
                return response()->json([
                    'message' => 'No orders found for this delivery worker',
                    'orders' => []
                ], 200);
            }

            return response()->json([
                'message' => 'Orders retrieved successfully',
                'orders' => $orders
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while fetching orders',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function completeOrder($orderId)
    {
        $order = Order::find($orderId);
    
        if ($order) {
            $order->update(['status' => 'complete']);
    
            return response()->json(['status' => 'complete', 'message' => 'Order status updated successfully'], 200);
        } else {
            return response()->json(['status' => 'error', 'message' => 'Order not found'], 404);
        }
    }
public function acceptOrder(Request $request,$orderId)
{
    $order = Order::find($orderId);
    
    if ($order) {
        $order->update(['status' => 'onProgress']);

        return response()->json(['status' => 'complete', 'message' => 'Order status updated successfully'], 200);
    } else {
        return response()->json(['status' => 'error', 'message' => 'Order not found'], 404);
    }
}
}
