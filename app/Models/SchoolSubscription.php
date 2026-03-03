<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SchoolSubscription extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'school_id', 'plan_id', 'status', 'amount', 
        'billing_cycle', 'start_date', 'end_date', 
        'next_billing_date', 'trial_ends_at', 'cancelled_at'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'next_billing_date' => 'date',
        'trial_ends_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function school() { return $this->belongsTo(School::class); }
    public function plan() { return $this->belongsTo(SubscriptionPlan::class); }
    
    // Relation vers les factures d'abonnement (à créer plus tard)
    public function invoices() { return $this->hasMany(SubscriptionInvoice::class); }
}