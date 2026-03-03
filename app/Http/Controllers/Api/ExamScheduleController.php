<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExamSchedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;

class ExamScheduleController extends Controller
{
    /**
     * Liste les programmations d'examens (possibilité de filtrer par exam_id ou class_id).
     */
    public function index(Request $request)
    {
        try {
            $query = ExamSchedule::with(['exam', 'subject', 'class', 'room', 'invigilator.profile']);

            if ($request->has('exam_id')) {
                $query->where('exam_id', $request->exam_id);
            }
            if ($request->has('class_id')) {
                $query->where('class_id', $request->class_id);
            }

            return response()->json([
                'status' => 'success',
                'data' => $query->orderBy('exam_date')->orderBy('start_time')->get()
            ], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Créer une nouvelle épreuve dans le calendrier.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'exam_id'          => 'required|exists:exams,id',
                'subject_id'       => 'required|exists:subjects,id',
                'class_id'         => 'required|exists:classes,id',
                'exam_date'        => 'required|date',
                'start_time'       => 'required',
                'end_time'         => 'required|after:start_time',
                'duration_minutes' => 'required|integer|min:1',
                'room_id'          => 'nullable|exists:rooms,id',
                'total_marks'      => 'required|numeric|min:0',
                'passing_marks'    => 'required|numeric|min:0|lte:total_marks',
                'invigilator_id'   => 'nullable|exists:teachers,id',
                'status'           => 'nullable|string|in:scheduled,ongoing,completed,cancelled',
            ]);

            if ($validator->fails()) {
                return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
            }

            $schedule = ExamSchedule::create($validator->validated());

            return response()->json([
                'status' => 'success',
                'message' => 'Épreuve planifiée avec succès !',
                'data' => $schedule
            ], 201);

        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Affiche les détails d'une épreuve spécifique.
     */
    public function show(ExamSchedule $examSchedule)
    {
        return response()->json([
            'status' => 'success',
            'data' => $examSchedule->load(['exam', 'subject', 'class', 'room', 'invigilator.profile'])
        ]);
    }

    /**
     * Supprimer une épreuve du calendrier.
     */
    public function destroy(ExamSchedule $examSchedule)
    {
        try {
            $examSchedule->delete();
            return response()->json(['status' => 'success', 'message' => 'Épreuve supprimée du calendrier.']);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}