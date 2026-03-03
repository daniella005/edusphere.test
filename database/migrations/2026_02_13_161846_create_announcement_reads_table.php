<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('announcement_reads', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('announcement_id')->constrained('announcements')->onDelete('cascade');
            $table->foreignUuid('user_id')->constrained('profiles')->onDelete('cascade');
            $table->timestamp('read_at')->useCurrent();
            $table->timestamps();
            $table->unique(['announcement_id', 'user_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('announcement_reads'); }
};