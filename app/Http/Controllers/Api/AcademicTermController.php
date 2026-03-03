<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademicTerm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AcademicTermController extends Controller
{
    /**
     * Liste des périodes académiques.
     */
    public function index()
    {
        $terms = AcademicTerm::with(['school', 'academicYear'])->get();
        return response()->json([
            'status' => 'success',
            'data' => $terms
        ]);
    }

    /**
     * Création d'une nouvelle période (Trimestre/Semestre).
     */
    public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'school_id' => 'required|exists:schools,id',
        'academic_year_id' => 'required|exists:academic_years,id',
        'name' => 'required|string|max:255',
        'term_type' => 'required|string',
        'start_date' => 'required|date',
        'end_date' => 'required|date|after:start_date',
        'is_current' => 'boolean', // Changé de is_active à is_current
        'display_order' => 'integer',
        'settings' => 'nullable|array'
    ]);

    if ($validator->fails()) {
        return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
    }

    $term = AcademicTerm::create($request->all());

    return response()->json([
        'status' => 'success',
        'message' => 'Période académique créée avec succès !',
        'data' => $term
    ], 201);
}

    /**
     * Détails d'une période.
     */
    public function show($id)
    {
        $term = AcademicTerm::with(['school', 'academicYear'])->find($id);

        if (!$term) {
            return response()->json(['status' => 'error', 'message' => 'Période introuvable'], 404);
        }

        return response()->json(['status' => 'success', 'data' => $term]);
    }

    /**
     * Mise à jour d'une période.
     */
    public function update(Request $request, $id)
    {
        $term = AcademicTerm::find($id);

        if (!$term) {
            return response()->json(['status' => 'error', 'message' => 'Période introuvable'], 404);
        }

        $term->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Période mise à jour !',
            'data' => $term
        ]);
    }

    /**
     * Suppression d'une période.
     */
    public function destroy($id)
    {
        $term = AcademicTerm::find($id);

        if (!$term) {
            return response()->json(['status' => 'error', 'message' => 'Période introuvable'], 404);
        }

        $term->delete();

        return response()->json(['status' => 'success', 'message' => 'Période supprimée']);
    }
}