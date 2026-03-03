<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Teacher>
 */
class TeacherFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array {
    return [
        'id' => \Illuminate\Support\Str::uuid(),
        'user_id' => \App\Models\User::factory(),
        'school_id' => \App\Models\School::factory(),
        'employee_id' => 'TCH-' . $this->faker->unique()->numberBetween(1000, 9999),
        'joining_date' => $this->faker->date(),
        'status' => 'active',
    ];
}
}
