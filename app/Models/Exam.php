<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Exam extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'school_id', 'academic_term_id', 'exam_category_id',
        'name', 'exam_type', 'description', 'start_date',
        'end_date', 'status', 'created_by'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date'
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
    public function category() { return $this->belongsTo(ExamCategory::class, 'exam_category_id'); }
    public function createdBy() { return $this->belongsTo(Profile::class, 'created_by'); }
    public function schedules() { return $this->hasMany(ExamSchedule::class); }
}