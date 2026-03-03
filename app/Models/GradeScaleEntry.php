<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class GradeScaleEntry extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
    'grade_scale_id', 
    'grade_name', // Changé
    'minimum_score', // Changé
    'maximum_score', // Changé
    'grade_points', 
    'description'
];

protected $casts = [
    'minimum_score' => 'float',
    'maximum_score' => 'float',
    'grade_points' => 'float',
];
    /**
     * L'échelle parente à laquelle cette entrée appartient
     */
    public function gradeScale()
    {
        return $this->belongsTo(GradeScale::class);
    }
}