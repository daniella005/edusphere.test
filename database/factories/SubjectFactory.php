<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Subject>
 */
class SubjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
public function definition(): array {
    return [
        'id' => \Illuminate\Support\Str::uuid(),
        'school_id' => \App\Models\School::factory(),
        'name' => $this->faker->randomElement(['Mathématiques', 'Physique', 'Français', 'Histoire']),
        'code' => strtoupper($this->faker->unique()->bothify('??###')),
        'subject_type' => 'theory',
        'is_active' => true,
    ];
}
}
