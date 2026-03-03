<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Notification extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id', 'title', 'message', 'notification_type',
        'reference_type', 'reference_id', 'is_read', 
        'read_at', 'action_url'
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime',
    ];

    /**
     * L'utilisateur qui reçoit la notification
     */
    public function user()
    {
        return $this->belongsTo(Profile::class, 'user_id');
    }

    /**
     * Relation polymorphique optionnelle pour récupérer l'objet lié 
     * (ex: si reference_type est 'FeePayment', on peut récupérer le paiement)
     */
    public function reference()
    {
        return $this->morphTo(null, 'reference_type', 'reference_id');
    }
}