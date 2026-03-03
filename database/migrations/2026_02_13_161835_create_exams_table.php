<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('exams', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('school_id')->constrained('schools')->onDelete('cascade');
            $table->foreignUuid('academic_term_id')->constrained('academic_terms');
            $table->foreignUuid('exam_category_id')->nullable()->constrained('exam_categories');
            $table->string('name');
            $table->string('exam_type');
            $table->text('description')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->string('status')->default('scheduled');
            $table->foreignUuid('created_by')->constrained('profiles');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('exams'); }
};