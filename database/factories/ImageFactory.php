<?php

namespace Database\Factories;
use App\Models\Image;
use App\Models\Product;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Image>
 */
class ImageFactory extends Factory
{
    protected $model = Image::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'file_path' => 'images/' . $this->faker->image('storage/app/public/images', 640, 480, null, false),
            'title' => $this->faker->word,
            'description' => $this->faker->sentence,
        ];
    }
}
