<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('message_recipients', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('message_id')->constrained('messages')->onDelete('cascade');
            $table->foreignUuid('recipient_id')->constrained('profiles')->onDelete('cascade');
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->boolean('is_starred')->default(false);
            $table->timestamps();
            $table->unique(['message_id', 'recipient_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('message_recipients'); }
};