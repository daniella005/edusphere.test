<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SubscriptionPlan extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name', 'code', 'description', 'price', 'billing_cycle',
        'max_schools', 'max_students', 'max_teachers', 'max_staff',
        'max_classes', 'features', 'modules', 'has_api_access',
        'has_priority_support', 'is_public', 'is_active',
        'trial_days', 'sort_order'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'features' => 'json',
        'modules' => 'json',
        'has_api_access' => 'boolean',
        'has_priority_support' => 'boolean',
        'is_public' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function subscriptions()
    {
        return $this->hasMany(SchoolSubscription::class, 'plan_id');
    }
}