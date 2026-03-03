<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Section>
 */
class SectionFactory extends Factory
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
        'class_id' => \App\Models\ClassModel::factory(), // La section est liée à la classe
        'name' => $this->faker->randomElement(['Section A', 'Section B', 'Elite']),
        'is_active' => true,
        // Retire la ligne 'school_id' ici car elle n'existe pas dans ta table
    ];
}
}
