<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('report_cards', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignUuid('academic_term_id')->constrained('academic_terms');
            $table->decimal('total_marks', 7, 2)->nullable();
            $table->decimal('marks_obtained', 7, 2)->nullable();
            $table->decimal('percentage', 5, 2)->nullable();
            $table->string('grade')->nullable();
            $table->decimal('gpa', 3, 2)->nullable();
            $table->integer('rank_in_class')->nullable();
            $table->integer('rank_in_section')->nullable();
            $table->decimal('attendance_percentage', 5, 2)->nullable();
            $table->text('teacher_remarks')->nullable();
            $table->text('principal_remarks')->nullable();
            $table->string('status')->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->unique(['student_id', 'academic_term_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('report_cards'); }
};