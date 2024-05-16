<?php

namespace App\Http\Controllers\Api;

use App\Models\Image;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;


class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $product= Product::with('images','category')->get();

        return response()->json($product);
    }

    public function search(Request $request)
    {
        $key = $request->key;
        $products = Product::where('product_name', 'LIKE', "%{$key}%")->with('images','category')->get();
        if ($products->isNotEmpty()) {
            return response()->json($products); // Return JSON response when products found
        } else {
            return response()->json(['message' => 'Not Found!'], 404); // Return JSON response with 404 status
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
            $product= Product::with('images','category')->find($id);
            return response()->json($product);
        } catch (\Exception $e) {
            return response()->json(['error' => 'product not found'], 404);
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
