<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MessageRecipient extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'message_id', 'recipient_id', 'is_read', 
        'read_at', 'is_deleted', 'deleted_at', 'is_starred'
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'is_deleted' => 'boolean',
        'is_starred' => 'boolean',
        'read_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function message()
    {
        return $this->belongsTo(Message::class);
    }

    public function recipient()
    {
        return $this->belongsTo(Profile::class, 'recipient_id');
    }
}