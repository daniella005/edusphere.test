<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
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
        'user_id' => \App\Models\User::factory(), // C'est ici qu'est le nom !
        'school_id' => \App\Models\School::factory(),
        'admission_number' => 'ADM-' . strtoupper($this->faker->bothify('##??#')),
        'admission_date' => now(),
        'status' => 'active',
        'transport_required' => false,
        'hostel_required' => false,
    ];
}
}
