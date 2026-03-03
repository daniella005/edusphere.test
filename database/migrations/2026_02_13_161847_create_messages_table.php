<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('school_id')->constrained('schools')->onDelete('cascade');
            $table->foreignUuid('sender_id')->constrained('profiles');
            $table->string('subject');
            $table->text('body');
            $table->foreignUuid('parent_message_id')->nullable()->constrained('messages');
            $table->boolean('is_broadcast')->default(false);
            $table->json('attachment_urls')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('messages'); }
};