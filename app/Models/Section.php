<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Section extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'class_id', 'name', 'capacity', 'class_teacher_id',
        'room_number', 'is_active'
    ];

    protected $casts = [
        'capacity' => 'integer',
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

    public function class() { return $this->belongsTo(ClassModel::class, 'class_id'); }
    public function classTeacher() { return $this->belongsTo(Teacher::class, 'class_teacher_id'); }
    public function students() { return $this->hasMany(Student::class); }
    public function teachers() { return $this->belongsToMany(Teacher::class, 'teacher_sections'); }
    public function timetableEntries() { return $this->hasMany(TimetableEntry::class); }
    public function assignments() { return $this->hasMany(Assignment::class); }
    public function lessonPlans() { return $this->hasMany(LessonPlan::class); }
    
    public function scopeActive($query) { return $query->where('is_active', true); }
}