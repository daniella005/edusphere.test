<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EmployeeAttendance extends Model
{
    use HasFactory, HasUuids;

    // On force le nom de la table au singulier comme dans ta migration
    protected $table = 'employee_attendance';

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'school_id',
        'date',
        'status',
        'check_in_time',
        'check_out_time',
        'work_hours',
        'leave_type',
        'remarks'
    ];

    protected $casts = [
        'date' => 'date',
        'check_in_time' => 'datetime',
        'check_out_time' => 'datetime',
        'work_hours' => 'decimal:2'
    ];

    // Relations
    public function user()
    {
        // On lie au profil de l'employé
        return $this->belongsTo(Profile::class, 'user_id');
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }
}