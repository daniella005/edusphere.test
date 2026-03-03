<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class GradeScale extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = ['school_id', 'name', 'is_default', 'is_active'];

    protected $casts = [
        'is_default' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function school() 
    { 
        return $this->belongsTo(School::class); 
    }

    /**
     * Les paliers de cette échelle (ex: A, B, C ou 18-20, 16-18...)
     */
    public function entries() 
    { 
        return $this->hasMany(GradeScaleEntry::class)->orderBy('minimum_score', 'desc'); 
    }
}