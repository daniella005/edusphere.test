<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Scholarship>
 */
class ScholarshipFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
public function definition(): array
{
    return [
        'id' => \Illuminate\Support\Str::uuid(),
        'school_id' => \App\Models\School::factory(),
        'name' => $this->faker->sentence(2) . ' Grant',
        'discount_type' => $this->faker->randomElement(['percentage', 'fixed']),
        'discount_value' => $this->faker->randomFloat(2, 10, 500),
        'is_active' => true,
        'valid_from' => now(),
        'valid_until' => now()->addYear(),
    ];
}
}
