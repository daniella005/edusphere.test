<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('school_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('school_id')->constrained('schools')->onDelete('cascade');
            $table->string('key');
            $table->json('value');
            $table->text('description')->nullable();
            $table->foreignUuid('updated_by')->nullable()->constrained('profiles');
            $table->timestamps();
            $table->unique(['school_id', 'key']);
        });
    }
    public function down(): void { Schema::dropIfExists('school_settings'); }
};