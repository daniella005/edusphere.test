<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;

class StudentController extends Controller
{
    public function index()
    {
        try {
            $students = Student::with(['profile', 'school', 'section'])->get();
            return response()->json([
                'status' => 'success',
                'data' => $students
            ], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_id'          => 'required|exists:profiles,id|unique:students,user_id',
                'school_id'        => 'required|exists:schools,id',
                'section_id'       => 'required|exists:sections,id',
                'admission_number' => 'required|string|unique:students,admission_number',
                'admission_date'   => 'required|date',
                'roll_number'      => 'nullable|string',
                'status'           => 'nullable|string|in:active,inactive,withdrawn',
                'nationality'      => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $student = Student::create($validator->validated());

            return response()->json([
                'status' => 'success',
                'message' => 'Étudiant inscrit avec succès !',
                'data' => $student
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de l\'inscription',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Student $student)
    {
        return response()->json([
            'status' => 'success',
            'data' => $student->load(['profile', 'school', 'section'])
        ]);
    }

    public function update(Request $request, $id)
{
    try {
        $student = Student::findOrFail($id);
        // On valide uniquement ce qu'on reçoit
        $student->update($request->only([
            'admission_number', 'roll_number', 'section_id', 
            'status', 'medical_conditions', 'blood_group'
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Fiche étudiant mise à jour',
            'data' => $student
        ]);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => 'Étudiant non trouvé'], 404);
    }
}
}