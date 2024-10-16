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
    public $name, $description, $price, $stock_quantity, $category_id;
    public $images = [];
    public $newImages = [];
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

    public function updatedNewImages()
    {
        $this->validate([
            'newImages.*' => 'image|max:10240', // 10MB Max
        ]);
    }
    public function removeImage($imageId)
    {
        $image = Image::find($imageId);

        if ($image) {
            Storage::disk('public')->delete($image->file_path);
            $image->delete();
            $this->images = $this->product->images; // Refresh the images collection
        }
    }

    public function save()
    {
        $this->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'stock_quantity' => 'required|integer',
            'category_id' => 'required|exists:categories,id',
        ]);

        $this->product->update([
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'stock_quantity' => $this->stock_quantity,
            'category_id' => $this->category_id,
        ]);

        // Process new images
        if (!empty($this->newImages)) {
            // Delete old images
            foreach ($this->product->images as $oldImage) {
                Storage::disk('public')->delete($oldImage->file_path);
                $oldImage->delete();
            }

            // Save new images
            foreach ($this->newImages as $image) {
                $path = $image->store('images', 'public');
                $this->product->images()->create(['file_path' => $path]);
            }
        }

        session()->flash('message', 'Product updated successfully.');
    }


    public function render()
    {
        
        return view('livewire.edit.edit-product');
    }
}
