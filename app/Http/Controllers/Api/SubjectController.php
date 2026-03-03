<?php

namespace App\Http\Controllers\Api;

use App\Models\Subject;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class SubjectController extends Controller
{
    /**
     * Liste des matières
     */
    public function index(Request $request)
    {
        $query = Subject::with(['school', 'department']);

        if ($request->has('school_id')) {
            $query->where('school_id', $request->school_id);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        return response()->json([
            'success' => true,
            'data' => $query->get()
        ]);
    }

    /**
     * Créer une matière
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'school_id' => 'required|exists:schools,id',
            'code' => 'required|string|max:50',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'department_id' => 'nullable|exists:departments,id',
            'subject_type' => 'nullable|string',
            'credits' => 'integer|min:1',
            'passing_marks' => 'numeric|min:0',
            'max_marks' => 'numeric|min:0',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        // Vérification de l'unicité combinée (school_id + code) comme dans ta migration
        $exists = Subject::where('school_id', $request->school_id)
                         ->where('code', $request->code)
                         ->exists();

        if ($exists) {
            return response()->json([
                'success' => false, 
                'message' => 'Le code de cette matière existe déjà pour cette école.'
            ], 409);
        }

        $subject = Subject::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $subject
        ], 201);
    }

    /**
     * Afficher une matière spécifique
     */
    public function show($id)
    {
        $subject = Subject::with(['school', 'department'])->find($id);

        if (!$subject) {
            return response()->json(['success' => false, 'message' => 'Matière non trouvée'], 404);
        }

        return response()->json(['success' => true, 'data' => $subject]);
    }

    /**
     * Mettre à jour une matière
     */
    public function update(Request $request, $id)
    {
        $subject = Subject::find($id);

        if (!$subject) {
            return response()->json(['success' => false, 'message' => 'Matière non trouvée'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $subject->update($request->all());

        return response()->json(['success' => true, 'data' => $subject]);
    }
}