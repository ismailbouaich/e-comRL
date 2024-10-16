<?php

namespace App\Livewire\Show;

use App\Models\Product;
use Livewire\Component;
use App\Models\Category;
use Livewire\WithFileUploads;

class ProductShow extends Component
{
    use WithFileUploads;
    
    public $product;
    public $name, $description, $price, $stock_quantity, $category_id;
    public $images = [];
    public $categories;

    public function mount($productId){
        $product = Product::find($productId);
        $this->product = $product;
        $this->name = $product->name;
        $this->description = $product->description;
        $this->price = $product->price;
        $this->stock_quantity = $product->stock_quantity;
        $this->category_id = $product->category_id;
        $this->images = $product->images;
        $this->categories = Category::orderBy('name', 'desc')->latest()->get();
    }

    public function render()
    {
        return view('livewire.show.product-show');
    }
}
