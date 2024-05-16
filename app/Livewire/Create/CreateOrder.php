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
        'session_id'=>'',
    ];
    public $orderDetailsData = [
        'product_id' => '', 'total_price' => '',
        'amount'=>'','city'=>'','address'=>'','zip_code'=>''
];

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
        $this->orderDetailsData[] = ['product_id' => '', 'total_price' => '',
        'amount'=>'','city'=>'','address'=>'','zip_code'=>''];
    }

    protected $listeners = ['updateAddressDetails' => 'updateAddressDetails'];
  public function updateAddressDetails($data)
{
    // Update component data with the received address details
    $this->orderDetailsData[0]['address'] = $data['address'];
    $this->orderDetailsData[0]['city'] = $data['city'];
    $this->orderDetailsData[0]['zip_code'] = $data['postalCode'];
}
    public function removeOrderDetail($index)
    {
        unset($this->orderDetailsData[$index]);
        $this->orderDetailsData = array_values($this->orderDetailsData);
    }

    public function submitForm()
    {
        try {
            $this->validate([
                'orderData.customer_name' => 'required|string',
                'orderData.customer_id' => 'required|integer',
                'orderData.delivery_worker_id' => 'required|integer',
                'orderData.session_id'=>'required',
                'orderData.status'=>'required',
                'orderDetailsData.*.product_id' => 'required|integer',
                'orderDetailsData.*.total_price' => 'required|numeric',
                'orderDetailsData.*.amount' => 'required|numeric',
                'orderDetailsData.*.city' => 'required|string',
                'orderDetailsData.*.address' => 'required|string',
                'orderDetailsData.*.zip_code' => 'required|string',
            ]);
    
            $order = Order::create($this->orderData);
    
            foreach ($this->orderDetailsData as $detail) {
                $detail['order_id'] = $order->id;
                OrderDetail::create($detail);
            }
    
            session()->flash('message', 'Order created successfully!');
            $this->reset();
            $this->resetErrorBag();
            $this->resetValidation();
        } catch (\Exception $ex) {
            
            \Log::error('Order creation failed: ' . $ex->getMessage());
        }
       
    }

     public function render()
    {
        return view('livewire.create.create-order');
    }
}
