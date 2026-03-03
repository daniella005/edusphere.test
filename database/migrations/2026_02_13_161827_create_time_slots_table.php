<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('time_slots', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('school_id')->constrained('schools')->onDelete('cascade');
            $table->string('name');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('slot_type')->default('class');
            $table->integer('sequence_order');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->unique(['school_id', 'start_time', 'end_time']);
        });
    }
    public function down(): void { Schema::dropIfExists('time_slots'); }
};