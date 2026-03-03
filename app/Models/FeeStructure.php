<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class FeeStructure extends Model
{
    use HasFactory;
    use HasFactory, HasUuids;

    

    protected $fillable = [
        'school_id', 'academic_year_id', 'class_id', 'fee_category_id',
        'amount', 'frequency', 'due_day', 'late_fee',
        'late_fee_frequency', 'discount_available', 'is_active'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'late_fee' => 'decimal:2',
        'due_day' => 'integer',
        'discount_available' => 'boolean',
        'is_active' => 'boolean'
    ];

   

    public function school() { return $this->belongsTo(School::class); }
    public function academicYear() { return $this->belongsTo(AcademicYear::class); }
    public function class() { return $this->belongsTo(ClassModel::class, 'class_id'); }
    public function category() { return $this->belongsTo(FeeCategory::class, 'fee_category_id'); }
    public function invoiceItems() { return $this->hasMany(StudentInvoiceItem::class); }
}