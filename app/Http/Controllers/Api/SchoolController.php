<?php

namespace App\Http\Controllers\Api;

use App\Models\School;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class SchoolController extends Controller
{
    /**
     * Afficher la liste des écoles
     * GET /api/v1/schools
     */
    public function index()
    {
        $schools = School::all();
        return response()->json([
            'success' => true,
            'data' => $schools
        ]);
    }

    /**
     * Créer une nouvelle école
     * POST /api/v1/schools
     */
    public function store(Request $request)
    {
        // Validation des données
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:schools,code',
            'email' => 'nullable|email|unique:schools,email',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'country' => 'nullable|string',
            'established_year' => 'nullable|integer|min:1800|max:' . date('Y'),
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Création de l'école
        $school = School::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'École créée avec succès',
            'data' => $school
        ], 201);
    }

    /**
     * Afficher une école spécifique
     * GET /api/v1/schools/{id}
     */
    public function show($id)
    {
        $school = School::find($id);

        if (!$school) {
            return response()->json([
                'success' => false,
                'message' => 'École non trouvée'
            ], 404);
        }

        // Charger les relations
        $school->load(['academicYears', 'departments', 'classes', 'students']);

        return response()->json([
            'success' => true,
            'data' => $school
        ]);
    }

    /**
     * Mettre à jour une école
     * PUT /api/v1/schools/{id}
     */
    public function update(Request $request, $id)
    {
        $school = School::find($id);

        if (!$school) {
            return response()->json([
                'success' => false,
                'message' => 'École non trouvée'
            ], 404);
        }

        // Validation
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|unique:schools,code,' . $id,
            'email' => 'nullable|email|unique:schools,email,' . $id,
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'country' => 'nullable|string',
            'established_year' => 'nullable|integer|min:1800|max:' . date('Y'),
            'is_active' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Mise à jour
        $school->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'École mise à jour avec succès',
            'data' => $school
        ]);
    }

    /**
     * Supprimer une école
     * DELETE /api/v1/schools/{id}
     */
    public function destroy($id)
    {
        $school = School::find($id);

        if (!$school) {
            return response()->json([
                'success' => false,
                'message' => 'École non trouvée'
            ], 404);
        }

        // Vérifier si l'école a des dépendances
        if ($school->students()->count() > 0 || $school->teachers()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer : l\'école contient des étudiants ou des enseignants'
            ], 409);
        }

        $school->delete();

        return response()->json([
            'success' => true,
            'message' => 'École supprimée avec succès'
        ]);
    }

    /**
     * Obtenir les statistiques d'une école
     * GET /api/v1/schools/{id}/stats
     */
    public function stats($id)
    {
        $school = School::withCount(['students', 'teachers', 'staff', 'classes'])->find($id);

        if (!$school) {
            return response()->json([
                'success' => false,
                'message' => 'École non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'total_students' => $school->students_count,
                'total_teachers' => $school->teachers_count,
                'total_staff' => $school->staff_count,
                'total_classes' => $school->classes_count,
                'active' => $school->is_active
            ]
        ]);
    }
}