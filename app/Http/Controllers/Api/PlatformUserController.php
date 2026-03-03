<?php

namespace App\Http\Controllers\Api;

use App\Models\PlatformUser;
use App\Models\Profile;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class PlatformUserController extends Controller
{
    /**
     * Afficher les utilisateurs plateforme
     */
    public function index(Request $request)
    {
        $query = PlatformUser::with(['user']);
        
        if ($request->has('platform_role')) {
            $query->where('platform_role', $request->platform_role);
        }
        
        if ($request->has('department')) {
            $query->where('department', 'like', '%' . $request->department . '%');
        }
        
        $users = $query->paginate(15);
        
        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Créer un utilisateur plateforme
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'platform_role' => 'required|in:super_admin,support,analyst',
            'department' => 'nullable|string|max:100',
            'permissions' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Créer l'utilisateur
            $user = \App\Models\User::create([
                'name' => $request->first_name . ' ' . $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password)
            ]);

            // ... après la création du profil
$profile = Profile::create([
    'user_id'    => $user->id,
    'email'      => $request->email,
    'first_name' => $request->first_name,
    'last_name'  => $request->last_name,
    'status'     => 'active'
]);

// Créer l'utilisateur plateforme en utilisant l'ID du PROFIL
$platformUser = PlatformUser::create([
    'user_id'       => $profile->id, // <--- CORRECTION : On utilise l'ID du profil fraîchement créé
    'platform_role' => $request->platform_role,
    'department'    => $request->department,
    'permissions'   => $request->permissions ?? []
]);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $platformUser->load(['user'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher un utilisateur plateforme
     */
    public function show($id)
    {
        $platformUser = PlatformUser::with(['user'])->find($id);

        if (!$platformUser) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $platformUser
        ]);
    }

    /**
     * Mettre à jour un utilisateur plateforme
     */
    public function update(Request $request, $id)
    {
        $platformUser = PlatformUser::find($id);

        if (!$platformUser) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'platform_role' => 'sometimes|in:super_admin,support,analyst',
            'department' => 'nullable|string|max:100',
            'permissions' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $platformUser->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $platformUser->load(['user'])
        ]);
    }

    /**
     * Supprimer un utilisateur plateforme
     */
    public function destroy($id)
    {
        $platformUser = PlatformUser::find($id);

        if (!$platformUser) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }

        DB::beginTransaction();
        try {
            $userId = $platformUser->user_id;
            
            // Supprimer l'utilisateur plateforme
            $platformUser->delete();
            
            // Désactiver le profil (on ne supprime pas complètement pour garder l'historique)
            $profile = Profile::where('user_id', $userId)->first();
            if ($profile) {
                $profile->update(['status' => 'inactive']);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur supprimé'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les permissions d'un utilisateur
     */
    public function permissions($id)
    {
        $platformUser = PlatformUser::find($id);

        if (!$platformUser) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }

        // Permissions par défaut selon le rôle
        $rolePermissions = [
            'super_admin' => ['*'], // Toutes les permissions
            'support' => [
                'view_tickets', 'reply_tickets', 'resolve_tickets',
                'view_schools', 'view_users'
            ],
            'analyst' => [
                'view_reports', 'export_data', 'view_stats'
            ]
        ];

        $permissions = array_merge(
            $rolePermissions[$platformUser->platform_role] ?? [],
            $platformUser->permissions ?? []
        );

        return response()->json([
            'success' => true,
            'data' => $permissions
        ]);
    }

    /**
     * Vérifier si un utilisateur a une permission spécifique
     */
    public function checkPermission(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'permission' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $platformUser = PlatformUser::find($id);

        if (!$platformUser) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }

        $hasPermission = $this->userHasPermission($platformUser, $request->permission);

        return response()->json([
            'success' => true,
            'data' => [
                'user_id' => $id,
                'permission' => $request->permission,
                'has_permission' => $hasPermission
            ]
        ]);
    }

    /**
     * Vérifier si un utilisateur a une permission
     */
    private function userHasPermission($platformUser, $permission)
    {
        // Super admin a tout
        if ($platformUser->platform_role === 'super_admin') {
            return true;
        }

        // Vérifier dans les permissions personnalisées
        if (in_array($permission, $platformUser->permissions ?? [])) {
            return true;
        }

        // Permissions par rôle
        $rolePermissions = [
            'support' => ['view_tickets', 'reply_tickets', 'resolve_tickets', 'view_schools', 'view_users'],
            'analyst' => ['view_reports', 'export_data', 'view_stats']
        ];

        return in_array($permission, $rolePermissions[$platformUser->platform_role] ?? []);
    }

    /**
     * Obtenir les statistiques des utilisateurs plateforme
     */
    public function stats()
    {
        $stats = [
            'total' => PlatformUser::count(),
            'by_role' => PlatformUser::selectRaw('platform_role, count(*) as count')
                ->groupBy('platform_role')
                ->pluck('count', 'platform_role'),
            'by_department' => PlatformUser::whereNotNull('department')
                ->selectRaw('department, count(*) as count')
                ->groupBy('department')
                ->pluck('count', 'department')
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}