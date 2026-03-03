<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StudentParent extends Model
{
    use HasFactory, HasUuids;

    // FORCE le nom de la table pour correspondre à ta migration
    // Est-ce 'student_parents' ou 'student_guardians' ? 
    // Vérifie dans ton fichier de migration initial.
    protected $table = 'student_parents'; 

    protected $fillable = [
        'student_id', 
        'parent_id', // Ce champ stocke l'ID du Guardian
        'relationship', 
        'is_primary_contact', 
        'is_emergency_contact', 
        'can_pickup'
    ];

    protected $casts = [
        'is_primary_contact' => 'boolean',
        'is_emergency_contact' => 'boolean',
        'can_pickup' => 'boolean',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

        // Dans App\Models\StudentParent.php
    public function parent()
    {
        // On confirme que parent_id est lié à la table guardians
        return $this->belongsTo(Guardian::class, 'parent_id');
    }
}