<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PlatformUser extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id', 
        'platform_role', 
        'department', 
        'permissions'
    ];

    protected $casts = [
        'permissions' => 'json',
    ];

    /**
     * Relation vers le profil (qui contient les infos de base)
     */
    public function profile()
    {
        return $this->belongsTo(Profile::class, 'user_id');
    }

    /**
     * Relation indirecte vers l'utilisateur (via le profil)
     */
    public function user()
    {
        return $this->hasOneThrough(
            User::class,
            Profile::class,
            'id', // clé locale sur profiles
            'id', // clé locale sur users
            'user_id', // clé étrangère sur platform_users
            'user_id'  // clé étrangère sur profiles
        );
    }
}