<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('assignment_submissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('assignment_id')->constrained('assignments')->onDelete('cascade');
            $table->foreignUuid('student_id')->constrained('students')->onDelete('cascade');
            $table->text('submission_text')->nullable();
            $table->json('attachment_urls')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->string('status')->default('pending');
            $table->integer('attempt_number')->default(1);
            $table->boolean('is_late')->default(false);
            $table->decimal('marks_obtained', 5, 2)->nullable();
            $table->decimal('percentage', 5, 2)->nullable();
            $table->string('grade')->nullable();
            $table->text('feedback')->nullable();
            $table->foreignUuid('graded_by')->nullable()->constrained('profiles');
            $table->timestamp('graded_at')->nullable();
            $table->timestamps();
            $table->unique(['assignment_id', 'student_id', 'attempt_number']);
        });
    }
    public function down(): void { Schema::dropIfExists('assignment_submissions'); }
};