<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('subjects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('school_id')->constrained('schools')->onDelete('cascade');
            $table->string('code');
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignUuid('department_id')->nullable()->constrained('departments');
            $table->string('subject_type')->default('core');
            $table->integer('credits')->default(1);
            $table->decimal('passing_marks', 5, 2)->default(40.00);
            $table->decimal('max_marks', 5, 2)->default(100.00);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->unique(['school_id', 'code']);
        });
    }
    public function down(): void { Schema::dropIfExists('subjects'); }
};