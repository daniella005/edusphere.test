<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StudentScholarship extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'student_id', 
        'scholarship_id', 
        'academic_year_id', 
        'awarded_date',
        'awarded_by',
        'status',
        'revoked_at',
        'revoke_reason'
    ];

    protected $casts = [
        'awarded_date' => 'date',
        'revoked_at' => 'datetime',
    ];

    public function student() { return $this->belongsTo(Student::class); }
    public function scholarship() { return $this->belongsTo(Scholarship::class); }
    public function academicYear() { return $this->belongsTo(AcademicYear::class); }
    public function awarder() { return $this->belongsTo(Profile::class, 'awarded_by'); }
}