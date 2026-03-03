<?php

namespace App\Http\Controllers\Api;

use App\Models\StudentParent;
use App\Models\Student;
use App\Models\Guardian; // Importation correcte ici
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class StudentParentController extends Controller
{
    public function index(Request $request)
    {
        $query = StudentParent::with(['student.user', 'parent.user']);
        
        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }
        
        if ($request->has('parent_id')) {
            $query->where('parent_id', $request->parent_id);
        }
        
        return response()->json([
            'success' => true,
            'data' => $query->get()
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:students,id',
            'parent_id'  => 'required|exists:guardians,id', // On vérifie bien dans guardians
            'relationship' => 'required|string|max:50',
            'is_primary_contact' => 'boolean',
            'is_emergency_contact' => 'boolean',
            'can_pickup' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        // Vérifier l'unicité
        $exists = StudentParent::where('student_id', $request->student_id)
            ->where('parent_id', $request->parent_id)
            ->exists();
            
        if ($exists) {
            return response()->json(['success' => false, 'message' => 'Cette relation existe déjà'], 409);
        }

        // --- FIX : Utilisation de Guardian au lieu de ParentModel ---
        $student = Student::find($request->student_id);
        $parent = Guardian::find($request->parent_id);
        
        if ($student->school_id !== $parent->school_id) {
            return response()->json([
                'success' => false,
                'message' => 'L\'étudiant et le parent doivent être dans la même école'
            ], 422);
        }

        DB::beginTransaction();
        try {
            if ($request->is_primary_contact) {
                StudentParent::where('student_id', $request->student_id)
                    ->update(['is_primary_contact' => false]);
            }

            $relation = StudentParent::create($request->all());

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $relation->load(['student.user', 'parent.user'])
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
     * Afficher une relation spécifique
     */
    public function show($id)
    {
        $relation = StudentParent::with(['student.user', 'parent.user'])->find($id);

        if (!$relation) {
            return response()->json([
                'success' => false,
                'message' => 'Relation non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $relation
        ]);
    }

    /**
     * Mettre à jour une relation
     */
    public function update(Request $request, $id)
    {
        $relation = StudentParent::find($id);

        if (!$relation) {
            return response()->json([
                'success' => false,
                'message' => 'Relation non trouvée'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'relationship' => 'sometimes|string|max:50',
            'is_primary_contact' => 'sometimes|boolean',
            'is_emergency_contact' => 'sometimes|boolean',
            'can_pickup' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            if ($request->is_primary_contact) {
                StudentParent::where('student_id', $relation->student_id)
                    ->where('id', '!=', $id)
                    ->update(['is_primary_contact' => false]);
            }

            $relation->update($request->all());

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $relation
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
     * Supprimer une relation
     */
    public function destroy($id)
    {
        $relation = StudentParent::find($id);

        if (!$relation) {
            return response()->json([
                'success' => false,
                'message' => 'Relation non trouvée'
            ], 404);
        }

        $relation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Relation supprimée'
        ]);
    }

    /**
     * Obtenir les parents d'un étudiant
     */
    public function studentParents($studentId)
    {
        $parents = StudentParent::where('student_id', $studentId)
            ->with(['parent.user'])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $parents
        ]);
    }

    /**
     * Obtenir les enfants d'un parent
     */
    public function parentStudents($parentId)
    {
        $students = StudentParent::where('parent_id', $parentId)
            ->with(['student.user', 'student.section'])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $students
        ]);
    }

    /**
     * Obtenir le contact principal d'un étudiant
     */
    public function primaryContact($studentId)
    {
        $contact = StudentParent::where('student_id', $studentId)
            ->where('is_primary_contact', true)
            ->with(['parent.user'])
            ->first();

        if (!$contact) {
            return response()->json([
                'success' => false,
                'message' => 'Aucun contact principal trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $contact
        ]);
    }
}