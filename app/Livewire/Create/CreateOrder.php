<?php

namespace App\Livewire\Create;

use App\Models\Order;
use Livewire\Component;
use App\Models\OrderDetail;

class CreateOrder extends Component
{
    public $currentStep = 1;
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
    ];
    public $orderDetailsData = [
        [
            'product_id' => '',
            'total_price' => '',
            'amount' => '',
            'city' => '',
            'address' => '',
            'zip_code' => '',
        ],
    ];

    protected $listeners = ['updateAddressDetails'];

    public function mount()
    {
        $this->orderDetailsData = [
            [
                'product_id' => '',
                'total_price' => '',
                'amount' => '',
                'city' => '',
                'address' => '',
                'zip_code' => '',
            ],
        ];

    }

    public function updated($propertyName)
    {
        logger("Updated property: {$propertyName}");
    }

    public function goToStep($step)
    {
        if (array_key_exists($step, $this->steps)) {
            $this->currentStep = $step;
        }
    }

    public function addOrderDetail()
    {
        $this->orderDetailsData[] = [
            'product_id' => '',
            'total_price' => '',
            'amount' => '',
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

    public function handleMapClicked($data)
    {
        // Update component data with the received address details
        $this->orderDetailsData[0]['address'] = $data['address'];
        $this->orderDetailsData[0]['city'] = $data['city'];
        $this->orderDetailsData[0]['zip_code'] = $data['postalCode'];
    }

    public function submitForm()
    {
        $this->validate([
            'orderData.customer_name' => 'required|string|max:255',
            'orderData.customer_id' => 'required|integer',
            'orderData.delivery_worker_id' => 'required|integer',
            'orderData.session_id' => 'required|string',
            'orderData.status' => 'required|string',
            'orderDetailsData.*.product_id' => 'required|integer',
            'orderDetailsData.*.total_price' => 'required|numeric|min:0',
            'orderDetailsData.*.amount' => 'required|numeric|min:0',
            'orderDetailsData.*.city' => 'required|string|max:255',
            'orderDetailsData.*.address' => 'required|string|max:255',
            'orderDetailsData.*.zip_code' => 'required|string|max:10',
        ]);

        $order = Order::create($this->orderData);

        foreach ($this->orderDetailsData as $detail) {
            $detail['order_id'] = $order->id;
            OrderDetail::create($detail);
        }

        session()->flash('message', 'Order created successfully!');
        $this->reset();
    }
     public function render()
    {
        return view('livewire.create.create-order');
    }
}
