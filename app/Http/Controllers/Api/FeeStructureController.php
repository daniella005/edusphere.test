<?php

namespace App\Http\Controllers\Api;

use App\Models\FeeStructure;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class FeeStructureController extends Controller
{
    public function index(Request $request)
    {
        $query = FeeStructure::with(['school', 'academicYear', 'class', 'category']);
        
        if ($request->has('school_id')) {
            $query->where('school_id', $request->school_id);
        }
        
        if ($request->has('academic_year_id')) {
            $query->where('academic_year_id', $request->academic_year_id);
        }
        
        if ($request->has('class_id')) {
            $query->where('class_id', $request->class_id);
        }
        
        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }
        
        $structures = $query->get();
        
        return response()->json([
            'success' => true,
            'data' => $structures
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'school_id' => 'required|exists:schools,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'class_id' => 'required|exists:classes,id',
            'fee_category_id' => 'required|exists:fee_categories,id',
            'amount' => 'required|numeric|min:0',
            'frequency' => 'required|string',
            'due_day' => 'nullable|integer|min:1|max:31',
            'late_fee' => 'nullable|numeric|min:0',
            'late_fee_frequency' => 'nullable|string',
            'discount_available' => 'boolean',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $exists = FeeStructure::where('school_id', $request->school_id)
            ->where('academic_year_id', $request->academic_year_id)
            ->where('class_id', $request->class_id)
            ->where('fee_category_id', $request->fee_category_id)
            ->exists();
            
        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Cette structure de frais existe déjà'
            ], 409);
        }

        $structure = FeeStructure::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $structure->load(['class', 'category'])
        ], 201);
    }

    public function show($id)
    {
        $structure = FeeStructure::with(['school', 'academicYear', 'class', 'category', 'invoiceItems'])
            ->find($id);
        
        if (!$structure) {
            return response()->json([
                'success' => false,
                'message' => 'Structure non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $structure
        ]);
    }

    public function update(Request $request, $id)
    {
        $structure = FeeStructure::find($id);
        
        if (!$structure) {
            return response()->json([
                'success' => false,
                'message' => 'Structure non trouvée'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'amount' => 'sometimes|numeric|min:0',
            'due_day' => 'nullable|integer|min:1|max:31',
            'late_fee' => 'nullable|numeric|min:0',
            'late_fee_frequency' => 'nullable|string',
            'discount_available' => 'sometimes|boolean',
            'is_active' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $structure->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $structure
        ]);
    }

    public function destroy($id)
    {
        $structure = FeeStructure::find($id);
        
        if (!$structure) {
            return response()->json([
                'success' => false,
                'message' => 'Structure non trouvée'
            ], 404);
        }

        if ($structure->invoiceItems()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer : des factures sont associées'
            ], 409);
        }

        $structure->delete();

        return response()->json([
            'success' => true,
            'message' => 'Structure supprimée'
        ]);
    }

    public function forClass($classId)
    {
        $structures = FeeStructure::where('class_id', $classId)
            ->where('is_active', true)
            ->with(['category', 'academicYear'])
            ->get();
            
        return response()->json([
            'success' => true,
            'data' => $structures
        ]);
    }
}