<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('teacher_sections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('teacher_id')->constrained('teachers')->onDelete('cascade');
            $table->foreignUuid('section_id')->constrained('sections')->onDelete('cascade');
            $table->foreignUuid('subject_id')->constrained('subjects')->onDelete('cascade');
            $table->foreignUuid('academic_year_id')->constrained('academic_years');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->unique(['teacher_id', 'section_id', 'subject_id', 'academic_year_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('teacher_sections'); }
};