<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LessonPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;

class LessonPlanController extends Controller
{
    /**
     * Liste les plans de cours avec filtres (par prof, matière ou section).
     */
    public function index(Request $request)
    {
        try {
            $query = LessonPlan::with(['teacher.profile', 'subject', 'section', 'approvedBy']);

            if ($request->has('teacher_id')) {
                $query->where('teacher_id', $request->teacher_id);
            }
            if ($request->has('subject_id')) {
                $query->where('subject_id', $request->subject_id);
            }

            return response()->json([
                'status' => 'success',
                'data' => $query->latest()->get()
            ], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Créer un nouveau plan de cours.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'teacher_id'       => 'required|exists:teachers,id',
                'subject_id'       => 'required|exists:subjects,id',
                'section_id'       => 'required|exists:sections,id',
                'academic_term_id' => 'required|exists:academic_terms,id',
                'title'            => 'required|string|max:255',
                'topic'            => 'required|string|max:255',
                'week_number'      => 'nullable|integer',
                'planned_date'     => 'nullable|date',
                'resources_urls'   => 'nullable|array',
                'status'           => 'nullable|in:draft,submitted,approved,rejected',
            ]);

            if ($validator->fails()) {
                return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
            }

            $lessonPlan = LessonPlan::create($validator->validated());

            return response()->json([
                'status' => 'success',
                'message' => 'Cahier de texte / Plan de cours créé avec succès.',
                'data' => $lessonPlan
            ], 201);

        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Approuver ou rejeter un plan de cours (Logique Admin).
     */
    public function approve(Request $request, LessonPlan $lessonPlan)
{
    try {
        $validator = Validator::make($request->all(), [
            'status'           => 'required|in:approved,rejected',
            'rejection_reason' => 'required_if:status,rejected|string|nullable',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        // On récupère l'ID de l'admin/directeur connecté
        $adminProfileId = auth()->user()->profile->id;

        $lessonPlan->update([
            'status'           => $request->status,
            'approved_by'      => $adminProfileId, // Sécurité : impossible de tricher
            'approved_at'      => $request->status === 'approved' ? now() : null,
            'rejection_reason' => $request->status === 'rejected' ? $request->rejection_reason : null,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Décision enregistrée avec succès.',
            'data' => $lessonPlan->load('approvedBy.profile')
        ]);
    } catch (Exception $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
}

    public function show(LessonPlan $lessonPlan)
    {
        return response()->json([
            'status' => 'success',
            'data' => $lessonPlan->load(['teacher.profile', 'subject', 'section'])
        ]);
    }

    public function update(Request $request, $id) {
    try {
        $lessonPlan = LessonPlan::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'topic' => 'sometimes|string|max:255',
            'status' => 'sometimes|in:draft,submitted,approved,rejected',
            'planned_date' => 'sometimes|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $lessonPlan->update($request->all());
        return response()->json(['status' => 'success', 'message' => 'Plan de cours mis à jour', 'data' => $lessonPlan]);
    } catch (Exception $e) { 
        return response()->json(['status' => 'error', 'message' => 'Plan non trouvé'], 404); 
    }
}

}