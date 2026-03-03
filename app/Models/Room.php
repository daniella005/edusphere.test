<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Room extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'school_id',
        'name',
        'code',
        'building',
        'floor',
        'capacity',
        'room_type',
        'facilities',
        'is_active'
    ];

    protected $casts = [
        'facilities' => 'array',
        'is_active' => 'boolean',
        'floor' => 'integer',
        'capacity' => 'integer'
    ];

    // Relations
    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function examSchedules()
    {
        return $this->hasMany(ExamSchedule::class);
    }

    /**
     * Vérifie si la salle est disponible pour un créneau donné.
     * Logique : aucune planification d'examen ne doit chevaucher le créneau.
     */
    public function isAvailable($date, $startTime, $endTime)
    {
        return !$this->examSchedules()
            ->whereDate('date', $date)
            ->where(function ($query) use ($startTime, $endTime) {
                $query->whereBetween('start_time', [$startTime, $endTime])
                      ->orWhereBetween('end_time', [$startTime, $endTime])
                      ->orWhere(function ($q) use ($startTime, $endTime) {
                          $q->where('start_time', '<=', $startTime)
                            ->where('end_time', '>=', $endTime);
                      });
            })
            ->exists();
    }
}