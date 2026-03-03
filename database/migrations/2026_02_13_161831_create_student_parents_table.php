<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
     Schema::create('student_parents', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->foreignUuid('student_id')->constrained('students')->onDelete('cascade');
    
    // ICI : Vérifie que c'est bien 'guardians' et non 'parents'
    $table->foreignUuid('parent_id')->constrained('guardians')->onDelete('cascade');
    
    $table->string('relationship');
    $table->boolean('is_primary_contact')->default(false);
    $table->boolean('is_emergency_contact')->default(false);
    $table->boolean('can_pickup')->default(true);
    $table->timestamps();
});
    }
    public function down(): void { Schema::dropIfExists('student_parents'); }
};