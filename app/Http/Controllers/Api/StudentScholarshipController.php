<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StudentScholarship;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StudentScholarshipController extends Controller
{
    public function index(Request $request)
    {
        $query = StudentScholarship::with(['student.user', 'scholarship', 'academicYear']);
        
        if ($request->has('student_id')) $query->where('student_id', $request->student_id);
        if ($request->has('status')) $query->where('status', $request->status);

        return response()->json(['success' => true, 'data' => $query->get()]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:students,id',
            'scholarship_id' => 'required|exists:scholarships,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'awarded_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        // Vérifier si l'étudiant n'a pas déjà cette bourse cette année
        $exists = StudentScholarship::where($request->only(['student_id', 'scholarship_id', 'academic_year_id']))->exists();
        if ($exists) {
            return response()->json(['success' => false, 'message' => 'Bourse déjà attribuée pour cette année'], 409);
        }

        $scholarship = StudentScholarship::create(array_merge($request->all(), [
            'awarded_by' => auth()->id(), // On assume que l'utilisateur est connecté
            'status' => 'active'
        ]));

        return response()->json(['success' => true, 'data' => $scholarship], 201);
    }

    /**
     * Révoquer une bourse (Logique personnalisée)
     */
    public function revoke(Request $request, $id)
    {
        $scholarship = StudentScholarship::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'revoke_reason' => 'required|string|min:10'
        ]);

        if ($validator->fails()) return response()->json(['success' => false, 'errors' => $validator->errors()], 422);

        $scholarship->update([
            'status' => 'revoked',
            'revoked_at' => now(),
            'revoke_reason' => $request->revoke_reason
        ]);

        return response()->json(['success' => true, 'message' => 'Bourse révoquée']);
    }
}