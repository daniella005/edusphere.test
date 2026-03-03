<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('teacher_subjects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('teacher_id')->constrained('teachers')->onDelete('cascade');
            $table->foreignUuid('subject_id')->constrained('subjects')->onDelete('cascade');
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
            $table->unique(['teacher_id', 'subject_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('teacher_subjects'); }
};