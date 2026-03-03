<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AssignmentSubmission extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'assignment_id', 'student_id', 'submission_text',
        'attachment_urls', 'submitted_at', 'status', 'attempt_number',
        'is_late', 'marks_obtained', 'percentage', 'grade',
        'feedback', 'graded_by', 'graded_at'
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'graded_at' => 'datetime',
        'attachment_urls' => 'array',
        'is_late' => 'boolean',
        'marks_obtained' => 'float',
        'percentage' => 'float',
    ];

    public function assignment() { return $this->belongsTo(Assignment::class); }
    public function student() { return $this->belongsTo(Student::class); }
    public function teacher() { return $this->belongsTo(Profile::class, 'graded_by'); }
}