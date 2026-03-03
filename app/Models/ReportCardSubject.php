<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ReportCardSubject extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'report_card_id', 'subject_id', 'total_marks',
        'marks_obtained', 'percentage', 'grade',
        'grade_points', 'teacher_remarks'
    ];

    protected $casts = [
        'total_marks' => 'decimal:2',
        'marks_obtained' => 'decimal:2',
        'percentage' => 'decimal:2',
        'grade_points' => 'decimal:2',
    ];

    public function reportCard() { return $this->belongsTo(ReportCard::class); }
    public function subject() { return $this->belongsTo(Subject::class); }
}