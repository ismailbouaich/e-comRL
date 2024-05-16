<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;


use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Favorite;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CommentController extends Controller

{
    public function likeProduct($product_id)
    {
        $product = Product::find($product_id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], Response::HTTP_NOT_FOUND);
        }

        $liked = $product->favorites()->where('user_id', auth()->id())->exists();

        if ($liked) {
            $product->favorites()->detach(auth()->id());
            return response()->json(['message' => 'Unliked'], Response::HTTP_OK);
        } else {
            $product->favorites()->attach(auth()->id());
            return response()->json(['message' => 'Liked'], Response::HTTP_OK);
        }
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

        return response()->json(['message' => 'Comment added successfully'], Response::HTTP_CREATED);
    }

    public function getComments($product_id)
    {
        $comments = Comment::with('product')->with('user')->whereProductId($product_id)->latest()->get();

        return response([
            'comments' => $comments
        ], 200);
    }
   
}
