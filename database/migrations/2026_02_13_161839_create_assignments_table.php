<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('assignments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('school_id')->constrained('schools')->onDelete('cascade');
            $table->foreignUuid('teacher_id')->constrained('teachers');
            $table->foreignUuid('subject_id')->constrained('subjects');
            $table->foreignUuid('section_id')->constrained('sections');
            $table->foreignUuid('academic_term_id')->constrained('academic_terms');
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('instructions')->nullable();
            $table->json('attachment_urls')->nullable();
            $table->timestamp('due_date');
            $table->decimal('total_marks', 5, 2);
            $table->decimal('weightage', 5, 2)->nullable();
            $table->string('status')->default('draft');
            $table->boolean('allow_late_submission')->default(false);
            $table->decimal('late_submission_penalty', 5, 2)->default(0);
            $table->integer('max_attempts')->default(1);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('assignments'); }
};