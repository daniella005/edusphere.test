<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('staff', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('profiles')->onDelete('cascade');
            $table->foreignUuid('school_id')->constrained('schools')->onDelete('cascade');
            $table->string('employee_id');
            $table->foreignUuid('department_id')->nullable()->constrained('departments');
            $table->string('job_title');
            $table->text('job_description')->nullable();
            $table->date('joining_date');
            $table->string('contract_type')->default('permanent');
            $table->decimal('salary', 12, 2)->nullable();
            $table->string('bank_name')->nullable();
            $table->string('bank_account_number')->nullable();
            $table->string('tax_id')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
            $table->unique(['school_id', 'employee_id']);
            $table->unique(['user_id', 'school_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('staff'); }
};