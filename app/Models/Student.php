<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Student extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id', 'school_id', 'admission_number', 'section_id',
        'roll_number', 'admission_date', 'previous_school', 'blood_group',
        'medical_conditions', 'allergies', 'nationality', 'religion',
        'caste', 'mother_tongue', 'transport_required', 'hostel_required',
        'scholarship_id', 'status', 'withdrawal_date', 'withdrawal_reason'
    ];

    protected $casts = [
        'admission_date' => 'date',
        'withdrawal_date' => 'date',
        'transport_required' => 'boolean',
        'hostel_required' => 'boolean'
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
    public function section() { return $this->belongsTo(Section::class); }
    public function scholarship() { return $this->belongsTo(Scholarship::class); }
    public function guardians() { return $this->belongsToMany(Guardian::class, 'student_guardians'); }
    public function attendances() { return $this->hasMany(StudentAttendance::class); }
    public function examResults() { return $this->hasMany(ExamResult::class); }
    public function reportCards() { return $this->hasMany(ReportCard::class); }
    public function invoices() { return $this->hasMany(StudentInvoice::class); }
    public function payments() { return $this->hasMany(FeePayment::class); }
    public function academicHistory() { return $this->hasMany(StudentAcademicHistory::class); }
    public function scopeActive($query) { return $query->where('status', 'active'); }
}