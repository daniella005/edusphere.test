<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class AcademicYear extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'school_id', 'name', 'start_date', 'end_date', 'is_current'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_current' => 'boolean'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }
    


    public function school() { return $this->belongsTo(School::class); }
    public function classes() { return $this->hasMany(ClassModel::class); }
    public function feeStructures() { return $this->hasMany(FeeStructure::class); }
    
    public function scopeCurrent($query) { return $query->where('is_current', true); }
}