<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ClassModel>
 */
class ClassModelFactory extends Factory
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
        'academic_year_id' => \App\Models\AcademicYear::factory(),
        'name' => $this->faker->randomElement(['Grade 1', 'Grade 2', 'Grade 3']),
        // 'code' => $this->faker->unique()->bothify('CL-###'), // Ajoute si ta table a un code
    ];
}
}
