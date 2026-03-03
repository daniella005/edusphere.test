<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ReportCard extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'student_id', 'academic_term_id', 'total_marks', 'marks_obtained',
        'percentage', 'grade', 'gpa', 'rank_in_class', 'rank_in_section',
        'attendance_percentage', 'teacher_remarks', 'principal_remarks',
        'status', 'published_at'
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'percentage' => 'float',
        'gpa' => 'float',
        'total_marks' => 'float',
        'marks_obtained' => 'float',
    ];

    public function student() { return $this->belongsTo(Student::class); }
    public function academicTerm() { return $this->belongsTo(AcademicTerm::class); }
    
    /**
     * Les détails par matière contenus dans ce bulletin
     */
    public function subjects() 
    { 
        return $this->hasMany(ReportCardSubject::class); 
    }
}