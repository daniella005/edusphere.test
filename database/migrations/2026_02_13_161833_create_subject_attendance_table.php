<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('subject_attendance', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignUuid('timetable_entry_id')->constrained('timetable_entries');
            $table->date('date');
            $table->string('status');
            $table->foreignUuid('marked_by')->constrained('profiles');
            $table->text('remarks')->nullable();
            $table->timestamps();
            $table->unique(['student_id', 'timetable_entry_id', 'date']);
        });
    }
    public function down(): void { Schema::dropIfExists('subject_attendance'); }
};