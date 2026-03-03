<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Staff extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id', 'school_id', 'employee_id', 'department_id',
        'job_title', 'job_description', 'joining_date', 'contract_type',
        'salary', 'bank_name', 'bank_account_number', 'tax_id',
        'emergency_contact_name', 'emergency_contact_phone', 'status'
    ];

    protected $casts = [
        'joining_date' => 'date',
        'salary' => 'decimal:2'
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
    public function department() { return $this->belongsTo(Department::class); }
    public function attendances() { return $this->hasMany(EmployeeAttendance::class, 'user_id', 'user_id'); }
    public function leaveRequests() { return $this->hasMany(LeaveRequest::class, 'user_id', 'user_id'); }
    
    public function scopeActive($query) { return $query->where('status', 'active'); }
}