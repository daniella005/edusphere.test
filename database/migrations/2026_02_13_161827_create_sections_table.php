<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('sections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('class_id')->constrained('classes')->onDelete('cascade');
            $table->string('name');
            $table->integer('capacity')->default(40);
            $table->foreignUuid('class_teacher_id')->nullable()->constrained('teachers');
            $table->string('room_number')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->unique(['class_id', 'name']);
        });
    }
    public function down(): void { Schema::dropIfExists('sections'); }
};