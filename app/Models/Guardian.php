<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Guardian extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'guardians'; // Force le nom de la table

    protected $fillable = [
        'user_id', 'school_id', 'occupation', 'employer',
        'office_address', 'office_phone', 'annual_income',
        'education_level', 'relationship_type', 'status'
    ];

    protected $casts = [
        'annual_income' => 'decimal:2'
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

    public function profile() { return $this->belongsTo(Profile::class, 'user_id', 'user_id'); }
    public function user() { return $this->belongsTo(User::class, 'user_id'); }
    public function school() { return $this->belongsTo(School::class); }
    public function students() { return $this->belongsToMany(Student::class, 'student_guardians'); }
}