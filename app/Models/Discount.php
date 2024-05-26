<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'code', 'discount_type', 'discount_value', 'start_date', 'end_date',
        'is_active', 'minimum_order_amount', 'applies_to_all_products', 'product_ids'
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'product_ids' => 'array'
    ];

  
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
                    ->where(function ($subquery) {
                        $subquery->whereNull('end_date')
                                ->orWhere('end_date', '>=', now());
                    });
    }

    public function calculateDiscountedPrice(Product $product): float
    {
        if ($this->discount_type === 'percentage') {
            $discount = $product->price * ($this->discount_value / 100);
        } else {
            $discount = $this->discount_value;
        }

        return $product->price - $discount;
    }

    protected $appends = ['product_ids_array']; // Define an accessor

    public function setProductIdsAttribute($value)
    {
        $this->attributes['product_ids'] = json_encode($value);
    }

    public function getProductIdsArrayAttribute()
    {
        return json_decode($this->product_ids, true); // Decode in accessor
    }

}

