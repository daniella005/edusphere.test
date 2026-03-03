<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('guardians', function (Blueprint $table) {
            $table->uuid('id')->primary();
            // On lie au User (ou au Profile selon ta préférence, ici User pour la cohérence)
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('school_id')->constrained('schools')->onDelete('cascade');
            
            $table->string('occupation')->nullable();
            $table->string('employer')->nullable();
            $table->string('office_address')->nullable();
            $table->string('office_phone')->nullable();
            $table->decimal('annual_income', 12, 2)->nullable();
            $table->string('education_level')->nullable();
            $table->string('relationship_type')->nullable(); // Père, Mère, Tuteur...
            $table->string('status')->default('active');
            
            $table->timestamps();
        });

        // Table pivot pour la relation Many-to-Many avec les étudiants
        Schema::create('student_guardians', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignUuid('guardian_id')->constrained('guardians')->onDelete('cascade');
            $table->string('relationship')->nullable(); // Précision par enfant
            $table->boolean('is_emergency_contact')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('student_guardians');
        Schema::dropIfExists('guardians');
    }
};