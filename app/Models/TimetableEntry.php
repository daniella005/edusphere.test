<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TimetableEntry extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'section_id', 'time_slot_id', 'day_of_week', 'subject_id',
        'teacher_id', 'room_number', 'academic_term_id', 'is_active'
    ];

    protected $casts = [
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

    public function section() { return $this->belongsTo(Section::class); }
    public function timeSlot() { return $this->belongsTo(TimeSlot::class); }
    public function subject() { return $this->belongsTo(Subject::class); }
    public function teacher() { return $this->belongsTo(Teacher::class); }
    public function term() { return $this->belongsTo(AcademicTerm::class, 'academic_term_id'); }
}