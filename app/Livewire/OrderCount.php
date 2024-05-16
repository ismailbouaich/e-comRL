<?php

namespace App\Livewire;

use App\Models\Order;
use Livewire\Component;

class OrderCount extends Component
{
    public $counter = '';

    public function counter()
    {

        $orderCollection = Order::all();

        $this->counter = $orderCollection->count();
      
    }
    public function render()
    {
        $this->counter();
        
        return view('livewire.order-count');
    }
}
