<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
     // Migration rapide pour ReportCardSubject
Schema::create('report_card_subjects', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->foreignUuid('report_card_id')->constrained()->onDelete('cascade');
    $table->foreignUuid('subject_id')->constrained();
    $table->decimal('total_marks', 7, 2)->nullable();
    $table->decimal('marks_obtained', 7, 2)->nullable();
    $table->decimal('percentage', 5, 2)->nullable();
    $table->string('grade')->nullable();
    $table->decimal('grade_points', 4, 2)->nullable();
    $table->text('teacher_remarks')->nullable();
    $table->timestamps();
});
    }
    public function down(): void { Schema::dropIfExists('report_card_subjects'); }
};