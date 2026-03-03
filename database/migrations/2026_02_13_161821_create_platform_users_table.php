<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('platform_users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('profiles')->onDelete('cascade');
            $table->string('platform_role');
            $table->string('department')->nullable();
            $table->json('permissions')->nullable();
            $table->timestamps();
            $table->unique('user_id');
        });
    }
    public function down(): void { Schema::dropIfExists('platform_users'); }
};