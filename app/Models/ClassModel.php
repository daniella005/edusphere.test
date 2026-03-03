<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ClassModel extends Model
{
    use HasFactory;

    protected $table = 'classes';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'school_id', 'academic_year_id', 'name', 'code',
        'level', 'description', 'is_active'
    ];

    protected $casts = [
        'level' => 'integer',
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
    public function academicYear() { return $this->belongsTo(AcademicYear::class); }
    public function sections() { return $this->hasMany(Section::class); }
    public function subjects() { return $this->belongsToMany(Subject::class, 'class_subjects'); }
    public function feeStructures() { return $this->hasMany(FeeStructure::class); }
    public function examSchedules() { return $this->hasMany(ExamSchedule::class); }
    
    public function scopeActive($query) { return $query->where('is_active', true); }
    public function getStudentCountAttribute() { return $this->sections()->withCount('students')->get()->sum('students_count'); }
}