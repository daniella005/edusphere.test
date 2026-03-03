<?php

namespace App\Http\Controllers\Api;

use App\Models\UserRole;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class UserRoleController extends Controller
{
    /**
     * Afficher la liste des rôles utilisateurs
     */
    public function index(Request $request)
    {
        $query = UserRole::with(['user', 'school']);
        
        // Filtrer par utilisateur
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        
        // Filtrer par école
        if ($request->has('school_id')) {
            $query->where('school_id', $request->school_id);
        }
        
        // Filtrer par rôle
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }
        
        $userRoles = $query->get();
        
        return response()->json([
            'success' => true,
            'data' => $userRoles
        ]);
    }

    /**
     * Créer un nouveau rôle utilisateur
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:profiles,id',
            'role' => 'required|string|in:super_admin,school_admin,teacher,student,parent,staff',
            'school_id' => 'nullable|required_if:role,!=,super_admin|exists:schools,id',
            'is_primary' => 'boolean',
            'granted_by' => 'nullable|exists:profiles,id',
            'expires_at' => 'nullable|date|after:now'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Vérifier l'unicité (user_id + role + school_id)
        $exists = UserRole::where('user_id', $request->user_id)
            ->where('role', $request->role)
            ->where('school_id', $request->school_id)
            ->exists();
            
        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Ce rôle existe déjà pour cet utilisateur dans cette école'
            ], 409);
        }

        $userRole = UserRole::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Rôle attribué avec succès',
            'data' => $userRole->load(['user', 'school'])
        ], 201);
    }

    /**
     * Afficher un rôle spécifique
     */
    public function show($id)
    {
        $userRole = UserRole::with(['user', 'school', 'grantedBy'])->find($id);

        if (!$userRole) {
            return response()->json([
                'success' => false,
                'message' => 'Rôle non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $userRole
        ]);
    }

    /**
     * Mettre à jour un rôle
     */
    public function update(Request $request, $id)
    {
        $userRole = UserRole::find($id);

        if (!$userRole) {
            return response()->json([
                'success' => false,
                'message' => 'Rôle non trouvé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'is_primary' => 'sometimes|boolean',
            'expires_at' => 'nullable|date|after:now'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $userRole->update($request->only(['is_primary', 'expires_at']));

        return response()->json([
            'success' => true,
            'message' => 'Rôle mis à jour avec succès',
            'data' => $userRole
        ]);
    }

    /**
     * Supprimer un rôle
     */
    public function destroy($id)
    {
        $userRole = UserRole::find($id);

        if (!$userRole) {
            return response()->json([
                'success' => false,
                'message' => 'Rôle non trouvé'
            ], 404);
        }

        $userRole->delete();

        return response()->json([
            'success' => true,
            'message' => 'Rôle supprimé avec succès'
        ]);
    }

    /**
     * Obtenir les rôles d'un utilisateur spécifique
     */
    public function getUserRoles($userId)
    {
        $roles = UserRole::with(['school'])
            ->where('user_id', $userId)
            ->get();
            
        return response()->json([
            'success' => true,
            'data' => $roles
        ]);
    }
}