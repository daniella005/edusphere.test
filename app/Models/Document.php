<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Document extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'school_id', 'uploaded_by', 'file_name', 'original_name',
        'file_path', 'file_size', 'mime_type', 'file_extension',
        'category', 'reference_type', 'reference_id', 'is_public', 'description'
    ];

    protected $casts = [
        'file_size' => 'integer',
        'is_public' => 'boolean'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    public function school() { return $this->belongsTo(School::class); }
    public function uploadedBy() { return $this->belongsTo(Profile::class, 'uploaded_by'); }
    
    public function reference()
    {
        return $this->morphTo();
    }
}