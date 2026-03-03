<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void {
        // 1. On renomme l'ancienne table pour la sauvegarder temporairement
        Schema::rename('student_parents', 'student_parents_old');

        // 2. On crée la nouvelle table avec la BONNE contrainte (guardians)
        Schema::create('student_parents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignUuid('parent_id')->constrained('guardians')->onDelete('cascade'); // La correction est ici
            $table->string('relationship');
            $table->boolean('is_primary_contact')->default(false);
            $table->boolean('is_emergency_contact')->default(false);
            $table->boolean('can_pickup')->default(true);
            $table->timestamps();
        });

        // 3. On migre les données de l'ancienne vers la nouvelle
        $oldData = DB::table('student_parents_old')->get();
        foreach ($oldData as $row) {
            DB::table('student_parents')->insert((array)$row);
        }

        // 4. On supprime l'ancienne table de secours
        Schema::dropIfExists('student_parents_old');
    }

    public function down(): void {
        // En cas de rollback, on ne fait rien pour ne pas casser les données
    }
};