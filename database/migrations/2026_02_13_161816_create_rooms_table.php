<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('rooms', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('school_id')->constrained('schools')->onDelete('cascade');
            $table->string('name');
            $table->string('code');
            $table->string('building')->nullable();
            $table->integer('floor')->nullable();
            $table->integer('capacity')->nullable();
            $table->string('room_type')->nullable();
            $table->json('facilities')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->unique(['school_id', 'code']);
        });
    }
    public function down(): void { Schema::dropIfExists('rooms'); }
};