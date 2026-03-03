<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Message extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'school_id', 'sender_id', 'subject', 'body', 
        'parent_message_id', 'is_broadcast', 'attachment_urls'
    ];

    protected $casts = [
        'is_broadcast' => 'boolean',
        'attachment_urls' => 'array',
    ];

    // Relations
    public function school() { return $this->belongsTo(School::class); }
    public function sender() { return $this->belongsTo(Profile::class, 'sender_id'); }
    
    // Pour les fils de discussion
    public function parent() { return $this->belongsTo(Message::class, 'parent_message_id'); }
    public function replies() { return $this->hasMany(Message::class, 'parent_message_id'); }

    // Les destinataires et leur statut (lu/non lu)
    public function recipients() { return $this->hasMany(MessageRecipient::class); }
}