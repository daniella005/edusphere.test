<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class SupportTicket extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'ticket_number', 'school_id', 'submitted_by', 'assigned_to',
        'subject', 'description', 'category', 'priority', 'status',
        'attachment_urls', 'resolution', 'resolved_at', 'resolved_by',
        'first_response_at', 'closed_at', 'closed_by',
        'satisfaction_rating', 'feedback'
    ];

    protected $casts = [
        'resolved_at' => 'datetime',
        'first_response_at' => 'datetime',
        'closed_at' => 'datetime',
        'satisfaction_rating' => 'integer',
        'attachment_urls' => 'array'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    public function school() { return $this->belongsTo(School::class); }
    public function submittedBy() { return $this->belongsTo(Profile::class, 'submitted_by'); }
    public function assignedTo() { return $this->belongsTo(Profile::class, 'assigned_to'); }
    public function resolvedBy() { return $this->belongsTo(Profile::class, 'resolved_by'); }
    public function closedBy() { return $this->belongsTo(Profile::class, 'closed_by'); }
    public function comments() { return $this->hasMany(TicketComment::class); }
}