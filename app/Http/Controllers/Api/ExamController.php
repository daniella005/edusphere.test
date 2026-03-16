<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;

class ExamController extends Controller
{
    /**
     * Liste tous les examens d'une école.
     */
    public function index(Request $request)
    {
        try {
            $query = Exam::with(['category', 'school', 'createdBy']);

            if ($request->has('school_id')) {
                $query->where('school_id', $request->school_id);
            }

            return response()->json([
                'status' => 'success',
                'data' => $query->get()
            ], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Créer un nouvel examen.
     */
    public function store(Request $request)
{
    try {
        $validator = Validator::make($request->all(), [
            'school_id'        => 'required|exists:schools,id',
            'academic_term_id' => 'required|exists:academic_terms,id',
            'exam_category_id' => 'nullable|exists:exam_categories,id',
            'name'             => 'required|string|max:255',
            'exam_type'        => 'required|string', 
            'start_date'       => 'required|date',
            'end_date'         => 'required|date|after_or_equal:start_date',
            'status'           => 'nullable|in:scheduled,ongoing,completed,cancelled',
            'description'      => 'nullable|string',
            'created_by'       => 'required|exists:profiles,id', // On valide que l'ID envoyé existe
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        // --- LA MODIFICATION EST ICI ---
        // On prend l'ID envoyé dans le JSON (Postman) au lieu de l'ID de session
        $profileId = $request->created_by; 

        $data = $validator->validated();
        $data['created_by'] = $profileId;

        $exam = Exam::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Examen planifié avec succès !',
            'data' => $exam->load(['category', 'school'])
        ], 201);

    } catch (Exception $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
}

    /**
     * Détails d'un examen.
     */
    public function show(Exam $exam)
    {
        return response()->json([
            'status' => 'success',
            'data' => $exam->load(['category', 'school', 'createdBy', 'schedules'])
        ]);
    }

    public function update(Request $request, $id) {
    try {
        $exam = Exam::findOrFail($id);
        $validator = Validator::make($request->all(), [
            'name'   => 'sometimes|string|max:255',
            'status' => 'sometimes|in:scheduled,ongoing,completed,cancelled'
        ]);
        if ($validator->fails()) return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        $exam->update($request->all());
        return response()->json(['status' => 'success', 'message' => 'Examen mis à jour', 'data' => $exam]);
    } catch (Exception $e) { return response()->json(['status' => 'error', 'message' => 'Examen non trouvé'], 404); }
}

}