<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $table = 'categories'; // Name of the categories table
    protected $fillable = ['name','icon'];

    public function scopeSearch($query,$value) {

        $query->where('name','like',"%{$value}%"); 
        
    }
    public function products()
    {
        return $this->hasMany(Product::class);
    }
   
}
