<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ExamSchedule extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'exam_id', 'subject_id', 'class_id', 'exam_date',
        'start_time', 'end_time', 'duration_minutes', 'room_id',
        'total_marks', 'passing_marks', 'invigilator_id',
        'syllabus_covered', 'instructions', 'status'
    ];

    protected $casts = [
    'exam_date' => 'date',
    'start_time' => 'string', // On garde le format H:i:s de la DB
    'end_time' => 'string',
    'duration_minutes' => 'integer',
    'total_marks' => 'decimal:2',
    'passing_marks' => 'decimal:2'
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

    public function exam() { return $this->belongsTo(Exam::class); }
    public function subject() { return $this->belongsTo(Subject::class); }
    public function class() { return $this->belongsTo(ClassModel::class, 'class_id'); }
    public function room() { return $this->belongsTo(Room::class); }
    public function invigilator() { return $this->belongsTo(Teacher::class, 'invigilator_id'); }
    public function results() { return $this->hasMany(ExamResult::class); }
}