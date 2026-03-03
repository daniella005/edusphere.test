<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TicketComment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'ticket_id', 
        'user_id', 
        'content', 
        'is_internal', 
        'attachment_urls'
    ];

    protected $casts = [
        'is_internal' => 'boolean',
        'attachment_urls' => 'array',
    ];

    public function ticket()
    {
        return $this->belongsTo(SupportTicket::class, 'ticket_id');
    }

    public function user()
    {
        return $this->belongsTo(Profile::class, 'user_id');
    }
}