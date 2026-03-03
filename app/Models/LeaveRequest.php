<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LeaveRequest extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'school_id',
        'leave_type',
        'start_date',
        'end_date',
        'reason',
        'status',
        'approved_by',
        'approved_at',
        'rejection_reason'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'approved_at' => 'datetime',
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(Profile::class, 'user_id');
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function approvedBy()
    {
        return $this->belongsTo(Profile::class, 'approved_by');
    }
}