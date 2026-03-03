<?php

namespace App\Http\Controllers\Api;

use App\Models\AcademicYear;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class AcademicYearController extends Controller
{
    /**
     * Afficher la liste des années académiques
     */
    public function index()
    {
        $academicYears = AcademicYear::with('school')->get();
        
        return response()->json([
            'success' => true,
            'data' => $academicYears
        ]);
    }

    /**
     * Créer une nouvelle année académique
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'school_id' => 'required|exists:schools,id',
            'name' => 'required|string|max:100',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_current' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Si is_current est true, mettre à jour les autres années
        if ($request->is_current) {
            AcademicYear::where('school_id', $request->school_id)
                ->update(['is_current' => false]);
        }

        $academicYear = AcademicYear::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Année académique créée avec succès',
            'data' => $academicYear
        ], 201);
    }

    /**
     * Afficher une année académique spécifique
     */
    public function show($id)
    {
        $academicYear = AcademicYear::with('school')->find($id);

        if (!$academicYear) {
            return response()->json([
                'success' => false,
                'message' => 'Année académique non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $academicYear
        ]);
    }

    /**
     * Mettre à jour une année académique
     */
    public function update(Request $request, $id)
    {
        $academicYear = AcademicYear::find($id);

        if (!$academicYear) {
            return response()->json([
                'success' => false,
                'message' => 'Année académique non trouvée'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:100',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after:start_date',
            'is_current' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Si is_current est true, mettre à jour les autres années
        if ($request->is_current) {
            AcademicYear::where('school_id', $academicYear->school_id)
                ->where('id', '!=', $id)
                ->update(['is_current' => false]);
        }

        $academicYear->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Année académique mise à jour avec succès',
            'data' => $academicYear
        ]);
    }

    /**
     * Supprimer une année académique
     */
    public function destroy($id)
    {
        $academicYear = AcademicYear::find($id);

        if (!$academicYear) {
            return response()->json([
                'success' => false,
                'message' => 'Année académique non trouvée'
            ], 404);
        }

        $academicYear->delete();

        return response()->json([
            'success' => true,
            'message' => 'Année académique supprimée avec succès'
        ]);
    }
}