<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PlatformInvoice extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'invoice_number', 'school_id', 'subscription_id', 'amount',
        'tax_amount', 'total_amount', 'status', 'due_date',
        'paid_at', 'payment_method', 'payment_reference', 'notes'
    ];

    protected $casts = [
        'due_date' => 'date',
        'paid_at' => 'datetime',
        'amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    // Relations
    public function school() { return $this->belongsTo(School::class); }
    public function subscription() { return $this->belongsTo(SchoolSubscription::class); }

    // Scope pour les factures impayées
    public function scopeOverdue($query)
    {
        return $query->where('status', 'pending')->where('due_date', '<', now());
    }
}