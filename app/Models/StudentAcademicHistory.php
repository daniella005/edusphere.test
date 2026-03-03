<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StudentAcademicHistory extends Model
{
    use HasFactory, HasUuids;

    // On précise le nom de la table car Laravel pourrait chercher "student_academic_histories"
    protected $table = 'student_academic_history';

    protected $fillable = [
        'student_id', 
        'academic_year_id', 
        'section_id', 
        'roll_number',
        'final_grade',
        'final_percentage',
        'promoted_to_section_id',
        'remarks'
    ];

    protected $casts = [
        'final_percentage' => 'float',
    ];

    public function student() { return $this->belongsTo(Student::class); }
    public function academicYear() { return $this->belongsTo(AcademicYear::class); }
    public function section() { return $this->belongsTo(Section::class); }
    public function promotedToSection() { return $this->belongsTo(Section::class, 'promoted_to_section_id'); }
}