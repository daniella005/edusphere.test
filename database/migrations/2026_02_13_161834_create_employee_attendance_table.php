<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('employee_attendance', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('profiles')->onDelete('cascade');
            $table->foreignUuid('school_id')->constrained('schools')->onDelete('cascade');
            $table->date('date');
            $table->string('status');
            $table->time('check_in_time')->nullable();  // Utilise time au lieu de timestamp
            $table->time('check_out_time')->nullable(); // Utilise time au lieu de timestamp
            $table->decimal('work_hours', 4, 2)->nullable();
            $table->string('leave_type')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
            $table->unique(['user_id', 'date']);
        });
    }
    public function down(): void { Schema::dropIfExists('employee_attendance'); }
};