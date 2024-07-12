<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Models\Image;
use App\Models\Product;
use App\Models\Category;
use App\Models\Discount;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\OrderDetail;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with('images', 'category', 'discounts')->get();
        
        // Iterate through products and check for active discounts
        foreach ($products as $product) {
            $productDiscount = $product->discounts->where('is_active', true)
                                                  ->where('start_date', '<=', now())
                                                  ->where('end_date', '>=', now())
                                                  ->first();
            if ($productDiscount) {
                $product->is_discounted = true;
                if ($productDiscount->discount_type === 'percentage') {
                    $product->discounted_price = $product->price * (1 - $productDiscount->discount_value / 100);
                } else {
                    $product->discounted_price = $product->price - $productDiscount->discount_value;
                }
                $product->discount_name = $productDiscount->name;
                $product->discount_code = $productDiscount->code;
            } else {
                $product->is_discounted = false;
            }
        }
    
        return response()->json($products);
    }
    
    

    public function bestSellingProduct(){

      $bestsellingPrd=OrderDetail::bestSellingProduct();

      return response()->json($bestsellingPrd);


    }

    public function search(Request $request)
    {
     try {
      
      $key = $request->key;
    
      $products = Product::with('images', 'category', 'discounts','brand')
      ->search($key)
      ->get();
        
      
      foreach ($products as $product) {
          $productDiscount = $product->discounts->where('is_active', true)
                                                ->where('start_date', '<=', now())
                                                ->where('end_date', '>=', now())
                                                ->first();
          if ($productDiscount) {
              $product->is_discounted = true;
              if ($productDiscount->discount_type === 'percentage') {
                  $product->discounted_price = $product->price * (1 - $productDiscount->discount_value / 100);
              } else {
                  $product->discounted_price = $product->price - $productDiscount->discount_value;
              }
              $product->discount_name = $productDiscount->name;
              $product->discount_code = $productDiscount->code;
          } else {
              $product->is_discounted = false;
          }
      }
  
      return response()->json($products);
     } catch (\Exception $exception) {
      return response(['message'=>$exception->getMessage()],400);
     }
      
    }
    
    public function category()
    {
        $category= Category::has('products')->get();
        
        return response()->json($category);
    }

    public function brand()
    {
        $brand= Brand::has('products')->get();
        
        return response()->json($brand);
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
                $currentDiscount = $product->currentDiscount();
                
                // Include discount information in the product response
                if ($currentDiscount) {
                    $product->is_discounted = true;
                    if ($currentDiscount->discount_type === 'percentage') {
                        $product->discounted_price = $product->price * (1 - $currentDiscount->discount_value / 100);
                    } else {
                        $product->discounted_price = $product->price - $currentDiscount->discount_value;
                    }
                    $product->discount_name = $currentDiscount->name;
                    $product->discount_code = $currentDiscount->code;
                } else {
                    $product->is_discounted = false;
                }
                
                return response()->json($product);
            } else {
                return response()->json(['error' => 'Product not found'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Internal server error'], 500); // Handle internal errors more gracefully
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
