<?php

namespace App\Http\Controllers\Api;

use App\Models\StudentAcademicHistory;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class StudentAcademicHistoryController extends Controller
{
    /**
     * Afficher l'historique académique
     */
    public function index(Request $request)
    {
        $query = StudentAcademicHistory::with(['student.user', 'academicYear', 'section', 'promotedToSection']);
        
        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }
        
        if ($request->has('academic_year_id')) {
            $query->where('academic_year_id', $request->academic_year_id);
        }
        
        $history = $query->orderBy('academic_year_id', 'desc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $history
        ]);
    }

    /**
     * Créer une entrée d'historique
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:students,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'section_id' => 'required|exists:sections,id',
            'roll_number' => 'nullable|string|max:20',
            'final_grade' => 'nullable|string|max:10',
            'final_percentage' => 'nullable|numeric|min:0|max:100',
            'promoted_to_section_id' => 'nullable|exists:sections,id',
            'remarks' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Vérifier l'unicité
        $exists = StudentAcademicHistory::where('student_id', $request->student_id)
            ->where('academic_year_id', $request->academic_year_id)
            ->exists();
            
        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Une entrée existe déjà pour cette année académique'
            ], 409);
        }

        $history = StudentAcademicHistory::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $history->load(['student.user', 'academicYear', 'section'])
        ], 201);
    }

    /**
     * Afficher une entrée spécifique
     */
    public function show($id)
    {
        $history = StudentAcademicHistory::with(['student.user', 'academicYear', 'section', 'promotedToSection'])
            ->find($id);

        if (!$history) {
            return response()->json([
                'success' => false,
                'message' => 'Entrée non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $history
        ]);
    }

    /**
     * Mettre à jour une entrée
     */
    public function update(Request $request, $id)
    {
        $history = StudentAcademicHistory::find($id);

        if (!$history) {
            return response()->json([
                'success' => false,
                'message' => 'Entrée non trouvée'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'final_grade' => 'nullable|string|max:10',
            'final_percentage' => 'nullable|numeric|min:0|max:100',
            'promoted_to_section_id' => 'nullable|exists:sections,id',
            'remarks' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $history->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $history
        ]);
    }

    /**
     * Supprimer une entrée
     */
    public function destroy($id)
    {
        $history = StudentAcademicHistory::find($id);

        if (!$history) {
            return response()->json([
                'success' => false,
                'message' => 'Entrée non trouvée'
            ], 404);
        }

        $history->delete();

        return response()->json([
            'success' => true,
            'message' => 'Entrée supprimée'
        ]);
    }

    /**
     * Obtenir le parcours complet d'un étudiant
     */
    public function studentTimeline($studentId)
    {
        $history = StudentAcademicHistory::where('student_id', $studentId)
            ->with(['academicYear', 'section.class', 'promotedToSection.class'])
            ->orderBy('academic_year_id', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $history
        ]);
    }

    /**
     * Promouvoir un étudiant
     */
    public function promote(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:students,id',
            'current_academic_year_id' => 'required|exists:academic_years,id',
            'next_academic_year_id' => 'required|exists:academic_years,id',
            'next_section_id' => 'required|exists:sections,id',
            'final_grade' => 'nullable|string',
            'final_percentage' => 'nullable|numeric|min:0|max:100',
            'remarks' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Mettre à jour l'entrée actuelle
            $currentHistory = StudentAcademicHistory::where('student_id', $request->student_id)
                ->where('academic_year_id', $request->current_academic_year_id)
                ->first();

            if ($currentHistory) {
                $currentHistory->update([
                    'final_grade' => $request->final_grade,
                    'final_percentage' => $request->final_percentage,
                    'promoted_to_section_id' => $request->next_section_id
                ]);
            }

            // Créer la nouvelle entrée
            $newHistory = StudentAcademicHistory::create([
                'student_id' => $request->student_id,
                'academic_year_id' => $request->next_academic_year_id,
                'section_id' => $request->next_section_id,
                'remarks' => $request->remarks
            ]);

            // Mettre à jour l'étudiant
            $student = \App\Models\Student::find($request->student_id);
            $student->section_id = $request->next_section_id;
            $student->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Étudiant promu avec succès',
                'data' => [
                    'previous' => $currentHistory,
                    'current' => $newHistory
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la promotion',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}