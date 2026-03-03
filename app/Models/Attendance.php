<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Attendance extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'student_attendance';
    protected $fillable = [
        'student_id', 'section_id', 'academic_term_id', 
        'attendance_date', 'status', 'remark', 'recorded_by'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(fn ($model) => $model->id = (string) Str::uuid());
    }

    public function student() { return $this->belongsTo(Student::class); }
    public function section() { return $this->belongsTo(Section::class); }
    public function recorder() { return $this->belongsTo(Profile::class, 'recorded_by'); }
}