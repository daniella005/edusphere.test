<?php

namespace App\Http\Controllers\Api;

use App\Models\FeeCategory;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class FeeCategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = FeeCategory::with(['school']);
        
        if ($request->has('school_id')) {
            $query->where('school_id', $request->school_id);
        }
        
        $categories = $query->get();
        
        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'school_id' => 'required|exists:schools,id',
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'is_mandatory' => 'boolean',
            'is_refundable' => 'boolean',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $exists = FeeCategory::where('school_id', $request->school_id)
            ->where('name', $request->name)
            ->exists();
            
        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Une catégorie avec ce nom existe déjà'
            ], 409);
        }

        $category = FeeCategory::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $category
        ], 201);
    }

    public function show($id)
    {
        $category = FeeCategory::with(['school', 'feeStructures'])->find($id);
        
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
        $category = FeeCategory::find($id);
        
        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Catégorie non trouvée'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'is_mandatory' => 'sometimes|boolean',
            'is_refundable' => 'sometimes|boolean',
            'is_active' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $category->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $category
        ]);
    }

    public function destroy($id)
    {
        $category = FeeCategory::find($id);
        
        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Catégorie non trouvée'
            ], 404);
        }

        if ($category->feeStructures()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer : des structures de frais sont associées'
            ], 409);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Catégorie supprimée'
        ]);
    }
}