<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('students', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('profiles')->onDelete('cascade');
            $table->foreignUuid('school_id')->constrained('schools')->onDelete('cascade');
            $table->string('admission_number');
            $table->foreignUuid('section_id')->constrained('sections');
            $table->string('roll_number')->nullable();
            $table->date('admission_date');
            $table->string('previous_school')->nullable();
            $table->string('blood_group')->nullable();
            $table->text('medical_conditions')->nullable();
            $table->text('allergies')->nullable();
            $table->string('nationality')->default('Nigerian');
            $table->string('religion')->nullable();
            $table->string('caste')->nullable();
            $table->string('mother_tongue')->nullable();
            $table->boolean('transport_required')->default(false);
            $table->boolean('hostel_required')->default(false);
            $table->foreignUuid('scholarship_id')->nullable();
            $table->string('status')->default('active');
            $table->date('withdrawal_date')->nullable();
            $table->text('withdrawal_reason')->nullable();
            $table->timestamps();
            $table->unique(['school_id', 'admission_number']);
            $table->unique(['user_id', 'school_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('students'); }
};