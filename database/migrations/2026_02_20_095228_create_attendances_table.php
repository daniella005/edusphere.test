<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('attendances', function (Blueprint $table) {
        $table->uuid('id')->primary();
        $table->foreignUuid('student_id')->constrained('students')->onDelete('cascade');
        $table->foreignUuid('section_id')->constrained('sections')->onDelete('cascade');
        $table->foreignUuid('academic_term_id')->constrained('academic_terms');
        $table->date('attendance_date');
        // Status: present, absent, late, half_day
        $table->string('status')->default('present'); 
        $table->string('remark')->nullable();
        $table->foreignUuid('recorded_by')->constrained('profiles');
        $table->timestamps();

        // Un élève ne peut avoir qu'un seul enregistrement de présence par jour pour une section donnée
        $table->unique(['student_id', 'attendance_date', 'section_id'], 'student_attendance_unique');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
