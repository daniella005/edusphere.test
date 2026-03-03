<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SystemSetting extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'key', 
        'value', 
        'description', 
        'is_public',
        'updated_by'
    ];

    /**
     * Cast automatique du JSON
     * Cela permet de manipuler 'value' comme un tableau PHP directement
     */
    protected $casts = [
        'value' => 'json',
        'is_public' => 'boolean',
    ];

    public function updater() 
    { 
        return $this->belongsTo(Profile::class, 'updated_by'); 
    }
}