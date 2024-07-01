<?php

namespace App\Livewire\Tables;

use Livewire\Component;
use Livewire\WithPagination;
use App\Models\Order;



class OrdersTable extends Component
{
    use WithPagination;

    public $search = '';
    public $perPage = 10;
    public $sortBy = 'created_at';
    public $sortDir = 'DESC';

    public function setSortBy($field)
    {
        if ($this->sortBy === $field) {
            $this->sortDir = $this->sortDir === 'ASC' ? 'DESC' : 'ASC';
        } else {
            $this->sortDir = 'ASC';
        }
        $this->sortBy = $field;
    }
    public function updatingSearch()
    {
        $this->resetPage();
    }
    public function delete(Order $Order){
        try {
            $Order->delete();
        } catch (\Exception $e) {
            session()->flash('error', 'Failed to delete Order: ' . $e->getMessage());
        }
    }
    public function render()
    {
        $orders = Order::with(['orderDetails', 'customer', 'deliveryWorker'])
        ->search($this->search)
            ->orderBy($this->sortBy, $this->sortDir)
            ->paginate($this->perPage);

        return view('livewire.tables.orders-table',['orders' => $orders]);
    }
}
