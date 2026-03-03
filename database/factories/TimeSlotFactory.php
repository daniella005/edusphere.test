<?php

namespace Database\Factories;

use App\Models\TimeSlot;
use Illuminate\Database\Eloquent\Factories\Factory;

class TimeSlotFactory extends Factory
{
    protected $model = TimeSlot::class;

    public function definition(): array
{
    return [
        'id' => fake()->uuid(),
        'school_id' => \App\Models\School::first()->id ?? \App\Models\School::factory(),
        'name' => 'Matin 1',
        'start_time' => '08:00',
        'end_time' => '10:00',
        'sequence_order' => 1, // <--- AJOUTE CETTE LIGNE (ou rand(1, 10))
        'is_active' => true,
    ];
}
}