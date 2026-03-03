<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('student_scholarships', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignUuid('scholarship_id')->constrained('scholarships')->onDelete('cascade');
            $table->foreignUuid('academic_year_id')->constrained('academic_years');
            $table->date('awarded_date');
            $table->foreignUuid('awarded_by')->nullable()->constrained('profiles');
            $table->string('status')->default('active');
            $table->timestamp('revoked_at')->nullable();
            $table->text('revoke_reason')->nullable();
            $table->timestamps();
            $table->unique(['student_id', 'scholarship_id', 'academic_year_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('student_scholarships'); }
};