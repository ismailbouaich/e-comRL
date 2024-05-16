<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProductCart;


class ProductCartController extends Controller
{
    public function index($id)
    {
        $productCarts = ProductCart::where('user_id', $id)
        ->with('product.images') // Eager load the product and its images
        ->get();

    return response()->json($productCarts);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required',
            'product_id' => 'required',
            'quantity' => 'required',
        ]);

        $productCart = ProductCart::create($request->all());
        return response()->json($productCart, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProductCart  $productCart
     * @return \Illuminate\Http\Response
     */
    public function show(ProductCart $productCart)
    {
        return response()->json($productCart);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProductCart  $productCart
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ProductCart $productCart)
    {
        $request->validate([
            'quantity' => 'required',
        ]);

        $productCart->update($request->all());
        return response()->json($productCart, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProductCart  $productCart
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $productCart = ProductCart::find($id);
    
        if ($productCart) {
            $productCart->delete();
            return response()->json(null, 204);
        } else {
            return response()->json(['error' => 'Item not found'], 404);
        }
    }
}
