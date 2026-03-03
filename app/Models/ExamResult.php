<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ExamResult extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'exam_schedule_id', 'student_id', 'marks_obtained',
        'percentage', 'grade', 'grade_points', 'rank_in_class',
        'is_absent', 'is_exempted', 'remarks', 'evaluated_by', 'evaluated_at'
    ];

    protected $casts = [
        'marks_obtained' => 'decimal:2',
        'percentage' => 'decimal:2',
        'grade_points' => 'decimal:2',
        'rank_in_class' => 'integer',
        'is_absent' => 'boolean',
        'is_exempted' => 'boolean',
        'evaluated_at' => 'datetime'
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

    public function examSchedule() { return $this->belongsTo(ExamSchedule::class); }
    public function student() { return $this->belongsTo(Student::class); }
    public function evaluatedBy() { return $this->belongsTo(Profile::class, 'evaluated_by'); }
}