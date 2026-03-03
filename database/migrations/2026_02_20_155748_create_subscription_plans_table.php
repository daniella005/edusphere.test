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
    Schema::create('subscription_plans', function (Blueprint $table) {
        $table->uuid('id')->primary(); // Utilise UUID pour être cohérent avec ton modèle
        $table->string('name', 100)->unique();
        $table->string('code')->unique()->nullable();
        $table->text('description')->nullable();
        $table->decimal('price', 15, 2);
        $table->string('billing_cycle'); // monthly, yearly, etc.
        $table->integer('max_students')->nullable();
        $table->integer('max_teachers')->nullable();
        $table->integer('max_staff')->nullable();
        $table->json('features')->nullable();
        $table->boolean('is_active')->default(true);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscription_plans');
    }
};
