<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('fee_payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('receipt_number')->unique();
            $table->foreignUuid('invoice_id')->constrained('student_invoices')->onDelete('cascade');
            $table->foreignUuid('student_id')->constrained('students')->onDelete('cascade');
            $table->decimal('amount', 12, 2);
            $table->string('payment_method');
            $table->string('payment_reference')->nullable();
            $table->timestamp('payment_date');
            $table->string('bank_name')->nullable();
            $table->string('cheque_number')->nullable();
            $table->string('transaction_id')->nullable();
            $table->text('notes')->nullable();
            $table->foreignUuid('received_by')->constrained('profiles');
            $table->string('status')->default('paid');
            $table->decimal('refund_amount', 12, 2)->nullable();
            $table->timestamp('refunded_at')->nullable();
            $table->text('refund_reason')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('fee_payments'); }
};