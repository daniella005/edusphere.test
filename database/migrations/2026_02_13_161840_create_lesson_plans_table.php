<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('lesson_plans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('teacher_id')->constrained('teachers')->onDelete('cascade');
            $table->foreignUuid('subject_id')->constrained('subjects');
            $table->foreignUuid('section_id')->constrained('sections');
            $table->foreignUuid('academic_term_id')->constrained('academic_terms');
            $table->string('title');
            $table->integer('week_number')->nullable();
            $table->string('topic');
            $table->text('objectives')->nullable();
            $table->text('content')->nullable();
            $table->text('materials')->nullable();
            $table->text('activities')->nullable();
            $table->text('assessment_methods')->nullable();
            $table->json('resources_urls')->nullable();
            $table->date('planned_date')->nullable();
            $table->integer('duration_minutes')->nullable();
            $table->string('status')->default('draft');
            $table->foreignUuid('approved_by')->nullable()->constrained('profiles');
            $table->timestamp('approved_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('lesson_plans'); }
};