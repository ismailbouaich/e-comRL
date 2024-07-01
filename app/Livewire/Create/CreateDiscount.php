<?php

namespace App\Livewire\Create;

use App\Models\Product;
use Livewire\Component;
use App\Models\Discount;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;


class CreateDiscount extends Component
{
    public $name;
    public $code;
    public $discount_type;
    public $discount_value;
    public $start_date;
    public $end_date;
    public $is_active = true;
    public $product_id;
    public $products = [];

    public function rules()
    {
        return [
            'name' => 'required|string',
            'code' => ['required', 'string', 'unique:discounts,code'],
            'discount_type' => ['required', Rule::in(['percentage', 'fixed'])],
            'discount_value' => 'required|numeric|min:0.01',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'product_id' => 'required|exists:products,id',
        ];
    }

    public function createDiscount()
    {
        $validatedData = $this->validate();
    
        // Create the discount
        $discount = Discount::create($validatedData);
    
        // Reset form fields after successful creation
        $this->reset();
    }

    public function generateCode()
    {
        do {
            $this->code = strtoupper(Str::random(8)); // Generate a random alphanumeric code
            $existingDiscount = Discount::where('code', $this->code)->first();
        } while ($existingDiscount); // Repeat if the code already exists
    
        // Clear any previous code errors
        $this->resetErrorBag('code');
    }

    public function mount()
    {
        $this->products = Product::all();
    }

    public function render()
    {
        return view('livewire.create.create-discount');
    }
}
