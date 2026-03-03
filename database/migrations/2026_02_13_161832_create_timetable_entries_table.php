<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('timetable_entries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('section_id')->constrained('sections')->onDelete('cascade');
            $table->foreignUuid('time_slot_id')->constrained('time_slots')->onDelete('cascade');
            $table->string('day_of_week');
            $table->foreignUuid('subject_id')->nullable()->constrained('subjects');
            $table->foreignUuid('teacher_id')->nullable()->constrained('teachers');
            $table->string('room_number')->nullable();
            $table->foreignUuid('academic_term_id')->constrained('academic_terms');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->unique(['section_id', 'time_slot_id', 'day_of_week', 'academic_term_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('timetable_entries'); }
};