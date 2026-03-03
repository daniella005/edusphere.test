<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserRole extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id', 
        'role', 
        'school_id', 
        'is_primary', 
        'granted_by', 
        'expires_at'
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'expires_at' => 'datetime',
    ];

    // Indique que l'ID est un UUID (string) et non un entier
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * Relation vers le profil de l'utilisateur (user_id)
     */
    public function user(): BelongsTo
    {
        // On lie user_id à la table profiles (puisque tu utilises des IDs de profils)
        return $this->belongsTo(Profile::class, 'user_id');
    }

    /**
     * Relation vers l'école (school_id)
     */
    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class, 'school_id');
    }

    /**
     * Relation vers celui qui a accordé le rôle (granted_by)
     */
    public function granter(): BelongsTo
    {
        return $this->belongsTo(Profile::class, 'granted_by');
    }
}