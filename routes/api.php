<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ResetController;

use App\Http\Controllers\Api\ForgetController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\DeliveryController;
use App\Http\Controllers\Api\ProductCartController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });


//Login Routes


Route::post('/login',[AuthController::class,'login']);

Route::post('/login_delivery', [AuthController::class,'loginDelivery']);
Route::post('/register_delivery', [AuthController::class,'registerDelivery']);


Route::get('/user',[UserController::class,'user'])->middleware('auth:api');
Route::post('/register',[AuthController::class,'register']);
Route::post('/forgetPassword',[ForgetController::class,'forgetPassword']);
Route::post('/resetPassword',[ResetController::class,'resetPassword']);




//store routes

Route::get('/user/edit/{id}',[UserController::class,'edit']);
Route::post('/user/update/{id}',[UserController::class,'update']);



Route::get('/product/mostSelling',[ProductController::class,'bestSellingProduct']);

Route::middleware('throttle:60,1')->group(function () {


Route::get('/product/list',[ProductController::class,'index']);
Route::get('/categories',[ProductController::class,'category']);

Route::get('/brands',[ProductController::class,'brand']);


});

Route::get('/product/{id}',[ProductController::class,'show']);

Route::get('/search/{searchKey}',[ProductController::class,'search']);


Route::post('/order/complete', [DeliveryController::class, 'completeOrder']);


//order Routes
Route::post('/order/create', [OrderController::class, 'store']);
Route::get('/success', [OrderController::class, 'success'])->name('checkout.success');


Route::get('/products', [ProductController::class, 'bestRatedProducts']);


Route::get('/cancel', [OrderController::class, 'cancel'])->name('checkout.cancel');
Route::post('/webhook', [OrderController::class, 'webhook']);


Route::get('/failed', [OrderController::class, 'failed'])->name('checkout.failed');



Route::post('/orders/{userId}', [OrderController::class, 'orderHistory']);
Route::get('/generateQrCode', [OrderController::class, 'generateQrCode']);



//cart Route

Route::get('/cart/{id}', [CartController::class, 'index']);
Route::get('/cart/show/{id}',[CartController::class,'show']);
Route::post('/cart/update/{id}',[CartController::class,'update']);
Route::post('/cart/add-to-cart',[CartController::class,'store']);
Route::post('/cart/buy',[CartController::class,'create']);
Route::delete('/cart/delete/{id}',[CartController::class,'destroy']);



Route::get('/user/favorites', [CommentController::class, 'getUserFavorites'])->middleware('auth:api');
Route::post('/product/{productId}/favorite', [CommentController::class, 'favoriteProduct']);

Route::get('/product/ratings/{product_id}', [CommentController::class, 'getProductRatings']);
Route::post('/product/ratings/{product_id}', [CommentController::class, 'ratingProduct'])->middleware('auth:api');

Route::post('/product/comment/{product_id}', [CommentController::class, 'comment'])->middleware('auth:api');
Route::get('/product/comments/{product_id}', [CommentController::class, 'getComments']);


// Routes that require authentication
// Route::middleware('auth:api')->group(function () {
//     Route::get('/user', [UserController::class, 'user']);
//     Route::get('/user/edit/{id}', [UserController::class, 'edit']);
//     Route::post('/user/update/{id}', [UserController::class, 'update']);
//     Route::get('/failed', [OrderController::class, 'failed']);

//     Route::get('/product/list', [ProductController::class, 'index']);
//     Route::get('/product/mostSelling', [ProductController::class, 'bestSellingProduct']);
//     Route::get('/categories', [ProductController::class, 'category']);
//     Route::get('/brands', [ProductController::class, 'brand']);
//     Route::get('/product/{id}', [ProductController::class, 'show']);
//     Route::get('/search/{key}', [ProductController::class, 'search']);

//     Route::post('/order/complete', [DeliveryController::class, 'completeOrder']);
//     Route::post('/order/create', [OrderController::class, 'store']);
//     Route::post('/orders/{userId}', [OrderController::class, 'orderHistory']);

//     Route::get('/cart/{id}', [CartController::class, 'index']);
//     Route::get('/cart/show/{id}', [CartController::class, 'show']);
//     Route::post('/cart/update/{id}', [CartController::class, 'update']);
//     Route::post('/cart/add-to-cart', [CartController::class, 'store']);
//     Route::post('/cart/buy', [CartController::class, 'create']);
//     Route::delete('/cart/delete/{id}', [CartController::class, 'destroy']);

//     Route::get('/user/favorites', [CommentController::class, 'getUserFavorites']);
//     Route::post('/product/favorite/{productId}', [CommentController::class, 'favoriteProduct']);
//     Route::get('/product/ratings/{product_id}', [CommentController::class, 'getProductRatings']);
//     Route::post('/product/ratings/{product_id}', [CommentController::class, 'ratingProduct']);
//     Route::post('/product/comment/{product_id}', [CommentController::class, 'comment']);
//     Route::get('/product/comments/{product_id}', [CommentController::class, 'getComments']);
// });





