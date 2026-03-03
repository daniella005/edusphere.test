<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
      Schema::create('ticket_comments', function (Blueprint $table) {
    $table->uuid('id')->primary();
    // Utilise ticket_id pour matcher ton modèle et ton controller
    $table->foreignUuid('ticket_id')->constrained('support_tickets')->onDelete('cascade');
    $table->foreignUuid('user_id')->constrained('profiles');
    $table->text('content'); // Change 'comment' en 'content'
    $table->json('attachment_urls')->nullable();
    $table->boolean('is_internal')->default(false);
    $table->timestamps();
});
    }
    public function down(): void { Schema::dropIfExists('ticket_comments'); }
};