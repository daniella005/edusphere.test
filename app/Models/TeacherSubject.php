<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TeacherSubject extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'teacher_id', 
        'subject_id', 
        'is_primary'
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
}