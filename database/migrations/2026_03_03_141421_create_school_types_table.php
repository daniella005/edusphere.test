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
    Schema::create('school_types', function (Blueprint $table) {
        $table->uuid('id')->primary();
        $table->string('name')->unique(); // ex: Primaire, Secondaire, Université
        $table->string('slug')->unique(); // ex: primaire, secondaire
        $table->text('description')->nullable();
        $table->boolean('is_active')->default(true);
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('school_types');
    }
};
