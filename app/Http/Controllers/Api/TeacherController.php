<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;

class TeacherController extends Controller
{
    /**
     * Liste tous les enseignants avec leurs relations.
     */
    public function index()
    {
        try {
            // On charge les relations pour avoir les noms (User, School, Dept)
            $teachers = Teacher::with(['user', 'school', 'department'])->get();
            return response()->json([
                'status' => 'success',
                'data' => $teachers
            ], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Enregistre un nouvel enseignant.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_id'       => 'required|exists:users,id|unique:teachers,user_id',
                'school_id'     => 'required|exists:schools,id',
                'department_id' => 'required|exists:departments,id',
                'employee_id'   => 'required|string|unique:teachers,employee_id',
                'qualification' => 'nullable|string',
                'specialization'=> 'nullable|string',
                'experience_years' => 'nullable|integer',
                'joining_date'  => 'nullable|date',
                'status'        => 'required|string|in:active,inactive,on_leave',
                'salary'        => 'nullable|numeric',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $teacher = Teacher::create($validator->validated());

            return response()->json([
                'status' => 'success',
                'message' => 'Enseignant enregistré avec succès !',
                'data' => $teacher
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la création',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Affiche un enseignant précis.
     */
    public function show(Teacher $teacher)
    {
        return response()->json([
            'status' => 'success',
            'data' => $teacher->load(['user', 'school', 'department', 'profile'])
        ]);
    }

public function update(Request $request, $id)
{
    try {
        $teacher = Teacher::findOrFail($id);
        $teacher->update($request->only([
            'specialization', 'experience_years', 'department_id', 
            'status', 'is_class_teacher'
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Fiche enseignant mise à jour',
            'data' => $teacher
        ]);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => 'Enseignant non trouvé'], 404);
    }
}
}