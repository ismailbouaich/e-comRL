<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('customer_name'); 
            $table->unsignedBigInteger('customer_id'); 
            $table->unsignedBigInteger('delivery_worker_id');
            $table->string('status')->default('not_complete');
            $table->boolean('is_assigned')->default(false);
            $table->timestamps();
            $table->foreign('customer_id')->references('id')->on('users');
            $table->foreign('delivery_worker_id')->references('id')->on('users');
           
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
