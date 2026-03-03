<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('profiles')->onDelete('cascade');
            $table->string('title');
            $table->text('message');
            $table->string('notification_type');
            $table->string('reference_type')->nullable();
            $table->uuid('reference_id')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->text('action_url')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'is_read']);
        });
    }
    public function down(): void { Schema::dropIfExists('notifications'); }
};