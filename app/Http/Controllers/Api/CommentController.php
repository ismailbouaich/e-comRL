<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;


use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Favorite;
use App\Models\Product;
use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CommentController extends Controller

{
   

    
     public function ratingProduct($product_id,Request $request)
    {

        $request->validate([
            'user_id'=>'required',
            'product_id'=>'required',
            'rating'=>'required'
        ]);

        $product = Product::find($product_id);

        

        if (!$product) {
            return response()->json(['message' => 'Product not found'], Response::HTTP_NOT_FOUND);
        }
        Rating::create($request->all());


       return response()->json(['message' => 'Thank You For Sharing Your View'],201);
    }

    public function comment(Request $request, $product_id)
    {
        $request->validate([
            'body' => 'required|string|max:255',
        ]);

        $comment = Comment::create([
            'user_id' => auth()->id(),
            'product_id' => $product_id,
            'body' => $request->body
        ]);

        $comment->save();

        return response()->json(['message' => 'Comment added successfully'], Response::HTTP_CREATED);
    }

    public function getComments($product_id)
    {
        $comments = Comment::with('product')->with('user')->whereProductId($product_id)->latest()->get();

        return response([
            'comments' => $comments
        ], 200);
    }

    public function getProductRatings($productId)
    {
        $product = Product::find($productId);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], Response::HTTP_NOT_FOUND);
        }

        $ratings = $product->ratings;

        return response()->json($ratings, Response::HTTP_OK);
    }

    public function getUserFavorites()
{
    $user = auth()->user();

    if (!$user) {
        return response()->json(['message' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
    }

    $favorites = $user->favoriteProducts;

    return response()->json($favorites, Response::HTTP_OK);
}
 public function favoriteProduct($productId)
    {
        $product = Product::find($productId);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], Response::HTTP_NOT_FOUND);
        }

        $favorite = $product->favorites()->where('user_id', auth()->id())->exists();

        if ($favorite) {
            $product->favorites()->detach(auth()->id());
            return response()->json(['message' => 'Unliked'], Response::HTTP_OK);
        } else {
            $product->favorites()->attach(auth()->id());
            return response()->json(['message' => 'Liked'], Response::HTTP_OK);
        }
    }
   
}
