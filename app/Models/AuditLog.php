<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AuditLog extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'school_id', 'user_id', 'user_email', 'user_role',
        'action', 'resource_type', 'resource_id', 'resource_name',
        'old_values', 'new_values', 'ip_address', 'user_agent',
        'session_id', 'severity', 'additional_info'
    ];

    protected $casts = [
        'old_values' => 'json',
        'new_values' => 'json',
        'additional_info' => 'json',
    ];

    // On ne modifie JAMAIS un log d'audit
    // On pourrait même désactiver les updates via un observer

    public function school() { return $this->belongsTo(School::class); }
    public function user() { return $this->belongsTo(Profile::class, 'user_id'); }
}