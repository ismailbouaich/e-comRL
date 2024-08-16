<?php

use Illuminate\Support\Facades\Route;

use App\Livewire\Tables\UsersTables;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/



Route::view('/', 'dashboard')
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::view('profile', 'profile')
    ->middleware(['auth'])
    ->name('profile');

    Route::view('users', 'tables.user-table')
    ->middleware(['auth'])
    ->name('users');

    Route::view('products', 'tables.product-table')
    ->middleware(['auth'])
    ->name('products');

    Route::view('orders', 'tables.order-table')
    ->middleware(['auth'])
    ->name('orders');

    Route::view('roles', 'tables.role-table')
    ->middleware(['auth'])
    ->name('roles');

    Route::view('categories', 'tables.category-table')
    ->middleware(['auth'])
    ->name('categories');

    Route::view('create/user', 'forms.create.create-user')
    ->middleware(['auth'])
    ->name('create-user');

      

    Route::view('create/product', 'forms.create.create-product')
    ->middleware(['auth'])
    ->name('create-product');

    Route::view('create/category', 'forms.create.create-category')
    ->middleware(['auth'])
    ->name('create-category');

    Route::view('create/role', 'forms.create.create-role')
    ->middleware(['auth'])
    ->name('create.role');

    Route::view('create/discount', 'forms.create.create-discount')
    ->middleware(['auth'])
    ->name('create.discount');

  

    Route::view('create/order', 'forms.create.create-order')
    ->middleware(['auth'])
    ->name('create.order');

    Route::view('create/brand', 'forms.create.create-brand')
    ->middleware(['auth'])
    ->name('create.brand');

    Route::view('product/edit/{productId}', 'forms.edit.edit-product')
    ->middleware(['auth'])
    ->name('products.edit');

    Route::view('user/edit/{userId}', 'forms.edit.edit-user')
    ->middleware(['auth'])
    ->name('users.edit');

    Route::view('order/edit/{orderId}', 'forms.edit.edit-order')
    ->middleware(['auth'])
    ->name('orders.edit');

    Route::view('/users/{userId}','forms.show.user-show')
    ->middleware(['auth'])
    ->name('users.show');

    Route::view('/orders/{id}', 'forms.show.order-show')
    ->middleware(['auth'])
    ->name('orders.show');


    Route::view('/products/{productId}', 'forms.show.product-show')
    ->middleware(['auth'])
    ->name('products.show');


require __DIR__.'/auth.php';


