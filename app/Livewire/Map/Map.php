<?php

namespace App\Livewire\Map;

use Livewire\Component;

class Map extends Component
{
public $orderDetailsData = []; // Initialize as an empty array

public function updateAddress($addressDetails)
{
    $this->dispatch('addressSelected', $addressDetails);
}
    public function render()
    {
        return view('livewire.map.map');
    }
}
