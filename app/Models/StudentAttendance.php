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

    // IMPORTANT : On pointe vers la table créée par ta migration
    protected $table = 'attendances'; 

    protected $fillable = [
        'student_id', 
        'section_id', 
        'academic_term_id', // Ajouté car présent en migration
        'attendance_date',  // Changé 'date' par 'attendance_date'
        'status', 
        'remark',           // Changé 'remarks' par 'remark'
        'recorded_by'       // Changé 'marked_by' par 'recorded_by'
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
    // Relation corrigée avec la colonne recorded_by
    public function recorder() { return $this->belongsTo(Profile::class, 'recorded_by'); }
}