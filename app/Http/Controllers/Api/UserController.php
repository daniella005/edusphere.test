<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Exception;

class UserController extends Controller
{
    /**
     * Liste tous les utilisateurs.
     */
    public function index()
    {
        try {
            $users = User::all();
            return response()->json([
                'status' => 'success',
                'data' => $users
            ], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Crée un nouvel utilisateur (Inscription).
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Création de l'utilisateur avec hachage du mot de passe
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password), // Sécurité !
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Utilisateur créé avec succès !',
                'data' => $user
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la création',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Affiche un utilisateur spécifique.
     */
    public function show(User $user)
    {
        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

public function update(Request $request, $id)
{
    try {
        $user = User::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'name'  => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'password' => 'sometimes|nullable|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $data = $request->only(['name', 'email']);
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);
        return response()->json(['status' => 'success', 'message' => 'Utilisateur mis à jour', 'data' => $user]);
    } catch (Exception $e) {
        return response()->json(['status' => 'error', 'message' => 'Utilisateur non trouvé'], 404);
    }
}

}