<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    use HasFactory;

    protected $table = 'images'; // Name of the orders table
    protected $fillable = ['product_id', 'file_path', 'title', 'description'];

    public function product()
{
  return $this->belongsTo(Product::class);
}

  /**
   *   @if (session()->has('message'))
     * <div class="alert alert-success">
        *  {{ session('message') }}
   *   </div>
 * @endif

 * *      <input type="text" wire:model="name" placeholder="Product Name">
     * <textarea wire:model="description" placeholder="Description"></textarea>
    *  <input type="number" wire:model="price" placeholder="Price">
      *<input type="number" wire:model="stock_quantity" placeholder="Stock Quantity">
      *<select wire:model="category_id">
         * {{-- Assume categories are fetched from the database --}}
         * @foreach ($categories as $category)
            *  <option value="{{ $category->id }}">{{ $category->name }}</option>
          *@endforeach
      *</select>
     * <input type="file" wire:model="images" multiple>
      *<button type="submit">Submit</button>
 * </form>
   */
}
