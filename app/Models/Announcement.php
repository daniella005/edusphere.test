<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Announcement extends Model
{
    use HasFactory, HasUuids;

    

    protected $fillable = [
        'school_id', 'title', 'content', 'announcement_type',
        'audience', 'target_classes', 'target_sections', 'attachment_urls',
        'publish_date', 'expiry_date', 'status', 'is_pinned',
        'send_notification', 'send_email', 'send_sms', 'views_count',
        'author_id', 'published_by', 'published_at'
    ];

    protected $casts = [
        'publish_date' => 'datetime',
        'expiry_date' => 'datetime',
        'published_at' => 'datetime',
        'is_pinned' => 'boolean',
        'send_notification' => 'boolean',
        'send_email' => 'boolean',
        'send_sms' => 'boolean',
        'views_count' => 'integer',
        'audience' => 'array',
        'target_classes' => 'array',
        'target_sections' => 'array',
        'attachment_urls' => 'array'
    ];

    

    public function school() { return $this->belongsTo(School::class); }
    public function author() { return $this->belongsTo(Profile::class, 'author_id'); }
    public function publishedBy() { return $this->belongsTo(Profile::class, 'published_by'); }
    public function reads() { return $this->hasMany(AnnouncementRead::class); }
}