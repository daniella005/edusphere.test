<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExamResult;
use App\Models\ExamSchedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;

class ExamResultController extends Controller
{
    /**
     * Liste des résultats (filtrable par épreuve ou par étudiant).
     */
    public function index(Request $request)
    {
        try {
            $query = ExamResult::with(['student.profile', 'examSchedule.subject', 'evaluatedBy']);

            if ($request->has('exam_schedule_id')) {
                $query->where('exam_schedule_id', $request->exam_schedule_id);
            }
            if ($request->has('student_id')) {
                $query->where('student_id', $request->student_id);
            }

            return response()->json([
                'status' => 'success',
                'count' => $query->count(),
                'data' => $query->get()
            ], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Enregistrer une note.
     */
    public function store(Request $request)
{
    try {
        $validator = Validator::make($request->all(), [
            'exam_schedule_id' => 'required|exists:exam_schedules,id',
            'student_id'       => 'required|exists:students,id',
            'marks_obtained'   => 'nullable|numeric|min:0',
            'is_absent'        => 'boolean',
            'is_exempted'      => 'boolean',
            'remarks'          => 'nullable|string',
            // 'evaluated_by' retiré de la validation requise car automatisé
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $profileId = auth()->user()->profile->id ?? null;
        $data = $validator->validated();
        $data['evaluated_by'] = $profileId;

        // Calcul automatique du pourcentage
        if (isset($data['marks_obtained']) && !$data['is_absent']) {
            $schedule = ExamSchedule::findOrFail($data['exam_schedule_id']);
            
            if ($schedule->total_marks > 0) {
                $data['percentage'] = ($data['marks_obtained'] / $schedule->total_marks) * 100;
            } else {
                $data['percentage'] = 0;
            }
            $data['evaluated_at'] = now();
        }

        $result = ExamResult::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Note enregistrée avec succès !',
            'data' => $result->load(['student.profile', 'examSchedule.subject'])
        ], 201);

    } catch (Exception $e) {
        return response()->json([
            'status' => 'error', 
            'message' => 'Erreur lors de l\'enregistrement. L\'élève a peut-être déjà une note.',
        ], 409);
    }
}

    /**
     * Mettre à jour une note (Correction).
     */
    public function update(Request $request, ExamResult $examResult)
    {
        try {
            $examResult->update($request->all());
            return response()->json([
                'status' => 'success',
                'message' => 'Note mise à jour.',
                'data' => $examResult
            ]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}