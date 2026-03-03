<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class LessonPlan extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'teacher_id', 'subject_id', 'section_id', 'academic_term_id',
        'title', 'week_number', 'topic', 'objectives', 'content',
        'materials', 'activities', 'assessment_methods', 'resources_urls',
        'planned_date', 'duration_minutes', 'status', 'approved_by',
        'approved_at', 'rejection_reason'
    ];

    protected $casts = [
        'week_number' => 'integer',
        'planned_date' => 'date',
        'duration_minutes' => 'integer',
        'approved_at' => 'datetime',
        'resources_urls' => 'array'
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

    public function teacher() { return $this->belongsTo(Teacher::class); }
    public function subject() { return $this->belongsTo(Subject::class); }
    public function section() { return $this->belongsTo(Section::class); }
    public function term() { return $this->belongsTo(AcademicTerm::class, 'academic_term_id'); }
    public function approvedBy() { return $this->belongsTo(Profile::class, 'approved_by'); }
}