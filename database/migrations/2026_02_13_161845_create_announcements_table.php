<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('announcements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('school_id')->constrained('schools')->onDelete('cascade');
            $table->string('title');
            $table->text('content');
            $table->string('announcement_type')->default('general');
            $table->json('audience')->nullable();
            $table->json('target_classes')->nullable();
            $table->json('target_sections')->nullable();
            $table->json('attachment_urls')->nullable();
            $table->timestamp('publish_date');
            $table->timestamp('expiry_date')->nullable();
            $table->string('status')->default('draft');
            $table->boolean('is_pinned')->default(false);
            $table->boolean('send_notification')->default(true);
            $table->boolean('send_email')->default(false);
            $table->boolean('send_sms')->default(false);
            $table->integer('views_count')->default(0);
            $table->foreignUuid('author_id')->constrained('profiles');
            $table->foreignUuid('published_by')->nullable()->constrained('profiles');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('announcements'); }
};