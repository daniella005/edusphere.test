<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SubjectAttendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubjectAttendanceController extends Controller
{
    /**
     * Liste des présences (C'est cette méthode qui manquait !)
     */
    public function index(Request $request)
    {
        $query = SubjectAttendance::with(['student', 'timetableEntry', 'markedBy']);

        // Filtres optionnels pour ne pas charger 10 000 lignes d'un coup
        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }
        
        if ($request->has('date')) {
            $query->where('date', $request->date);
        }

        return response()->json([
            'success' => true,
            'data' => $query->get()
        ]);
    }

    /**
     * Marquer la présence (Ta méthode store existante)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'timetable_entry_id' => 'required|exists:timetable_entries,id',
            'date'               => 'required|date',
            'students'           => 'required|array',
            'students.*.student_id' => 'required|exists:students,id',
            'students.*.status'     => 'required|in:present,absent,late,excused',
        ]);

        if ($validator->fails()) return response()->json($validator->errors(), 422);

        // Note: Dans un système réel, on utiliserait auth()->id()
        $markedBy = "019c9580-b506-739d-8e7b-ada19436459e";
        $results = [];

        foreach ($request->students as $studentData) {
            $results[] = SubjectAttendance::updateOrCreate(
                [
                    'student_id'         => $studentData['student_id'],
                    'timetable_entry_id' => $request->timetable_entry_id,
                    'date'               => $request->date,
                ],
                [
                    'status'    => $studentData['status'],
                    'remarks'   => $studentData['remarks'] ?? null,
                    'marked_by' => $markedBy,
                ]
            );
        }

        return response()->json([
            'success' => true,
            'message' => count($results) . ' présences enregistrées pour ce cours.',
        ]);
    }
}