<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('fee_structures', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('school_id')->constrained('schools')->onDelete('cascade');
            $table->foreignUuid('academic_year_id')->constrained('academic_years');
            $table->foreignUuid('class_id')->constrained('classes');
            $table->foreignUuid('fee_category_id')->constrained('fee_categories');
            $table->decimal('amount', 12, 2);
            $table->string('frequency');
            $table->integer('due_day')->nullable();
            $table->decimal('late_fee', 12, 2)->default(0);
            $table->string('late_fee_frequency')->nullable();
            $table->boolean('discount_available')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->unique(['school_id', 'academic_year_id', 'class_id', 'fee_category_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('fee_structures'); }
};