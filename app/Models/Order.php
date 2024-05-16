<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders'; // Name of the orders table
    protected $fillable = [
        'customer_name', 'customer_id', 'delivery_worker_id', 'status','is_assigned','session_id', 
    ];

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class);
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function deliveryWorker()
    {
        return $this->belongsTo(User::class, 'delivery_worker_id');
    }
    public function calculateTotal()
    {
        return $this->orderDetails->sum('total_price');
    }
}
