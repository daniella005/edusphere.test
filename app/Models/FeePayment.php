<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;


class FeePayment extends Model
{
    
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'receipt_number', 'invoice_id', 'student_id', 'amount',
        'payment_method', 'payment_reference', 'payment_date',
        'bank_name', 'cheque_number', 'transaction_id', 'notes',
        'received_by', 'status', 'refund_amount', 'refunded_at', 'refund_reason'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'refund_amount' => 'decimal:2',
        'payment_date' => 'datetime',
        'refunded_at' => 'datetime'
    ];

    
   
    // Dans ton modèle FeePayment existant :

public function getFormattedAmountAttribute()
{
    // Utilise XAF par défaut si on ne trouve pas la devise
    $currency = $this->invoice->student->section->level->school->currency ?? 'XAF'; 
    return number_format($this->amount, 2, ',', ' ') . ' ' . $currency;
}
    public function invoice() { return $this->belongsTo(StudentInvoice::class, 'invoice_id'); }
    public function student() { return $this->belongsTo(Student::class); }
    public function receivedBy() { return $this->belongsTo(Profile::class, 'received_by'); }
}