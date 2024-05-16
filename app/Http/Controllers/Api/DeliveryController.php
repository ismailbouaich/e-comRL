<?php

namespace App\Http\Controllers\Api;

use App\Models\Order;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DeliveryController extends Controller
{
    public function completeOrder(Request $request)
{
    // Validate the request data
    $request->validate([
        'orderId' => 'required', // You might use orderId or session ID here
    ]);

    // Find the order by orderId or session ID
    $order = Order::find($request->orderId);
    if ($order) {
        // Update order status to complete
        $order->update(['status' => 'complete']);

        // Return a success response
        return response()->success('Order status updated');
    } else {
        // Order not found, return an error response
        return response()->error('Order not found', 404);
    }
}
}
