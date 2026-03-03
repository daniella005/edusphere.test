<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('user_roles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('profiles')->onDelete('cascade');
            $table->string('role');
            $table->foreignUuid('school_id')->nullable()->constrained('schools')->onDelete('cascade');
            $table->boolean('is_primary')->default(false);
            $table->foreignUuid('granted_by')->nullable()->constrained('profiles');
            $table->timestamp('granted_at')->useCurrent();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'role', 'school_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('user_roles'); }
};