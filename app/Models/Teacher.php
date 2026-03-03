<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Teacher extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id', 'school_id', 'employee_id', 'department_id',
        'qualification', 'specialization', 'experience_years',
        'joining_date', 'contract_type', 'salary', 'bank_name',
        'bank_account_number', 'tax_id', 'emergency_contact_name',
        'emergency_contact_phone', 'is_class_teacher', 'status'
    ];

    protected $casts = [
        'joining_date' => 'date',
        'experience_years' => 'integer',
        'is_class_teacher' => 'boolean',
        'salary' => 'decimal:2'
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

    // Relations
    public function profile() { return $this->belongsTo(Profile::class, 'user_id', 'user_id'); }
    public function user() { return $this->belongsTo(User::class, 'user_id'); }
    public function school() { return $this->belongsTo(School::class); }
    public function department() { return $this->belongsTo(Department::class); }
    public function subjects() { return $this->belongsToMany(Subject::class, 'teacher_subjects'); }
    public function sections() { return $this->belongsToMany(Section::class, 'teacher_sections'); }
    public function class() { return $this->hasOne(ClassModel::class, 'class_teacher_id'); }
    public function timetableEntries() { return $this->hasMany(TimetableEntry::class); }
    public function assignments() { return $this->hasMany(Assignment::class); }
    public function lessonPlans() { return $this->hasMany(LessonPlan::class); }
    
    public function scopeActive($query) { return $query->where('status', 'active'); }
}