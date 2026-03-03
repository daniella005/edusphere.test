<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Subject extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'school_id', 'code', 'name', 'description', 'department_id',
        'subject_type', 'credits', 'passing_marks', 'max_marks', 'is_active'
    ];

    protected $casts = [
        'credits' => 'integer',
        'passing_marks' => 'decimal:2',
        'max_marks' => 'decimal:2',
        'is_active' => 'boolean'
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
    public function department() { return $this->belongsTo(Department::class); }
    public function classes() { return $this->belongsToMany(ClassModel::class, 'class_subjects'); }
    public function teachers() { return $this->belongsToMany(Teacher::class, 'teacher_subjects'); }
    public function examSchedules() { return $this->hasMany(ExamSchedule::class); }
    public function assignments() { return $this->hasMany(Assignment::class); }
    public function lessonPlans() { return $this->hasMany(LessonPlan::class); }
    public function timetableEntries() { return $this->hasMany(TimetableEntry::class); }
    
    public function scopeActive($query) { return $query->where('is_active', true); }
}