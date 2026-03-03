<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ExamCategory extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'school_id',
        'name',
        'description',
        'weightage',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'weightage' => 'decimal:2',
    ];

    /**
     * Relation avec l'école
     */
    public function school()
    {
        return $this->belongsTo(School::class);
    }

    /**
     * Relation avec les examens (si tu as un modèle Exam)
     */
    public function exams()
    {
        return $this->hasMany(Exam::class);
    }
}