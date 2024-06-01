<?php

namespace App\Livewire\Create;

use App\Models\Category;
use Livewire\Component;
use Livewire\WithFileUploads;
use App\Models\Product;
use App\Models\Image;

class CreateProduct extends Component
{
    use WithFileUploads;

    public $product_name, $description, $price, $stock_quantity, $category_id;
    public $images = [];
    public $categories;
    protected $rules = [
        'product_name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'stock_quantity' => 'required|integer',
            'category_id' => 'required|integer',
            'images.*' => 'image|max:1024', // 1MB Max per image
    ];

    public function updatedImages()
    {
        $this->validate([
            'images.*' => 'image|max:10240', // Max file size: 10MB
        ]);
    }

    public function submit()
    {
        $this->validate();

        $product = Product::create([
            'product_name' => $this->product_name,
            'description' => $this->description,
            'price' => $this->price,
            'stock_quantity' => $this->stock_quantity,
            'category_id' => $this->category_id,
        ]);

        foreach ($this->images as $image) {
            $path = $image->store('public/images');
            Image::create([
                'product_id' => $product->id,
                'file_path' => $path,
            ]);
            $this->images = [];
        }

        session()->flash('message', 'Product successfully created with images.');
    }

    public function cancel()  {
        return  $this->reset(['product_name', 'description', 'price', 'stock_quantity', 'category_id','file_path','product_id']);
  
      }
    public function mount()
    {
        $this->categories = Category::all(); // Assuming you have a Role model
    }
    public function render()
    {
        return view('livewire.create.create-product');
    }
}
