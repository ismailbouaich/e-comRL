<?php

namespace App\Livewire\Map;

use Livewire\Component;

class Map extends Component
{
public $orderDetailsData = []; // Initialize as an empty array

    protected $listeners = ['updateOrderDetailsData' => 'setOrderDetailsData'];

    public function setOrderDetailsData($addressDetails)
    {
      
        $this->orderDetailsData['address'] = $addressDetails['addressLine'];
        $this->orderDetailsData['city'] = $addressDetails['adminDistrict2'];
        $this->orderDetailsData['zip_code'] = $addressDetails['postalCode'];
    }
    public function render()
    {
        return view('livewire.map.map');
    }
}
