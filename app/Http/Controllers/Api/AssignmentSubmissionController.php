<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AssignmentSubmission;
use App\Models\Assignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AssignmentSubmissionController extends Controller
{
    /**
     * Liste des soumissions pour un devoir (côté prof)
     */
    public function index(Request $request)
    {
        $query = AssignmentSubmission::with('student.profile');

        if ($request->has('assignment_id')) {
            $query->where('assignment_id', $request->assignment_id);
        }

        return response()->json(['success' => true, 'data' => $query->get()]);
    }

    /**
 * Soumettre un devoir (côté élève)
 */
public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'assignment_id' => 'required|exists:assignments,id',
        'submission_text' => 'nullable|string',
        'attachment_urls' => 'nullable|array'
    ]);

    if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);

    $assignment = Assignment::findOrFail($request->assignment_id);
    
    // 1. Vérification de la date limite
    $isLate = now()->gt($assignment->due_date);
    if ($isLate && !$assignment->allow_late_submission) {
        return response()->json([
            'success' => false, 
            'message' => 'Ce devoir n\'accepte plus de soumissions (date limite dépassée).'
        ], 403);
    }

    // 2. Récupération auto de l'élève (via son profil utilisateur)
    $studentId = auth()->user()->profile->student->id ?? $request->student_id;

    $submission = AssignmentSubmission::create([
        'assignment_id' => $request->assignment_id,
        'student_id' => $studentId,
        'submission_text' => $request->submission_text,
        'attachment_urls' => $request->attachment_urls,
        'submitted_at' => now(),
        'is_late' => $isLate,
        'status' => 'submitted'
    ]);

    return response()->json(['success' => true, 'data' => $submission], 201);
}

/**
 * Noter un devoir (côté prof)
 */
public function grade(Request $request, $id)
{
    $submission = AssignmentSubmission::with('assignment')->findOrFail($id);

    $validator = Validator::make($request->all(), [
        'marks_obtained' => 'required|numeric|min:0',
        'feedback' => 'nullable|string',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    // On récupère le total des points (vérifie si ta colonne s'appelle total_marks ou max_marks dans 'assignments')
    $totalMarks = $submission->assignment->total_marks ?? $submission->assignment->max_marks ?? 0;
    
    // Calcul du pourcentage sécurisé
    $percentage = ($totalMarks > 0) ? ($request->marks_obtained / $totalMarks) * 100 : 0;

    $submission->update([
        'marks_obtained' => $request->marks_obtained,
        'percentage' => $percentage,
        'feedback' => $request->feedback,
        // On prend l'ID du prof connecté, sinon celui passé en paramètre
        'graded_by' => auth()->user()->profile->id ?? $request->graded_by, 
        'graded_at' => now(),
        'status' => 'graded'
    ]);

    return response()->json([
        'success' => true, 
        'message' => 'Devoir noté avec succès !', 
        'data' => $submission
    ]);
}   
}