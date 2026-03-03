<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Str;

class StudentInvoice extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'invoice_number', 'student_id', 'academic_term_id',
        'subtotal', 'discount_amount', 'late_fee_amount', 'tax_amount',
        'total_amount', 'paid_amount', 'balance_amount', 'due_date',
        'status', 'notes', 'generated_by'
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'late_fee_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'balance_amount' => 'decimal:2',
        'due_date' => 'date'
    ];

    // Relations
    public function student() { return $this->belongsTo(Student::class); }
    public function term() { return $this->belongsTo(AcademicTerm::class, 'academic_term_id'); }
    public function items() { return $this->hasMany(StudentInvoiceItem::class, 'invoice_id'); }
    public function payments() { return $this->hasMany(FeePayment::class, 'invoice_id'); }

    // Accessors utiles
    public function getStatusLabelAttribute()
    {
        return [
            'pending' => 'En attente',
            'paid' => 'Payée',
            'partially_paid' => 'Partiellement payée',
            'cancelled' => 'Annulée',
        ][$this->status] ?? $this->status;
    }

    public function refreshTotals()
{
    // Recalcule le sous-total à partir des items
    $this->subtotal = $this->items()->sum('amount');
    
    // Recalcule le total final
    $this->total_amount = ($this->subtotal - $this->discount_amount) + $this->late_fee_amount + $this->tax_amount;
    
    // Recalcule le montant payé à partir des paiements réels
    $this->paid_amount = $this->payments()->sum('amount');
    
    // Calcule le nouveau solde
    $this->balance_amount = max(0, $this->total_amount - $this->paid_amount);
    
    // Met à jour le statut automatiquement
    if ($this->balance_amount <= 0) {
        $this->status = 'paid';
    } elseif ($this->paid_amount > 0) {
        $this->status = 'partially_paid';
    } else {
        $this->status = 'pending';
    }

    return $this->save();
}
}