<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;

class StaffController extends Controller
{
    /**
     * Liste tout le personnel avec leurs relations.
     */
    public function index()
    {
        try {
            $staff = Staff::with(['profile', 'school', 'department'])->get();
            return response()->json([
                'status' => 'success',
                'data' => $staff
            ], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Enregistre un nouveau membre du personnel.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_id'       => 'required|exists:profiles,id', // Note: lié à profiles dans ta migration
                'school_id'     => 'required|exists:schools,id',
                'department_id' => 'nullable|exists:departments,id',
                'employee_id'   => 'required|string',
                'job_title'     => 'required|string|max:255',
                'joining_date'  => 'required|date',
                'salary'        => 'nullable|numeric',
                'contract_type' => 'nullable|string',
                'status'        => 'nullable|string|in:active,inactive,on_leave'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Vérification de l'unicité combinée (facultatif si géré par DB mais mieux pour le message d'erreur)
            $staff = Staff::create($validator->validated());

            return response()->json([
                'status' => 'success',
                'message' => 'Membre du personnel ajouté avec succès !',
                'data' => $staff
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
     * Affiche un membre spécifique.
     */
    public function show(Staff $staff)
    {
        return response()->json([
            'status' => 'success',
            'data' => $staff->load(['profile', 'school', 'department'])
        ]);
    }

    public function update(Request $request, $id) {
    try {
        $staff = Staff::findOrFail($id);
        $validator = Validator::make($request->all(), [
            'job_title' => 'sometimes|string|max:255',
            'salary'    => 'sometimes|numeric',
            'status'    => 'sometimes|string|in:active,inactive,on_leave'
        ]);
        if ($validator->fails()) return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        $staff->update($request->all());
        return response()->json(['status' => 'success', 'message' => 'Personnel mis à jour', 'data' => $staff]);
    } catch (Exception $e) { return response()->json(['status' => 'error', 'message' => 'Membre non trouvé'], 404); }
}
}