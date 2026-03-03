<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('school_id')->nullable()->constrained('schools')->onDelete('set null');
            $table->foreignUuid('user_id')->nullable()->constrained('profiles')->onDelete('set null');
            $table->string('user_email')->nullable();
            $table->string('user_role')->nullable();
            $table->string('action');
            $table->string('resource_type');
            $table->uuid('resource_id')->nullable();
            $table->string('resource_name')->nullable();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->string('session_id')->nullable();
            $table->string('severity')->default('info');
            $table->json('additional_info')->nullable();
            $table->timestamps();
            
            $table->index(['school_id', 'created_at']);
            $table->index(['user_id', 'created_at']);
        });
    }
    public function down(): void { Schema::dropIfExists('audit_logs'); }
};