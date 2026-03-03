<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('student_academic_history', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignUuid('academic_year_id')->constrained('academic_years');
            $table->foreignUuid('section_id')->constrained('sections');
            $table->string('roll_number')->nullable();
            $table->string('final_grade')->nullable();
            $table->decimal('final_percentage', 5, 2)->nullable();
            $table->foreignUuid('promoted_to_section_id')->nullable()->constrained('sections');
            $table->text('remarks')->nullable();
            $table->timestamps();
            $table->unique(['student_id', 'academic_year_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('student_academic_history'); }
};