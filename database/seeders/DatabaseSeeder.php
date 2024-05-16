<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
     

       User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@admin.com',

            'role_id' => '1',
        ]);

        User::factory()
        ->count(10)
        ->create([
            'role_id' => '3',
        ]);

    User::factory()
        ->count(5)
        ->create([
            'role_id' => '2',
        ]);
    }
}
