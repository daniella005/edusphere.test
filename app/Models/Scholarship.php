<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Scholarship extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'school_id', 'name', 'description', 'discount_type',
        'discount_value', 'applicable_fee_categories', 
        'eligibility_criteria', 'max_recipients', 
        'is_active', 'valid_from', 'valid_until'
    ];

    protected $casts = [
        'applicable_fee_categories' => 'array', 
        'discount_value' => 'decimal:2',
        'is_active' => 'boolean',
        'valid_from' => 'date',
        'valid_until' => 'date',
    ];

    public function school() { return $this->belongsTo(School::class); }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'student_scholarships')
                    ->withPivot('academic_year_id', 'status')
                    ->withTimestamps();
    }
}