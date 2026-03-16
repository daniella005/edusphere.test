<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class StudentAttendance extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'attendances'; 

    protected $fillable = [
        'student_id', 
        'section_id', 
        'academic_term_id',
        'attendance_date', 
        'status', 
        'remark', 
        'recorded_by'
    ];

    protected $casts = [
        'attendance_date' => 'date',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(fn ($model) => $model->id = (string) Str::uuid());
    }

    public function student() { return $this->belongsTo(Student::class); }
    public function section() { return $this->belongsTo(Section::class); }
    // On aligne le nom avec celui utilisé dans le Controller (markedBy -> recorder)
    public function markedBy() { return $this->belongsTo(Profile::class, 'recorded_by'); }
}