<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;

class ProfileController extends Controller
{
    /**
     * Liste tous les profils avec les informations de l'utilisateur lié.
     */
    public function index()
    {
        try {
            $profiles = Profile::with('user')->get();
            return response()->json([
                'status' => 'success',
                'data' => $profiles
            ], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Crée un nouveau profil.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
    'user_id'       => 'required|exists:users,id|unique:profiles,user_id',
    'email'         => 'required|email|unique:profiles,email',
    'first_name'    => 'required|string|max:255',
    'last_name'     => 'required|string|max:255',
    'phone'         => 'nullable|string|max:20',
    'status'        => 'nullable|string',
    'address'       => 'nullable|string',
    'gender'        => 'nullable|string', 
    'date_of_birth' => 'nullable|date', // <--- Changé birth_date en date_of_birth pour coller à la migration
]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Ici, validator->validated() contiendra maintenant l'email et le status
            $profile = Profile::create($validator->validated());

            return response()->json([
                'status' => 'success',
                'message' => 'Profil créé avec succès !',
                'data' => $profile
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
     * Affiche un profil spécifique.
     */
    public function show(Profile $profile)
    {
        return response()->json([
            'status' => 'success',
            'data' => $profile->load('user')
        ]);
    }

    /**
     * Met à jour un profil.
     */
    public function update(Request $request, $id)
{
    try {
        $profile = Profile::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'first_name'    => 'sometimes|string|max:255',
            'last_name'     => 'sometimes|string|max:255',
            'phone'         => 'nullable|string|max:20',
            'status'        => 'nullable|string',
            'gender'        => 'nullable|in:M,F,Other',
            'date_of_birth' => 'nullable|date', // Utilise bien le nom du modèle
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $profile->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Profil mis à jour !',
            'data' => $profile
        ]);
    } catch (Exception $e) {
        return response()->json(['status' => 'error', 'message' => 'Profil non trouvé'], 404);
    }
}
}