<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SupportTicket>
 */
class SupportTicketFactory extends Factory
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
    'submitted_by' => \App\Models\Profile::factory(),
    'subject' => $this->faker->sentence(),
    'description' => $this->faker->paragraph(),
    'status' => 'open',
    'priority' => 'medium',
];
    }
}
