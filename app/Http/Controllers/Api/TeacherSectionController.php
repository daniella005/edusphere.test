<?php

namespace App\Http\Controllers\Api;

use App\Models\TeacherSection;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class TeacherSectionController extends Controller
{
    /**
     * Afficher les affectations enseignant-section
     */
    public function index(Request $request)
    {
        $query = TeacherSection::with(['teacher.user', 'section.class', 'subject', 'academicYear']);
        
        if ($request->has('teacher_id')) {
            $query->where('teacher_id', $request->teacher_id);
        }
        
        if ($request->has('section_id')) {
            $query->where('section_id', $request->section_id);
        }
        
        if ($request->has('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }
        
        if ($request->has('academic_year_id')) {
            $query->where('academic_year_id', $request->academic_year_id);
        }
        
        $assignments = $query->get();
        
        return response()->json([
            'success' => true,
            'data' => $assignments
        ]);
    }

    /**
     * Créer une affectation
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'teacher_id' => 'required|exists:teachers,id',
            'section_id' => 'required|exists:sections,id',
            'subject_id' => 'required|exists:subjects,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Vérifier l'unicité
        $exists = TeacherSection::where('teacher_id', $request->teacher_id)
            ->where('section_id', $request->section_id)
            ->where('subject_id', $request->subject_id)
            ->where('academic_year_id', $request->academic_year_id)
            ->exists();
            
        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Cet enseignant est déjà affecté à cette section pour cette matière'
            ], 409);
        }

        $assignment = TeacherSection::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $assignment->load(['teacher.user', 'section', 'subject'])
        ], 201);
    }

    /**
     * Afficher une affectation spécifique
     */
    public function show($id)
    {
        $assignment = TeacherSection::with(['teacher.user', 'section.class', 'subject', 'academicYear'])
            ->find($id);

        if (!$assignment) {
            return response()->json([
                'success' => false,
                'message' => 'Affectation non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $assignment
        ]);
    }

    /**
     * Mettre à jour une affectation
     */
    public function update(Request $request, $id)
    {
        $assignment = TeacherSection::find($id);

        if (!$assignment) {
            return response()->json([
                'success' => false,
                'message' => 'Affectation non trouvée'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'is_active' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $assignment->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $assignment
        ]);
    }

    /**
     * Supprimer une affectation
     */
    public function destroy($id)
    {
        $assignment = TeacherSection::find($id);

        if (!$assignment) {
            return response()->json([
                'success' => false,
                'message' => 'Affectation non trouvée'
            ], 404);
        }

        $assignment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Affectation supprimée'
        ]);
    }

    /**
     * Obtenir l'emploi du temps d'un enseignant
     */
    public function teacherTimetable($teacherId, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'academic_year_id' => 'required|exists:academic_years,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $assignments = TeacherSection::where('teacher_id', $teacherId)
            ->where('academic_year_id', $request->academic_year_id)
            ->where('is_active', true)
            ->with(['section', 'subject'])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $assignments
        ]);
    }
}