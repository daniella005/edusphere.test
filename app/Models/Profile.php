<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Profile extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
    'user_id',
    'email',
    'first_name',
    'last_name',
    'phone',
    'status',
    'address',
    'gender',
    'date_of_birth' // <--- Doit correspondre exactement à la migration
];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}