<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Assignment extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'school_id', 'teacher_id', 'subject_id', 'section_id',
        'academic_term_id', 'title', 'description', 'instructions',
        'attachment_urls', 'due_date', 'total_marks', 'weightage',
        'status', 'allow_late_submission', 'late_submission_penalty',
        'max_attempts', 'published_at'
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'published_at' => 'datetime',
        'total_marks' => 'decimal:2',
        'weightage' => 'decimal:2',
        'late_submission_penalty' => 'decimal:2',
        'max_attempts' => 'integer',
        'allow_late_submission' => 'boolean',
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
    public function teacher() { return $this->belongsTo(Teacher::class); }
    public function subject() { return $this->belongsTo(Subject::class); }
    public function section() { return $this->belongsTo(Section::class); }
    public function term() { return $this->belongsTo(AcademicTerm::class, 'academic_term_id'); }
    public function submissions() { return $this->hasMany(AssignmentSubmission::class); }
}