<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SchoolSetting extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'school_id',
        'key', 
        'value', 
        'description', 
        'updated_by'
    ];

    protected $casts = [
        'value' => 'json', // Conversion automatique Array <-> JSON
    ];

    public function school() 
    { 
        return $this->belongsTo(School::class); 
    }

    public function updater() 
    { 
        return $this->belongsTo(Profile::class, 'updated_by'); 
    }
}