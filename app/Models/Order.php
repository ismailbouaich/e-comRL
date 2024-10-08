<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use MBarlow\Megaphone\HasMegaphone;

class Order extends Model
{
    use HasFactory ;
    use HasMegaphone;

    protected $table = 'orders'; // Name of the orders table
    protected $fillable = [
        'first_name','last_name', 'email','phone', 'customer_id', 'delivery_worker_id', 'status','is_assigned','session_id','shipping_cost','latitude', 'longitude'

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

    public function scopeSearch($query, $value) {
        $query->where('first_name', 'like', "%{$value}%")
              ->orWhereHas('orderDetails', function($query) use ($value) {
                  $query->where('city', 'like', "%{$value}%");
              })
              ->orWhere('status', 'like', "%{$value}%");
    }

}
