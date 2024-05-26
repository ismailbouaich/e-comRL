<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Models\Image;
use App\Models\Product;
use App\Models\Category;
use App\Models\Discount;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;


class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with('images', 'category')->get();
        $activeDiscounts = Discount::where('is_active', true)->get();

        
    
        // Check if there are any active discounts
        $hasActiveDiscounts = $activeDiscounts->isNotEmpty();
    
        if ($hasActiveDiscounts) {
            // If there are active discounts, iterate through products and set a flag for discounted products
            foreach ($products as $product) {
                $product->discounted = false;
                  // Initialize flag for discounted products
                foreach ($activeDiscounts as $discount) {
                    $productIdsArray = json_decode($discount->product_ids, true);
                    // Decode product_ids to array

                    if ($discount->applies_to_all_products || (isset($productIdsArray) && !empty($productIdsArray) && in_array($product->id, $productIdsArray))) {
                        $product->discounted = true;
                        $product->discounted_price = $discount->calculateDiscountedPrice($product);
                        break; // Exit loop after finding a matching discount
                    }
                }
            }
        }
    
        return response()->json($products);
    }

    public function search(Request $request)
    {
      $key = $request->key;
    
      // Use scopeSearch for product search with eager loading (optional for images and category)
      $products = Product::with('images', 'category') // Adjust eager loading as needed
        ->search($key) // Use the scopeSearch with the search keyword
        ->get();
    
      // Retrieve active discounts separately
      $activeDiscounts = Discount::where('is_active', true)->get();
    
      if ($products->isNotEmpty()) {
        foreach ($products as $product) {
            $product->discounted = false;
            foreach ($activeDiscounts as $discount) {
                $productIdsArray = json_decode($discount->product_ids, true);
                if ($discount->applies_to_all_products || (isset($productIdsArray) && !empty($productIdsArray) && in_array($product->id, $productIdsArray))) {
                    $product->discounted = true;
                $product->discounted_price = $discount->calculateDiscountedPrice($product); // Assuming a calculateDiscountedPrice method
                break; // Exit loop after finding a matching discount (optional)
              }
            }
          }
          return response()->json($products); // Return JSON response when products found
        } else {
           
            return response()->json(
                ['message'=>'errror',504]
            ); // Return JSON response when products found
      }
    }
    
    public function category()
    {
        $category= Category::has('products')->get();
        
        return response()->json($category);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'product_name' => 'required|string',
                'description' => 'required|string',
                'price' => 'required|numeric',
                'stock_quantity' => 'required|integer',
                'category_id' => 'required|exists:categories,id',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
            
            // Create a new product
            $product = new Product($validatedData);
            $product->category_id = $request->input('category_id');
            $product->save();
        
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $imagefile) { 
                    $image = new Image();
                    $imagePath = $imagefile->store('/images');
                    $imagePath = str_replace('public/', '', $imagePath);
                    $image->product_id = $product->id;
                    $image->file_path = $imagePath;
                    $image->title = 'Image Title';
                    $image->description = 'Image Description';
                    $image->save();
                }
            }

            
            return response([
                'message'=>'create Successfully ',
              
              ],200);
            

        } catch (\Exception $exception) {
            return response(['message'=>$exception->getMessage()],400);

        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
      try {
        $product = Product::with('images', 'category')->find($id);
        if ($product) {
          $activeDiscounts = Discount::where('is_active', true)->get();
          $discountedPrice = null;
    
          foreach ($activeDiscounts as $discount) {
            $productIdsArray = json_decode($discount->product_ids, true);

            if ($discount->applies_to_all_products || (isset($productIdsArray) && !empty($productIdsArray) && in_array($product->id, $productIdsArray))) {
                $discountedPrice = $discount->calculateDiscountedPrice($product);
              break; // Exit loop after finding a matching discount
            }
          }
    
          if ($discountedPrice !== null) {
            $product->discounted_price = $discountedPrice; // Add discounted_price property if applicable
          }
    
          return response()->json($product);
        } else {
          return response()->json(['error' => 'product not found'], 404);
        }
      } catch (\Exception $e) {
        return response()->json(['error' => 'internal server error'], 500); // Handle internal errors more gracefully
      }
    }
    
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

  
}
