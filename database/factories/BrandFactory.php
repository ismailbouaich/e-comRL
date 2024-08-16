<?php

namespace Database\Factories;
use App\Models\Brand;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Brand>
 */
class BrandFactory extends Factory
{
    protected $model = Brand::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' =>  $this->faker->unique()->company,
            'logo_path' => 'logos/' . $this->faker->image('storage/app/public/logos', 640, 480, null, false),
        ];
    }
}
