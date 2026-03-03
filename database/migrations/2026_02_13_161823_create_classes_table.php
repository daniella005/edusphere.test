<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('classes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('school_id')->constrained('schools')->onDelete('cascade');
            $table->foreignUuid('academic_year_id')->constrained('academic_years')->onDelete('cascade');
            $table->string('name');
            $table->string('code')->nullable();
            $table->integer('level')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->unique(['school_id', 'academic_year_id', 'name']);
        });
    }
    public function down(): void { Schema::dropIfExists('classes'); }
};