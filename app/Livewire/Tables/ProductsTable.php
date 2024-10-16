<?php

namespace App\Livewire\Tables;

use App\Models\Product;
use Livewire\Component;
use Livewire\WithPagination;
use Livewire\Attributes\Url;


class ProductsTable extends Component
{
    use WithPagination;

    #[Url(history:true)]
    public $search = '';

    #[Url(history:true)]
    public $sortBy = 'created_at';

    #[Url(history:true)]
    public $sortDir = 'DESC';

    #[Url()]
    public $perPage = 5;

    protected $queryString = [
        'search' => ['except' => ''],
        'sortBy' => ['except' => 'created_at'],
        'sortDir' => ['except' => 'DESC'],
        'perPage'
    ];

    public function updatedSearch(){
        $this->resetPage();
    }

    public function delete(Product $product){
        try {
            $product->delete();
        } catch (\Exception $e) {
            session()->flash('error', 'Failed to delete product: ' . $e->getMessage());
        }
    }

    public function setSortBy($sortByField){
        $validSortFields = ['name','category.name', 'price', 'created_at']; // Example fields
        if (!in_array($sortByField, $validSortFields)) {
            return;
        }

        if ($this->sortBy === $sortByField) {
            $this->sortDir = $this->sortDir === "ASC" ? 'DESC' : "ASC";
        } else {
            $this->sortBy = $sortByField;
            $this->sortDir = 'DESC';
        }
    }

    public function render()
{
    $products = Product::with(['images', 'category'])
        ->search($this->search) // Using the scopeSearch method
        ->orderBy($this->sortBy, $this->sortDir)
        ->paginate($this->perPage);

    return view('livewire.tables.products-table', compact('products'));
}
}
