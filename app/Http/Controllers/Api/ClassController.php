<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassModel;
use Illuminate\Http\Request;

class ClassController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
        'status' => 'success',
        'message' => 'Le controleur ClassController est bien atteint !'
        ]);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(\Illuminate\Http\Request $request)
    {
        try {
            // 1. Validation simple
            $validated = $request->validate([
                'school_id' => 'required',
                'academic_year_id' => 'required',
                'name' => 'required|string',
                'code' => 'required|string',
                'level' => 'required|integer',
                'is_active' => 'boolean'
            ]);

            // 2. Création avec le modèle ClassModel
            $newClass = \App\Models\ClassModel::create($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Classe créée avec succès !',
                'data' => $newClass
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la création',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * Display the specified resource.
     */
    public function show(ClassModel $classModel)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ClassModel $classModel)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ClassModel $classModel)
    {
        //
    }
}
