<?php

namespace Database\Factories;

use App\Models\StudentInvoice;
use Illuminate\Database\Eloquent\Factories\Factory;

class FeePaymentFactory extends Factory
{
public function definition(): array
{
    return [
        'id' => fake()->uuid(),
        'receipt_number' => 'REC-' . strtoupper(fake()->bothify('###??###')),
        'invoice_id' => \App\Models\StudentInvoice::factory(),
        'student_id' => \App\Models\Student::factory(),
        'amount' => 50000,
        'payment_method' => 'cash',
        'payment_date' => now(),
        'received_by' => \App\Models\Profile::first()->id ?? \App\Models\Profile::factory(),
        'status' => 'paid',
    ];
}
}