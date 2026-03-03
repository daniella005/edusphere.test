<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Exam>
 */
class ExamFactory extends Factory
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
        'academic_term_id' => \App\Models\AcademicTerm::factory(), // On ajoute le Term
        'exam_category_id' => \App\Models\ExamCategory::factory(),
        'name' => $this->faker->randomElement(['Composition 1', 'Examen Final']),
        'exam_type' => 'written', // Valeur par défaut
        'description' => $this->faker->sentence(),
        'start_date' => now()->addDays(7)->format('Y-m-d'),
        'end_date' => now()->addDays(14)->format('Y-m-d'),
        'status' => 'scheduled',
        'created_by' => \App\Models\User::factory(), // On lie à un utilisateur
    ];
}
}
