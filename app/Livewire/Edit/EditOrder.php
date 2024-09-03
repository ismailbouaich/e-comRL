<?php

namespace App\Livewire\Edit;

use App\Models\Order;
use App\Models\OrderDetail;
use Livewire\Component;

class EditOrder extends Component
{
    public $order;
    public $first_name, $last_name, $email, $phone, $customer_id, $delivery_worker_id, $status, $is_assigned, $session_id, $shipping_cost, $latitude, $longitude;
    public $orderDetailsData = [];

    public $currentStep = 1;
    public $totalSteps = 3;

    protected $rules = [
        'first_name' => 'required|string',
        'last_name' => 'required|string',
        'email' => 'required|email',
        'phone' => 'required|string',
        'customer_id' => 'required|integer',
        'delivery_worker_id' => 'required|integer',
        'status' => 'required|string',
        'session_id' => 'required|string',
        'shipping_cost' => 'nullable|numeric',
        'latitude' => 'nullable|numeric',
        'longitude' => 'nullable|numeric',
        'orderDetailsData.*.product_id' => 'required|integer',
        'orderDetailsData.*.total_price' => 'required|numeric',
        'orderDetailsData.*.quantity' => 'required|integer',
        'orderDetailsData.*.city' => 'required|string',
        'orderDetailsData.*.address' => 'required|string',
        'orderDetailsData.*.zip_code' => 'required|string',
    ];

    public function mount($orderId)
    {
        $this->order = Order::with('orderDetails.product')->findOrFail($orderId);
        $this->first_name = $this->order->first_name;
        $this->last_name = $this->order->last_name;
        $this->email = $this->order->email;
        $this->phone = $this->order->phone;
        $this->customer_id = $this->order->customer_id;
        $this->delivery_worker_id = $this->order->delivery_worker_id;
        $this->status = $this->order->status;
        $this->is_assigned = $this->order->is_assigned;
        $this->session_id = $this->order->session_id;
        $this->shipping_cost = $this->order->shipping_cost;
        $this->latitude = $this->order->latitude;
        $this->longitude = $this->order->longitude;

        foreach ($this->order->orderDetails as $detail) {
            $this->orderDetailsData[] = [
                'id' => $detail->id,
                'product_id' => $detail->product_id,
                'total_price' => $detail->total_price,
                'quantity' => $detail->quantity,
                'city' => $detail->city,
                'address' => $detail->address,
                'zip_code' => $detail->zip_code,
            ];
        }
    }

    public function render()
    {
        return view('livewire.edit.edit-order');
    }

    public function nextStep()
    {
        $this->validateStep();
        if ($this->currentStep < $this->totalSteps) {
            $this->currentStep++;
        }
    }

    public function previousStep()
    {
        if ($this->currentStep > 1) {
            $this->currentStep--;
        }
    }

    public function validateStep()
    {
        if ($this->currentStep == 1) {
            $this->validate([
                'first_name' => 'required|string',
                'last_name' => 'required|string',
                'email' => 'required|email',
                'phone' => 'required|string',
                'customer_id' => 'required|integer',
                'delivery_worker_id' => 'required|integer',
                'status' => 'required|string',
                'session_id' => 'required|string',
            ]);
        } elseif ($this->currentStep == 2) {
            $this->validate([
                'orderDetailsData.*.product_id' => 'required|integer',
                'orderDetailsData.*.total_price' => 'required|numeric',
                'orderDetailsData.*.quantity' => 'required|integer',
            ]);
        }
    }

    public function updateOrder()
    {
        $this->validate();

        try {
            $this->order->update([
                'first_name' => $this->first_name,
                'last_name' => $this->last_name,
                'email' => $this->email,
                'phone' => $this->phone,
                'customer_id' => $this->customer_id,
                'delivery_worker_id' => $this->delivery_worker_id,
                'status' => $this->status,
                'is_assigned' => $this->is_assigned,
                'session_id' => $this->session_id,
                'shipping_cost' => $this->shipping_cost,
                'latitude' => $this->latitude,
                'longitude' => $this->longitude,
            ]);

            foreach ($this->orderDetailsData as $detailData) {
                if (isset($detailData['id'])) {
                    $detail = OrderDetail::findOrFail($detailData['id']);
                    $detail->update($detailData);
                } else {
                    $detailData['order_id'] = $this->order->id;
                    OrderDetail::create($detailData);
                }
            }

            session()->flash('message', 'Order updated successfully.');
            return redirect()->route('orders');
        } catch (\Exception $e) {
            session()->flash('error', 'There was an error updating the order: ' . $e->getMessage());
        }
    }

    public function addOrderDetail()
    {
        $this->orderDetailsData[] = [
            'product_id' => '',
            'total_price' => '',
            'quantity' => '',
            'city' => '',
            'address' => '',
            'zip_code' => '',
        ];
    }

    public function removeOrderDetail($index)
    {
        if (isset($this->orderDetailsData[$index]['id'])) {
            OrderDetail::findOrFail($this->orderDetailsData[$index]['id'])->delete();
        }

        unset($this->orderDetailsData[$index]);
        $this->orderDetailsData = array_values($this->orderDetailsData);
    }
}