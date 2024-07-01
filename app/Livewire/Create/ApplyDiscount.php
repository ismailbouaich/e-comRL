<?php

namespace App\Livewire\Create;

use Livewire\Component;
use Illuminate\Support\Facades\Validator;
use App\Models\Discount;
use App\Models\Product;

class ApplyDiscount extends Component
{
    public $product_ids = [];
    public $discount_code;
    public $discountedProducts = [];
    public $products = [];



    public function rules()
    {
        return [
            'product_ids' => 'required|array',
            'discount_code' => 'required|string',
        ];
    }

    public function applyDiscount()
    {
        $this->validate();

        $discount = Discount::where('code', $this->discount_code)->first();

        if (!$discount || !$discount->is_active) {
            $this->addError('discount_code', 'Invalid discount code');
            return;
        }

        $products = Product::whereIn('id', $this->product_ids)->get();
        $discountProductIds = json_decode($discount->product_ids, true);  // Decode product_ids to array (if JSON)


        $this->discountedProducts = [];
        foreach ($products as $product) {
            if ($discount->applies_to_all_products || (isset($discountProductIds) && in_array($product->id, $discountProductIds))) {
                $discountedPrice = $discount->calculateDiscountedPrice($product);
                $this->discountedProducts[] = [
                    'id' => $product->id,
                    'original_price' => $product->price,
                    'discounted_price' => $discountedPrice,
                ];
            }
        }
    }

    public function mount()
    {
        $this->products = Product::all(); // Assuming you have a Role model
    }
    public function render()
    {
        return view('livewire.create.apply-discount');
    }
}
