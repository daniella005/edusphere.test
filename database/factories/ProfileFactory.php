<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Profile>
 */
class ProfileFactory extends Factory
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
        'user_id' => \App\Models\User::factory(),
        'first_name' => $this->faker->firstName(),
        'last_name' => $this->faker->lastName(),
        'email' => $this->faker->unique()->safeEmail(),
        'phone' => $this->faker->phoneNumber(),
        'status' => 'active',
        // 'school_id' n'est pas nécessaire ici d'après tes tests précédents
    ];
}
}
