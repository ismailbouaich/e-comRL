<?php

namespace App\Livewire\Create;

use App\Models\Product;
use Livewire\Component;
use App\Models\Discount;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;


class CreateDiscount extends Component
{
    public $name;
    public $code;
    public $discount_type;
    public $discount_value;
    public $start_date;
    public $end_date;
    public $is_active = true;
    public $minimum_order_amount;
    public $applies_to_all_products = true;
    public $product_ids = [];
    public $products = [];


    public function rules()
    {
        return [
            'name' => 'required|string',
            'code' => 'required|string|unique:discounts,code',
            'discount_type' => 'required|in:percentage,fixed_amount',
            'discount_value' => 'required|numeric|min:0.01',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'minimum_order_amount' => 'nullable|numeric|min:0.01',
            'applies_to_all_products' => 'required|boolean',
            'product_ids' => 'nullable|array',
        ];
    }

    public function createDiscount()
    {
      $this->validate();
    
      $data = $this->all();  // Get all validated data
    
      // Encode product_ids before saving
      if (isset($data['product_ids']) && !empty($data['product_ids'])) {
        $data['product_ids'] = json_encode($data['product_ids']);
      } else {
        // Set product_ids to an empty string if not provided
        $data['product_ids'] = '';
      }
    
      $discount = Discount::create($data);
    
      $this->reset(); // Reset form fields after successful creation
    }
public function generateCode()
{
    $this->code = Str::random(8); // Generate a random alphanumeric code
    $this->code = strtoupper($this->code); // Convert to uppercase for better readability (optional)
    
    // Check for code uniqueness (optional, but recommended for security)
    $existingDiscount = Discount::where('code', $this->code)->first();
    if ($existingDiscount) {
        $this->addError('code', 'Generated code already exists. Please try again.');
        return;
    }
}
public function mount()
{
    $this->products = Product::all(); // Assuming Product model
}
    public function render()
    {
        return view('livewire.create.create-discount');
    }
}
