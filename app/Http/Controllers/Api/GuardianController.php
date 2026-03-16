<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Guardian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;

class GuardianController extends Controller
{
    public function index()
    {
        try {
            $guardians = Guardian::with(['user', 'profile'])->get();
            return response()->json(['status' => 'success', 'data' => $guardians]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_id'           => 'required|exists:users,id|unique:guardians,user_id',
                'school_id'         => 'required|exists:schools,id',
                'relationship_type' => 'required|string',
                'occupation'        => 'nullable|string',
                'status'            => 'nullable|string|in:active,inactive',
            ]);

            if ($validator->fails()) {
                return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
            }

            $guardian = Guardian::create($validator->validated());

            return response()->json([
                'status' => 'success',
                'message' => 'Parent/Tuteur créé avec succès',
                'data' => $guardian
            ], 201);

        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
{
    try {
        $guardian = Guardian::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'relationship_type' => 'sometimes|string',
            'occupation'        => 'nullable|string',
            'status'            => 'sometimes|string|in:active,inactive',
            'office_phone'      => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $guardian->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Tuteur mis à jour',
            'data' => $guardian
        ]);
    } catch (Exception $e) {
        return response()->json(['status' => 'error', 'message' => 'Tuteur non trouvé'], 404);
    }
}

}