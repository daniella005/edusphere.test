<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('grade_scale_entries', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->foreignUuid('grade_scale_id')->constrained()->onDelete('cascade');
    $table->string('grade_name'); // ex: "A+", "Excellent", "18/20"
    $table->decimal('minimum_score', 5, 2); // ex: 90.00
    $table->decimal('maximum_score', 5, 2); // ex: 100.00
    $table->decimal('grade_points', 4, 2)->nullable(); // Pour le calcul de la moyenne (GPA)
    $table->string('description')->nullable();
    $table->timestamps();
});
    }
    public function down(): void { Schema::dropIfExists('grade_scale_entries'); }
};