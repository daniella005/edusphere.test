<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class School extends Model
{
    use HasFactory;

    // Utilisation d'UUID au lieu d'ID auto-incrémenté
    public $incrementing = false;
    protected $keyType = 'string';

    // Attributs modifiables en masse
    protected $fillable = [
        'name', 'code', 'logo_url', 'address', 'city', 'state',
        'country', 'postal_code', 'phone', 'email', 'website',
        'motto', 'established_year', 'school_type', 'is_active',
        'timezone', 'currency'
    ];

    // Types de données
    protected $casts = [
        'is_active' => 'boolean',
        'established_year' => 'integer',
    ];

    // Génère automatiquement un UUID à la création
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    // Relations
    public function academicYears() { return $this->hasMany(AcademicYear::class); }
    public function departments() { return $this->hasMany(Department::class); }
    public function classes() { return $this->hasMany(ClassModel::class); }
    public function subjects() { return $this->hasMany(Subject::class); }
    public function teachers() { return $this->hasMany(Teacher::class); }
    public function students() { return $this->hasMany(Student::class); }
    public function guardians() { return $this->hasMany(Guardian::class); }
    public function staff() { return $this->hasMany(Staff::class); }
    public function subscriptions() { return $this->hasMany(SchoolSubscription::class); }
    public function modules() { return $this->hasMany(SchoolModule::class); }
    public function rooms() { return $this->hasMany(Room::class); }
    public function timeSlots() { return $this->hasMany(TimeSlot::class); }
    public function scholarships() { return $this->hasMany(Scholarship::class); }
    public function announcements() { return $this->hasMany(Announcement::class); }
    public function settings() { return $this->hasMany(SchoolSetting::class); }
}