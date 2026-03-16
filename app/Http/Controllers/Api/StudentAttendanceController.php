<?php

namespace App\Http\Controllers\Api;

use App\Models\StudentAttendance;
use App\Models\Student;
use App\Models\Section;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class StudentAttendanceController extends Controller
{
    /**
     * Afficher la liste des présences
     */
    public function index(Request $request)
    {
        // Correction : markedBy au lieu de recorder pour correspondre au modèle
        $query = StudentAttendance::with(['student', 'section', 'markedBy']);
        
        if ($request->has('student_id')) $query->where('student_id', $request->student_id);
        if ($request->has('section_id')) $query->where('section_id', $request->section_id);
        if ($request->has('date')) $query->whereDate('attendance_date', $request->date);
        if ($request->has('status')) $query->where('status', $request->status);
        
        // Correction du tri : attendance_date au lieu de date
        $attendances = $query->orderBy('attendance_date', 'desc')->paginate($request->get('per_page', 15));
        
        return response()->json(['success' => true, 'data' => $attendances]);
    }

    /**
     * Créer une nouvelle présence
     */
   public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'student_id'       => 'required|exists:students,id',
        'section_id'       => 'required|exists:sections,id',
        'academic_term_id' => 'required|exists:academic_terms,id',
        'attendance_date'  => 'required|date',
        'status'           => 'required|in:present,absent,late,excused',
        'recorded_by'      => 'required|exists:profiles,id',
        'remark'           => 'nullable|string'
    ]);

    if ($validator->fails()) {
        return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
    }

    // 1. Vérification de la section
    $student = Student::find($request->student_id);
    if ($student && $student->section_id != $request->section_id) {
        return response()->json(['success' => false, 'message' => "L'étudiant n'appartient pas à cette section"], 422);
    }

    try {
        // 2. Utilisation DIRECTE du modèle StudentAttendance (qui a déjà protected $table = 'attendances')
        // On utilise updateOrCreate pour gérer les doublons proprement
        $attendance = \App\Models\StudentAttendance::updateOrCreate(
            [
                'student_id'      => $request->student_id,
                'attendance_date' => $request->attendance_date,
                'section_id'      => $request->section_id,
            ],
            [
                'status'           => $request->status,
                'remark'           => $request->remark ?? $request->remarks,
                'recorded_by'      => $request->recorded_by,
                'academic_term_id' => $request->academic_term_id,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Présence enregistrée avec succès',
            'data'    => $attendance->load(['student'])
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false, 
            'message' => 'Erreur lors de l\'enregistrement', 
            'error'   => $e->getMessage()
        ], 500);
    }
}
    /**
     * Afficher une présence spécifique
     */
    public function show($id)
    {
        $attendance = StudentAttendance::with(['student', 'section', 'markedBy'])->find($id);

        if (!$attendance) {
            return response()->json([
                'success' => false,
                'message' => 'Présence non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $attendance
        ]);
    }

    /**
     * Mettre à jour une présence
     */
    // PUT : Mise à jour (OPTIMISÉ)
    public function update(Request $request, $id)
    {
        $attendance = StudentAttendance::find($id);

        if (!$attendance) {
            return response()->json(['success' => false, 'message' => 'Présence non trouvée'], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'sometimes|in:present,absent,late,excused',
            'remark' => 'nullable|string', // Utilisation de remark (singulier)
            'attendance_date' => 'sometimes|date'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        // On ne met à jour que les champs autorisés
        $attendance->update($request->only(['status', 'remark', 'attendance_date']));

        return response()->json([
            'success' => true,
            'message' => 'Présence mise à jour avec succès',
            'data' => $attendance
        ]);
    }
    /**
     * Supprimer une présence
     */
    public function destroy($id)
    {
        $attendance = StudentAttendance::find($id);

        if (!$attendance) {
            return response()->json([
                'success' => false,
                'message' => 'Présence non trouvée'
            ], 404);
        }

        $attendance->delete();

        return response()->json([
            'success' => true,
            'message' => 'Présence supprimée avec succès'
        ]);
    }

    /**
     * Obtenir les présences du jour pour une section
     */
    public function daily(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date',
            'section_id' => 'required|exists:sections,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Récupérer tous les étudiants de la section
        $students = Student::where('section_id', $request->section_id)
            ->where('status', 'active')
            ->get();
            
        // Récupérer les présences existantes pour cette date
        $attendances = StudentAttendance::where('section_id', $request->section_id)
            ->whereDate('date', $request->date)
            ->get()
            ->keyBy('student_id');

        $result = [];
        foreach ($students as $student) {
            $result[] = [
                'student' => $student,
                'attendance' => $attendances[$student->id] ?? null
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'date' => $request->date,
                'section_id' => $request->section_id,
                'total_students' => count($students),
                'present_count' => $attendances->where('status', 'present')->count(),
                'absent_count' => $attendances->where('status', 'absent')->count(),
                'late_count' => $attendances->where('status', 'late')->count(),
                'excused_count' => $attendances->where('status', 'excused')->count(),
                'details' => $result
            ]
        ]);
    }

    /**
     * Marquer les présences en lot pour une section
     */
    public function bulkStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'section_id' => 'required|exists:sections,id',
            'date' => 'required|date',
            'marked_by' => 'required|exists:profiles,id',
            'attendances' => 'required|array',
            'attendances.*.student_id' => 'required|exists:students,id',
            'attendances.*.status' => 'required|in:present,absent,late,excused',
            'attendances.*.remarks' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
    try {
        foreach ($request->attendances as $data) {
            // Utilisation de updateOrCreate pour éviter les doublons
            StudentAttendance::updateOrCreate(
                [
                    'student_id'      => $data['student_id'],
                    'attendance_date' => $request->date,
                    'section_id'      => $request->section_id,
                ],
                [
                    'status'           => $data['status'],
                    'remark'           => $data['remarks'] ?? null,
                    'recorded_by'      => $request->marked_by,
                    'academic_term_id' => $request->academic_term_id ?? $someDefault, 
                ]
            );
        }
        DB::commit();
        return response()->json(['success' => true, 'message' => 'Présences traitées']);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
    }
}