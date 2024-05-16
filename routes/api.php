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
Route::get('/user/list',[UserController::class,'userlist']);
Route::get('/user/edit/{id}',[UserController::class,'edit']);
Route::post('/user/update/{id}',[UserController::class,'update']);
Route::get('/product/list',[ProductController::class,'index']);
Route::get('/categories',[ProductController::class,'category']);
Route::get('/product/{id}',[ProductController::class,'show']);
Route::get('/search/{key}',[ProductController::class,'search']);


Route::post('/order/complete', [DeliveryController::class, 'completeOrder']);


//order Routes
Route::post('/order/create', [OrderController::class, 'store']);
Route::get('/success', [OrderController::class, 'success'])->name('checkout.success');
Route::get('/cancel', [OrderController::class, 'cancel'])->name('checkout.cancel');
Route::get('/generateQrCode', [OrderController::class, 'generateQrCode']);
Route::post('/webhook', [OrderController::class, 'webhook']);
//cart Route

Route::get('/cart/{id}', [CartController::class, 'index']);
Route::get('/cart/show/{id}',[CartController::class,'show']);
Route::post('/cart/update/{id}',[CartController::class,'update']);
Route::post('/cart/add-to-cart',[CartController::class,'store']);
Route::post('/cart/buy',[CartController::class,'create']);
Route::delete('/cart/delete/{id}',[CartController::class,'destroy']);



Route::post('/product/favorite/{product_id}', [CommentController::class, 'likeProduct'])->middleware('auth:api');
Route::post('/product/comment/{product_id}', [CommentController::class, 'comment'])->middleware('auth:api');
Route::get('/product/comments/{product_id}', [CommentController::class, 'getComments']);






