<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Discount extends Model
{
    use HasFactory;
    protected $fillable = [
     'name', 'code', 'discount_type', 'discount_value', 'start_date', 'end_date', 'is_active'
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'discount_product');
    }

  
    public function scopeCurrent(Builder $query)
    {
        return $query->where('is_active', true)
                     ->where('start_date', '<=', now())
                     ->where('end_date', '>=', now());
    }

    public function scopeByCode($query, $code)
    {
        return $query->where('code', $code);
    }

    public function scopeSearch($query,$value) {

        $query->where('name','like',"%{$value}%"); 
        
    }
}
