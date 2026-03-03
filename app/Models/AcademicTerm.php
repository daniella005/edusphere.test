<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AcademicTerm extends Model
{
    use HasFactory, HasUuids;

    // Colonnes autorisées pour le remplissage de masse
   protected $fillable = [
    'school_id',
    'academic_year_id',
    'name',
    'term_type',
    'start_date',
    'end_date',
    'is_current',
    'display_order',
    'settings'
];

protected $casts = [
    'is_current' => 'boolean',
    'settings' => 'array', // Très important pour manipuler le JSON facilement
    'start_date' => 'date',
    'end_date' => 'date',
];

    

    /**
     * Relation avec l'école.
     */
    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    // Ajoute ceci à l'intérieur de ta classe AcademicTerm
public function academicYear(): BelongsTo
{
    return $this->belongsTo(AcademicYear::class);
}

}