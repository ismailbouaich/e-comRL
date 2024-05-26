<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $table = 'products'; // Name of the product table
    protected $fillable = ['product_name', 'description', 'price', 'stock_quantity','category_id'];
        
    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class);
    }
   
    public function discount()
    {
        return $this->hasOne(Discount::class); // Assuming Discount model
    }
    public function images()
    {
     return $this->hasMany(Image::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }


   

    public function scopeSearch($query, $value) {
        $query->where('product_name', 'like', "%{$value}%")
              ->orWhereHas('category', function($query) use ($value) {
                  $query->where('name', 'like', "%{$value}%");
              })
              ->orWhere('price', 'like', "%{$value}%");
    }

    //i added this part
    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function getfavoriteAttribute(): bool
    {
        return (bool) $this->favorites()->where('product_id', $this->id)->where('user_id', auth()->id())->exists();
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
}
