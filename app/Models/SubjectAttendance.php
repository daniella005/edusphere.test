<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SubjectAttendance extends Model
{
    use HasFactory, HasUuids;

    // Laravel cherche par défaut 'subject_attendances', on précise si ta table est au singulier
    protected $table = 'subject_attendance';

    protected $fillable = [
        'student_id', 
        'timetable_entry_id', 
        'date', 
        'status', 
        'marked_by', 
        'remarks'
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function student() { return $this->belongsTo(Student::class); }
    public function timetableEntry() { return $this->belongsTo(TimetableEntry::class); }
    public function markedBy() { return $this->belongsTo(Profile::class, 'marked_by'); }
}