<?php

namespace App\Http\Controllers\Api;

use App\Models\ExamCategory;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class ExamCategoryController extends Controller
{
    /**
     * Afficher la liste des catégories d'examens
     */
    public function index(Request $request)
    {
        $query = ExamCategory::with(['school']);
        
        if ($request->has('school_id')) {
            $query->where('school_id', $request->school_id);
        }
        
        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }
        
        $categories = $query->get();
        
        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /**
     * Créer une catégorie d'examen
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'school_id' => 'required|exists:schools,id',
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'weightage' => 'nullable|numeric|min:0|max:100',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $exists = ExamCategory::where('school_id', $request->school_id)
            ->where('name', $request->name)
            ->exists();
            
        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Une catégorie avec ce nom existe déjà'
            ], 409);
        }

        $category = ExamCategory::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $category
        ], 201);
    }

    public function show($id)
    {
        $category = ExamCategory::with(['school', 'exams'])->find($id);
        
        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Catégorie non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $category
        ]);
    }

    public function update(Request $request, $id)
    {
        $category = ExamCategory::find($id);
        
        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Catégorie non trouvée'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'weightage' => 'nullable|numeric|min:0|max:100',
            'is_active' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        if ($request->has('name') && $request->name != $category->name) {
            $exists = ExamCategory::where('school_id', $category->school_id)
                ->where('name', $request->name)
                ->where('id', '!=', $id)
                ->exists();
                
            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'Une catégorie avec ce nom existe déjà'
                ], 409);
            }
        }

        $category->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $category
        ]);
    }

    public function destroy($id)
    {
        $category = ExamCategory::find($id);
        
        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Catégorie non trouvée'
            ], 404);
        }

        if ($category->exams()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer : des examens sont associés'
            ], 409);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Catégorie supprimée'
        ]);
    }
}