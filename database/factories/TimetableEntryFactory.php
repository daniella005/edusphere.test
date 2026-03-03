<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TimetableEntry>
 */
class TimetableEntryFactory extends Factory
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
        'section_id' => \App\Models\Section::factory(),
        'subject_id' => \App\Models\Subject::factory(),
        'teacher_id' => \App\Models\Teacher::factory(),
        'day_of_week' => $this->faker->randomElement(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
        // Si Tinker t'a montré 'time_slot_id', décommente la ligne suivante :
        // 'time_slot_id' => \App\Models\TimeSlot::factory(),
    ];
}
}
