<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('school_id')->nullable()->constrained('schools')->onDelete('cascade');
            $table->foreignUuid('uploaded_by')->constrained('profiles');
            $table->string('file_name');
            $table->string('original_name');
            $table->text('file_path');
            $table->bigInteger('file_size');
            $table->string('mime_type');
            $table->string('file_extension')->nullable();
            $table->string('category')->nullable();
            $table->string('reference_type')->nullable();
            $table->uuid('reference_id')->nullable();
            $table->boolean('is_public')->default(false);
            $table->text('description')->nullable();
            $table->timestamps();
            
            $table->index(['school_id', 'category']);
            $table->index(['reference_type', 'reference_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('documents'); }
};