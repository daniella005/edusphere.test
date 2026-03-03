<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teachers', function (Blueprint $table) {
            $table->uuid('id')->primary(); // On utilise UUID ici
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('school_id')->constrained('schools')->onDelete('cascade');
            $table->foreignUuid('department_id')->nullable()->constrained('departments')->onDelete('set null');
            
            $table->string('employee_id')->unique();
            $table->string('qualification')->nullable();
            $table->string('specialization')->nullable();
            $table->integer('experience_years')->default(0);
            $table->date('joining_date')->nullable();
            $table->string('status')->default('active'); // active, inactive, etc.
            
            // On ajoute les autres colonnes pour correspondre à ton modèle
            $table->string('contract_type')->nullable();
            $table->decimal('salary', 10, 2)->nullable();
            $table->string('bank_name')->nullable();
            $table->string('bank_account_number')->nullable();
            $table->string('tax_id')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->boolean('is_class_teacher')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teachers');
    }
};