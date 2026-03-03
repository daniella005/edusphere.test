<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AcademicYear>
 */
class AcademicYearFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
public function definition(): array
{
    $start = $this->faker->dateTimeBetween('-1 year', 'now');
    $end = (clone $start)->modify('+1 year');

    return [
        'id' => \Illuminate\Support\Str::uuid(),
        'school_id' => \App\Models\School::factory(),
        'name' => $start->format('Y') . '-' . $end->format('Y'),
        'start_date' => $start->format('Y-m-d'),
        'end_date' => $end->format('Y-m-d'),
        'is_current' => true,
        // Supprime la ligne 'status' ici
    ];
}
}
