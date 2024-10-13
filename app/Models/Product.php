<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class Product extends Model
{
    use HasFactory;

    protected $table = 'products'; // Name of the product table
    protected $fillable = ['name', 'description', 'price', 'stock_quantity','brand_id','category_id'];
  

    public function images()
    {
     return $this->hasMany(Image::class);
    }
       public function brand()
    {
        return $this->belongsTo(Brand::class);
    }
    public function category()
    {
        return $this->belongsTo(Category::class);
    }


    public function scopeSearch($query, $value) {
        $query->with(['category', 'brand'])
          ->where('name', 'like', "%{$value}%")
          ->orWhere('price', 'like', "%{$value}%");

    // After eager loading, apply search filter on category and brand name
    $query->orWhereHas('category', function($query) use ($value) {
        $query->where('name', 'like', "%{$value}%");
    });

    $query->orWhereHas('brand', function($query) use ($value) {
        $query->where('name', 'like', "%{$value}%");
    });
    }
    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class);
    }
   
    public function discounts()
    {
        return $this->belongsToMany(Discount::class, 'discount_product');
    }

    public function currentDiscount()
    {
        return $this->discounts()->current()->first();
    }   
 
   

   
    protected $appends = ['discounted_price', 'is_discounted'];

    public function getDiscountedPriceAttribute()
    {
        $currentDiscount = $this->currentDiscount();
    
        if ($currentDiscount) {
            if ($currentDiscount->discount_type === 'percentage') {
                return $this->price * (1 - $currentDiscount->discount_value / 100);
            } else {
                return $this->price - $currentDiscount->discount_value;
            }
        }
    
        return $this->price;
    }
    
    public function getIsDiscountedAttribute()
    {
        return $this->currentDiscount() ? true : false;
    }

     public function favorites(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'favorites');
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class);
    }


    public function getFavoriteAttribute(): bool
    {
        return (bool) $this->favorites()->where('product_id', $this->id)->where('user_id', auth()->id())->exists();
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function scopeWithAvgRating($query)
    {
        return $query->withAvg('ratings as avg_rating', 'rating');
    }

}
