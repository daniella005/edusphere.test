<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;

class SectionController extends Controller
{
    public function index()
    {
        try {
            $sections = Section::with('class')->get();
            return response()->json([
                'status' => 'success',
                'data' => $sections
            ], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'class_id' => 'required|exists:classes,id',
                'name' => 'required|string|max:255',
                'capacity' => 'required|integer',
                'is_active' => 'boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Création de la section
            $section = Section::create($validator->validated());

            return response()->json([
                'status' => 'success',
                'message' => 'Section créée avec succès !',
                'data' => $section
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la création',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}