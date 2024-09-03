<?php

namespace App\Livewire\Create;

use App\Models\Order;
use App\Models\OrderDetail;
use Livewire\Component;
use Illuminate\Support\Str;

class CreateOrder extends Component
{
    public $currentStep = 1;
    public $totalSteps = 3; // Add this line
    public $steps = [
        1 => 'Customer Information',
        2 => 'Order Details',
    ];

    public $orderData = [
        'customer_name' => '',
        'customer_id' => '',
        'delivery_worker_id' => '',
        'status' => '',
        'session_id' => '',
        'longitude'=>'',
        'latitude'=>'',
    ];

    public $orderDetailsData = [
        [
            'product_id' => '',
            'total_price' => '',
            'quantity' => '',
            'city' => '',
            'address' => '',
            'zip_code' => '',
        ]
    ];

    protected $rules = [
        'orderData.customer_name' => 'required|string',
        'orderData.customer_id' => 'required|integer',
        'orderData.delivery_worker_id' => 'required|integer',
        'orderData.status' => 'required|string',
        'orderData.session_id' => 'required|string',
        'orderDetailsData.*.product_id' => 'required|integer',
        'orderDetailsData.*.total_price' => 'required|numeric',
        'orderDetailsData.*.quantity' => 'required|integer',
        'orderDetailsData.*.city' => 'required|string',
        'orderDetailsData.*.address' => 'required|string',
        'orderDetailsData.*.zip_code' => 'required|string',
    ];

    protected $listeners = ['updateAddress'];

    public function updateAddress($address, $city, $zipCode,$longitude,$latitude)
    {
        $this->orderDetailsData[0]['address'] = $address;
        $this->orderDetailsData[0]['city'] = $city;
        $this->orderDetailsData[0]['zip_code'] = $zipCode;
        $this->orderData[0]['longitude']=$longitude;
        $this->orderData[0]['latitude']=$latitude;
    }

    public function render()
    {
        return view('livewire.create.create-order');
    }

    public function generateSessionId()
    {
        $this->orderData['session_id'] = Str::random(8);
        $this->orderData['session_id'] = strtoupper($this->orderData['session_id']);
    }

    public function goToStep($step)
    {
        $this->validateStep($this->currentStep);
        $this->currentStep = $step;
    }

    public function validateStep($step)
    {
        if ($step == 1) {
            $this->validate([
                'orderData.customer_name' => 'required|string',
                'orderData.customer_id' => 'required|integer',
                'orderData.delivery_worker_id' => 'required|integer',
                'orderData.status' => 'required|string',
                'orderData.session_id' => 'required|string',
            ]);
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
        unset($this->orderDetailsData[$index]);
        $this->orderDetailsData = array_values($this->orderDetailsData);
    }

    public function submitForm()
    {
        $this->validate();

        try {
            $order = Order::create($this->orderData);
            foreach ($this->orderDetailsData as $detail) {
                $detail['order_id'] = $order->id;
                OrderDetail::create($detail);
            }
            session()->flash('message', 'Order created successfully.');
            return redirect()->route('orders');
        } catch (\Exception $e) {
            session()->flash('error', 'There was an error creating the order: ' . $e->getMessage());
        }
    }
}