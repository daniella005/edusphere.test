<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AnnouncementRead extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'announcement_id',
        'user_id',
        'read_at'
    ];

    protected $casts = [
        'read_at' => 'datetime',
    ];

    public function announcement()
    {
        return $this->belongsTo(Announcement::class);
    }

    public function user()
    {
        return $this->belongsTo(Profile::class, 'user_id');
    }
}