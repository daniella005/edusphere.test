<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\School>
 */
class SchoolFactory extends Factory
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
        'name' => $this->faker->company() . ' Academy',
        'code' => strtoupper($this->faker->unique()->lexify('???-###')), // AJOUTE CETTE LIGNE
        'address' => $this->faker->address(),
        'email' => $this->faker->unique()->safeEmail(),
        'phone' => $this->faker->phoneNumber(),
        'is_active' => true,
    ];
}
}
