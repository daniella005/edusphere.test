<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TimeSlot extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'school_id',
        'name',
        'start_time',
        'end_time',
        'slot_type',
        'sequence_order',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sequence_order' => 'integer',
    ];

    // Relations
    public function school()
    {
        return $this->belongsTo(School::class);
    }

    /**
     * Relation avec les entrées de l'emploi du temps.
     * Un créneau peut avoir plusieurs cours (pour différentes classes).
     */
    public function timetableEntries()
    {
        return $this->hasMany(TimetableEntry::class);
    }
}