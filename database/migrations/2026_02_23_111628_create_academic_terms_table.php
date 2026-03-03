<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up(): void
{
    Schema::create('academic_terms', function (Blueprint $table) {
        $table->uuid('id')->primary();
        // On utilise foreignUuid si tes autres tables utilisent des UUID
        $table->foreignUuid('school_id')->constrained()->onDelete('cascade');
        $table->foreignUuid('academic_year_id')->constrained()->onDelete('cascade');
        
        $table->string('name'); // ex: "1er Trimestre"
        $table->string('term_type')->default('trimestre'); // trimestre, semestre, session
        
        $table->date('start_date');
        $table->date('end_date');
        
        $table->boolean('is_current')->default(false);
        $table->integer('display_order')->default(1);
        $table->json('settings')->nullable(); // Pour stocker des options flexibles
        
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_terms');
    }
};
