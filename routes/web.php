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

Route::view('/', 'welcome');

Route::view('dashboard', 'dashboard')
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
    ->name('create-role');

    Route::view('create/order', 'forms.create.create-order')
    ->middleware(['auth'])
    ->name('create-order');

    Route::view('product/edit/{productId}', 'forms.edit.edit-product')
    ->middleware(['auth'])
    ->name('products.edit');


require __DIR__.'/auth.php';


