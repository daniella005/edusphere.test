<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('exam_schedules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('exam_id')->constrained('exams')->onDelete('cascade');
            $table->foreignUuid('subject_id')->constrained('subjects');
            $table->foreignUuid('class_id')->constrained('classes');
            $table->date('exam_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('duration_minutes');
            $table->foreignUuid('room_id')->nullable()->constrained('rooms');
            $table->decimal('total_marks', 5, 2);
            $table->decimal('passing_marks', 5, 2);
            $table->foreignUuid('invigilator_id')->nullable()->constrained('teachers');
            $table->text('syllabus_covered')->nullable();
            $table->text('instructions')->nullable();
            $table->string('status')->default('scheduled');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('exam_schedules'); }
};