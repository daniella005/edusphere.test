<?php

namespace App\Http\Controllers\Api;

use App\Models\TeacherSubject;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class TeacherSubjectController extends Controller
{
    /**
     * Afficher les associations enseignant-matière
     */
    public function index(Request $request)
    {
        $query = TeacherSubject::with(['teacher.user', 'subject']);
        
        if ($request->has('teacher_id')) {
            $query->where('teacher_id', $request->teacher_id);
        }
        
        if ($request->has('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }
        
        if ($request->has('is_primary')) {
            $query->where('is_primary', $request->is_primary);
        }
        
        $associations = $query->get();
        
        return response()->json([
            'success' => true,
            'data' => $associations
        ]);
    }

    /**
     * Créer une association
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'teacher_id' => 'required|exists:teachers,id',
            'subject_id' => 'required|exists:subjects,id',
            'is_primary' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Vérifier l'unicité
        $exists = TeacherSubject::where('teacher_id', $request->teacher_id)
            ->where('subject_id', $request->subject_id)
            ->exists();
            
        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Cette matière est déjà associée à cet enseignant'
            ], 409);
        }

        DB::beginTransaction();
        try {
            // Si c'est une matière principale, enlever le statut principal des autres
            if ($request->is_primary) {
                TeacherSubject::where('teacher_id', $request->teacher_id)
                    ->update(['is_primary' => false]);
            }

            $association = TeacherSubject::create($request->all());

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $association->load(['teacher.user', 'subject'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher une association spécifique
     */
    public function show($id)
    {
        $association = TeacherSubject::with(['teacher.user', 'subject'])->find($id);

        if (!$association) {
            return response()->json([
                'success' => false,
                'message' => 'Association non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $association
        ]);
    }

    /**
     * Mettre à jour une association
     */
    public function update(Request $request, $id)
    {
        $association = TeacherSubject::find($id);

        if (!$association) {
            return response()->json([
                'success' => false,
                'message' => 'Association non trouvée'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'is_primary' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            if ($request->is_primary) {
                TeacherSubject::where('teacher_id', $association->teacher_id)
                    ->update(['is_primary' => false]);
            }

            $association->update($request->all());

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $association
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer une association
     */
    public function destroy($id)
    {
        $association = TeacherSubject::find($id);

        if (!$association) {
            return response()->json([
                'success' => false,
                'message' => 'Association non trouvée'
            ], 404);
        }

        $association->delete();

        return response()->json([
            'success' => true,
            'message' => 'Association supprimée'
        ]);
    }

    /**
     * Associer plusieurs matières à un enseignant
     */
    public function bulkAssign(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'teacher_id' => 'required|exists:teachers,id',
            'subjects' => 'required|array',
            'subjects.*.subject_id' => 'required|exists:subjects,id',
            'subjects.*.is_primary' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            $assigned = [];
            $errors = [];

            foreach ($request->subjects as $subjectData) {
                $exists = TeacherSubject::where('teacher_id', $request->teacher_id)
                    ->where('subject_id', $subjectData['subject_id'])
                    ->exists();

                if (!$exists) {
                    $assigned[] = TeacherSubject::create([
                        'teacher_id' => $request->teacher_id,
                        'subject_id' => $subjectData['subject_id'],
                        'is_primary' => $subjectData['is_primary'] ?? false
                    ]);
                } else {
                    $errors[] = "La matière {$subjectData['subject_id']} est déjà associée";
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => count($assigned) . ' matière(s) associée(s)',
                'data' => [
                    'assigned' => $assigned,
                    'errors' => $errors
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}