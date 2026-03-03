<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('support_tickets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('ticket_number')->unique();
            $table->foreignUuid('school_id')->nullable()->constrained('schools')->onDelete('set null');
            $table->foreignUuid('submitted_by')->constrained('profiles');
            $table->foreignUuid('assigned_to')->nullable()->constrained('profiles');
            $table->string('subject');
            $table->text('description');
            $table->string('category');
            $table->string('priority')->default('medium');
            $table->string('status')->default('open');
            $table->json('attachment_urls')->nullable();
            $table->text('resolution')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->foreignUuid('resolved_by')->nullable()->constrained('profiles');
            $table->timestamp('first_response_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->foreignUuid('closed_by')->nullable()->constrained('profiles');
            $table->integer('satisfaction_rating')->nullable();
            $table->text('feedback')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('support_tickets'); }
};