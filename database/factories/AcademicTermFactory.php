<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AcademicTerm>
 */
class AcademicTermFactory extends Factory
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
        'name' => $this->faker->randomElement(['Trimestre 1', 'Trimestre 2', 'Semestre 1']),
        'is_current' => true,
    ];
}
}
