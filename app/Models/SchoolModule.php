<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SchoolModule extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'school_id',
        'module_name',
        'is_enabled',
        'config',
        'enabled_at',
        'disabled_at'
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
        'config' => 'json',
        'enabled_at' => 'datetime',
        'disabled_at' => 'datetime',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }
}