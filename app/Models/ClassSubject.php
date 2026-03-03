<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClassSubject extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'class_id', 
        'subject_id', 
        'is_mandatory', 
        'periods_per_week'
    ];

    protected $casts = [
        'is_mandatory' => 'boolean',
        'periods_per_week' => 'integer'
    ];

    /**
     * Relation vers la classe (Modèle Classes)
     */
  public function schoolClass(): BelongsTo
{
    // On remplace Classes::class par ClassModel::class
    return $this->belongsTo(ClassModel::class, 'class_id');
}

    /**
     * Relation vers la matière (Modèle Subject)
     */
    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }
}