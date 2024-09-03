<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingZone extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'shipping_cost'];

    public static function calculateShipping($city, $country)
    {
        if (strtolower($city) === 'marrakesh prefecture') {
            return self::where('name', 'Marrakech')->first()->shipping_cost;
        } elseif (strtolower($country) === 'morocco') {
            return self::where('name', 'Morocco')->first()->shipping_cost;
        } else {
            return self::where('name', 'International')->first()->shipping_cost;
        }
    }
}
