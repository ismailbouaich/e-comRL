<?php

namespace App\Livewire;

use Livewire\Component;

use App\Models\User;
use App\Models\Order;
use App\Models\Product;

class GlobalSearch extends Component
{
    public $query = '';
    public $results = [];

    public function updatedQuery()
    {
        $this->search();
    }

    public function updatedSearch(){
        $this->resetPage();
    }

    public function search()
    {
        if (strlen($this->query) > 2) {
            $this->results = [
                'users' => User::search($this->query)->get(),
                'orders' => Order::search($this->query)->get(),
                'products' => Product::search($this->query)->get(),
            ];
        } else {
            $this->results = [];
        }
    }

    public function render()
    {
        return view('livewire.global-search');
    }
}
