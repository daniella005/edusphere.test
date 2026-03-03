<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Factories\TimeSlotFactory; // Ajoute cette ligne en haut du fichier

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */


public function run(): void
{
    Schema::disableForeignKeyConstraints();

    // 1. L'ÉCOLE ET L'ANNÉE (Niveaux 1-2)
    $school = \App\Models\School::factory()->create(['name' => 'Lycée Excellence']);
    $year = \App\Models\AcademicYear::factory()->create(['school_id' => $school->id]);

    // 2. LES MATIÈRES (Niveau 2/7)
    $subjects = \App\Models\Subject::factory()->count(5)->create(['school_id' => $school->id]);

    // 3. LES PROFS (Niveau 6)
    $teachers = \App\Models\Teacher::factory()->count(5)->create(['school_id' => $school->id]);

    // 4. LA STRUCTURE (Niveaux 3-4)
    $class = \App\Models\ClassModel::factory()->create([
        'school_id' => $school->id,
        'academic_year_id' => $year->id
    ]);
    
    $section = \App\Models\Section::factory()->create(['class_id' => $class->id]);

    // 5. LES ÉTUDIANTS (Niveau 6)
    \App\Models\Student::factory()->count(20)->create([
        'school_id' => $school->id,
        'section_id' => $section->id,
    ]);

    // 6. EXAMENS (Niveau 10)
    $term = \App\Models\AcademicTerm::factory()->create([
        'school_id' => $school->id,
        'name' => 'Premier Trimestre'
    ]);

    $examCat = \App\Models\ExamCategory::factory()->create([
        'school_id' => $school->id, 
        'name' => 'Évaluations'
    ]);

    // --- CORRECTION ICI : Fermeture du tableau et de la fonction create ---
    \App\Models\Exam::factory()->create([
        'school_id' => $school->id,
        'academic_term_id' => $term->id,
        'exam_category_id' => $examCat->id,
        'created_by' => \App\Models\User::first() ? \App\Models\User::first()->id : \App\Models\User::factory(),
        'exam_type' => 'written',
        'status' => 'active'
    ]); 

// 11. EMPLOI DU TEMPS (Timetables)
foreach ($subjects as $index => $subject) {
    // On crée un créneau horaire différent (Séquence 1, 2, 3...) pour chaque matière
    $slot = \App\Models\TimeSlot::factory()->create([
        'school_id' => $school->id,
        'name' => "Période " . ($index + 1),
        'sequence_order' => $index + 1,
        'start_time' => sprintf('%02d:00', 8 + $index), // 08:00, 09:00, etc.
        'end_time' => sprintf('%02d:00', 9 + $index),
    ]);

    \App\Models\TimetableEntry::factory()->create([
        'section_id' => $section->id,
        'subject_id' => $subject->id,
        'teacher_id' => $teachers->random()->id,
        'academic_term_id' => $term->id,
        'day_of_week' => 'Monday', 
        'time_slot_id' => $slot->id,
    ]);
}

// 12. PRÉSENCES (Attendances)
$allStudents = \App\Models\Student::all();
$adminId = \App\Models\User::first()->id; 

foreach ($allStudents as $student) {
    // On crée une présence pour "Aujourd'hui"
    \App\Models\Attendance::factory()->create([
        'id' => (string) \Illuminate\Support\Str::uuid(),
        'student_id' => $student->id,
        'section_id' => $student->section_id,
        'marked_by' => $adminId,
        'status' => 'present',
        'date' => now()->format('Y-m-d'), 
    ]);

    // On crée une présence pour "Hier" (pour éviter le conflit de date)
    \App\Models\Attendance::factory()->create([
        'id' => (string) \Illuminate\Support\Str::uuid(),
        'student_id' => $student->id,
        'section_id' => $student->section_id,
        'marked_by' => $adminId,
        'status' => 'present',
        'date' => now()->subDay()->format('Y-m-d'), 
    ]);
}

// 13. FINANCES
// On cherche le premier profil. S'il n'existe pas, on en crée un à la volée.
$adminProfile = \App\Models\Profile::first() ?? \App\Models\Profile::factory()->create();

foreach ($allStudents as $index => $student) {
    // 1. La Facture
    $invoice = \App\Models\StudentInvoice::factory()->create([
        'student_id' => $student->id,
        'academic_term_id' => $term->id,
        'invoice_number' => 'INV-2026-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT),
        'total_amount' => 150000,
        'balance_amount' => 100000,
        'status' => 'partially_paid',
    ]);

    // 2. Le Paiement
    \App\Models\FeePayment::factory()->create([
        'id' => (string) \Illuminate\Support\Str::uuid(),
        'receipt_number' => 'REC-2026-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT),
        'invoice_id' => $invoice->id,
        'student_id' => $student->id,
        'amount' => 50000,
        'payment_date' => now(),
        'received_by' => $adminProfile->id, // Ne sera plus NULL
        'payment_method' => 'cash',
    ]);
}
    Schema::enableForeignKeyConstraints();

    $this->command->info('Système complet (Niveaux 1-18) seedé avec succès !');
}

}
