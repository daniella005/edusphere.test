<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('exam_results', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('exam_schedule_id')->constrained('exam_schedules')->onDelete('cascade');
            $table->foreignUuid('student_id')->constrained('students')->onDelete('cascade');
            $table->decimal('marks_obtained', 5, 2)->nullable();
            $table->decimal('percentage', 5, 2)->nullable();
            $table->string('grade')->nullable();
            $table->decimal('grade_points', 3, 2)->nullable();
            $table->integer('rank_in_class')->nullable();
            $table->boolean('is_absent')->default(false);
            $table->boolean('is_exempted')->default(false);
            $table->text('remarks')->nullable();
            $table->foreignUuid('evaluated_by')->nullable()->constrained('profiles');
            $table->timestamp('evaluated_at')->nullable();
            $table->timestamps();
            $table->unique(['exam_schedule_id', 'student_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('exam_results'); }
};