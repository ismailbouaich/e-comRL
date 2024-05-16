<?php

namespace App\Livewire\Edit;

use App\Models\Image;
use App\Models\Product;
use Livewire\Component;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;
use Livewire\WithFileUploads;



class EditProduct extends Component
{
    use WithFileUploads;


    public $product;
    public $product_name, $description, $price, $stock_quantity, $category_id;
    public $images = [];
    public $categories;

    public function mount($productId){
        $product = Product::find($productId);
        $this->product=$product;
        $this->product_name=$product->product_name;
        $this->description=$product->description;
        $this->price=$product->price;
        $this->stock_quantity=$product->stock_quantity;
        $this->category_id=$product->category_id;
        $this->images = $product->images; // Assuming this is how 
        $this->categories = Category::all(); // Assuming you have a Role model

    }
    public function updatedImages()
    {
        // Assuming $this->images holds the new images and $this->product->images holds the old images
        foreach ($this->product->images as $oldImage) {
            Storage::delete($oldImage->file_path); // Delete the old image file
            $oldImage->delete(); // Delete the old image record
        }
    
        // Process new images
        foreach ($this->images as $image) {
            $path = $image->store('images', 'public');
            $this->product->images()->create(['file_path' => $path]);
        }
    }
    public function save()
{
    $this->validate([
        'product_name' => 'required|string|max:255',
        'description' => 'required|string',
        'price' => 'required|numeric',
        'stock_quantity' => 'required|integer',
        'category_id' => 'required|exists:categories,id',
    ]);

    $this->product->update([
        'product_name' => $this->product_name,
        'description' => $this->description,
        'price' => $this->price,
        'stock_quantity' => $this->stock_quantity,
        'category_id' => $this->category_id,
    ]);
  

    session()->flash('message', 'Product updated successfully.');
}



    public function render()
    {
        
        return view('livewire.edit.edit-product');
    }
}
