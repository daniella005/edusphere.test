<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TeacherSection extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'teacher_id', 
        'section_id', 
        'subject_id', 
        'academic_year_id',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function teacher() { return $this->belongsTo(Teacher::class); }
    public function section() { return $this->belongsTo(Section::class); }
    public function subject() { return $this->belongsTo(Subject::class); }
 
    
    public function academicYear() { return $this->belongsTo(AcademicYear::class); }
}