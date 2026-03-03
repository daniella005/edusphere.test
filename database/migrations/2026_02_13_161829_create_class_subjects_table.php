<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('class_subjects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('class_id')->constrained('classes')->onDelete('cascade');
            $table->foreignUuid('subject_id')->constrained('subjects')->onDelete('cascade');
            $table->boolean('is_mandatory')->default(true);
            $table->integer('periods_per_week')->default(4);
            $table->timestamps();
            $table->unique(['class_id', 'subject_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('class_subjects'); }
};