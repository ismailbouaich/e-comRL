<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Image;
use App\Models\ShippingZone;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
     
        ShippingZone::create(['name' => 'Marrakech', 'shipping_cost' => 0]);
ShippingZone::create(['name' => 'Morocco', 'shipping_cost' => 17]);
ShippingZone::create(['name' => 'International', 'shipping_cost' => 90]);



    // Product::factory(100)->create()->each(function ($product) {
    //     // For each product, generate a few images
    //     Image::factory()->count(5)->create([
    //         'product_id' => $product->id,
    //     ]);
    // });
    }
}
