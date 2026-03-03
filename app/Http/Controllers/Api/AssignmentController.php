<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;

class AssignmentController extends Controller
{
    /**
     * Liste des devoirs (filtrables par section ou matière).
     */
    public function index(Request $request)
    {
        try {
            $query = Assignment::with(['teacher.profile', 'subject', 'section']);

            if ($request->has('section_id')) {
                $query->where('section_id', $request->section_id);
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
     * Créer un nouveau devoir.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'school_id'        => 'required|exists:schools,id',
                'teacher_id'       => 'required|exists:teachers,id',
                'subject_id'       => 'required|exists:subjects,id',
                'section_id'       => 'required|exists:sections,id',
                'academic_term_id' => 'required|exists:academic_terms,id',
                'title'            => 'required|string|max:255',
                'description'      => 'nullable|string',
                'due_date'         => 'required|date|after:now',
                'total_marks'      => 'required|numeric|min:0',
                'attachment_urls'  => 'nullable|array',
                'status'           => 'nullable|in:draft,published,closed',
                'max_attempts'     => 'integer|min:1'
            ]);

            if ($validator->fails()) {
                return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
            }

            $data = $validator->validated();
            
            // Si le statut est "published", on remplit automatiquement la date de publication
            if (($data['status'] ?? '') === 'published') {
                $data['published_at'] = now();
            }

            $assignment = Assignment::create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Devoir créé avec succès !',
                'data' => $assignment
            ], 201);

        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Détails d'un devoir.
     */
    public function show(Assignment $assignment)
    {
        return response()->json([
            'status' => 'success',
            'data' => $assignment->load(['teacher.profile', 'subject', 'section', 'submissions'])
        ]);
    }

    /**
     * Supprimer un devoir.
     */
    public function destroy(Assignment $assignment)
    {
        try {
            // Optionnel : empêcher la suppression si des élèves ont déjà rendu le devoir
            if ($assignment->submissions()->count() > 0) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Impossible de supprimer ce devoir car des copies ont déjà été rendues.'
                ], 403);
            }

            $assignment->delete();
            return response()->json(['status' => 'success', 'message' => 'Devoir supprimé.']);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}