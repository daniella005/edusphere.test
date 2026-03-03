<?php

namespace App\Http\Controllers\Api;

use App\Models\ClassSubject;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\ClassModel;

class ClassSubjectController extends Controller
{
    /**
     * Afficher la liste des associations classe-matière
     */
    public function index(Request $request)
    {
        $query = ClassSubject::with(['schoolClass', 'subject']);
        
        if ($request->has('class_id')) {
            $query->where('class_id', $request->class_id);
        }
        
        if ($request->has('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }
        
        $classSubjects = $query->get();
        
        return response()->json([
            'success' => true,
            'data' => $classSubjects
        ]);
    }

    /**
     * Créer une nouvelle association
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'is_mandatory' => 'boolean',
            'periods_per_week' => 'integer|min:1|max:10'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Vérifier l'unicité
        $exists = ClassSubject::where('class_id', $request->class_id)
            ->where('subject_id', $request->subject_id)
            ->exists();
            
        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Cette matière est déjà associée à cette classe'
            ], 409);
        }

        $classSubject = ClassSubject::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Matière associée à la classe avec succès',
            'data' => $classSubject->load(['schoolClass', 'subject'])
        ], 201);
    }

    /**
     * Afficher une association spécifique
     */
    public function show($id)
    {
        $classSubject = ClassSubject::with(['schoolClass', 'subject'])->find($id);

        if (!$classSubject) {
            return response()->json([
                'success' => false,
                'message' => 'Association non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $classSubject
        ]);
    }

    /**
     * Mettre à jour une association
     */
    public function update(Request $request, $id)
    {
        $classSubject = ClassSubject::find($id);

        if (!$classSubject) {
            return response()->json([
                'success' => false,
                'message' => 'Association non trouvée'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'is_mandatory' => 'sometimes|boolean',
            'periods_per_week' => 'sometimes|integer|min:1|max:10'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $classSubject->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Association mise à jour avec succès',
            'data' => $classSubject->load(['schoolClass', 'subject'])
        ]);
    }

    /**
     * Supprimer une association
     */
    public function destroy($id)
    {
        $classSubject = ClassSubject::find($id);

        if (!$classSubject) {
            return response()->json([
                'success' => false,
                'message' => 'Association non trouvée'
            ], 404);
        }

        $classSubject->delete();

        return response()->json([
            'success' => true,
            'message' => 'Association supprimée avec succès'
        ]);
    }

    /**
     * Associer plusieurs matières à une classe en une seule fois
     */
    public function bulkAssign(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'class_id' => 'required|exists:classes,id',
            'subjects' => 'required|array|min:1',
            'subjects.*.subject_id' => 'required|exists:subjects,id',
            'subjects.*.is_mandatory' => 'boolean',
            'subjects.*.periods_per_week' => 'integer|min:1|max:10'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $assigned = [];
        $errors = [];

        DB::transaction(function () use ($request, &$assigned, &$errors) {
            foreach ($request->subjects as $subjectData) {
                $exists = ClassSubject::where('class_id', $request->class_id)
                    ->where('subject_id', $subjectData['subject_id'])
                    ->exists();
                    
                if (!$exists) {
                    $classSubject = ClassSubject::create([
                        'class_id' => $request->class_id,
                        'subject_id' => $subjectData['subject_id'],
                        'is_mandatory' => $subjectData['is_mandatory'] ?? true,
                        'periods_per_week' => $subjectData['periods_per_week'] ?? 4
                    ]);
                    $assigned[] = $classSubject;
                } else {
                    $errors[] = "La matière {$subjectData['subject_id']} est déjà associée";
                }
            }
        });

        return response()->json([
            'success' => true,
            'message' => count($assigned) . ' matière(s) associée(s) avec succès',
            'data' => [
                'assigned' => $assigned,
                'errors' => $errors
            ]
        ]);
    }
}