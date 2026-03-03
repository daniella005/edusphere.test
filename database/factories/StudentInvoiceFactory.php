<?php

namespace Database\Factories;

use App\Models\Student;
use App\Models\AcademicYear;
use Illuminate\Database\Eloquent\Factories\Factory;

class StudentInvoiceFactory extends Factory
{
   public function definition(): array
{
    return [
        'id' => fake()->uuid(),
        'invoice_number' => 'INV-' . strtoupper(fake()->bothify('###??###')),
        'student_id' => \App\Models\Student::factory(),
        'academic_term_id' => \App\Models\AcademicTerm::first()->id ?? \App\Models\AcademicTerm::factory(), // <--- AJOUTE CECI
        'subtotal' => 150000,
        'total_amount' => 150000,
        'balance_amount' => 0,
        'status' => 'pending',
        'due_date' => now()->addMonth(),
    ];
}
}