<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FeeCategory extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'school_id',
        'name',
        'description',
        'is_mandatory',
        'is_refundable',
        'is_active'
    ];

    protected $casts = [
        'is_mandatory' => 'boolean',
        'is_refundable' => 'boolean',
        'is_active' => 'boolean',
    ];

    // Relations
    public function school()
    {
        return $this->belongsTo(School::class);
    }

    /**
     * Une catégorie contient plusieurs structures de frais 
     * (ex: la catégorie "Scolarité" a des montants différents pour la 6ème et la 3ème)
     */
    public function feeStructures()
    {
        return $this->hasMany(FeeStructure::class);
    }
}