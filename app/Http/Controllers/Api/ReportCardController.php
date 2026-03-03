<?php

namespace App\Http\Controllers\Api;

use App\Models\ReportCard;
use App\Models\ReportCardSubject;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ReportCardController extends Controller
{
    /**
     * Afficher les bulletins
     */
    public function index(Request $request)
    {
        $query = ReportCard::with(['student.user', 'student.section', 'academicTerm']);
        
        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }
        
        if ($request->has('academic_term_id')) {
            $query->where('academic_term_id', $request->academic_term_id);
        }
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        $reportCards = $query->orderBy('created_at', 'desc')->paginate(15);
        
        return response()->json([
            'success' => true,
            'data' => $reportCards
        ]);
    }

    /**
     * Créer un bulletin
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:students,id',
            'academic_term_id' => 'required|exists:academic_terms,id',
            'subjects' => 'required|array',
            'subjects.*.subject_id' => 'required|exists:subjects,id',
            'subjects.*.total_marks' => 'nullable|numeric|min:0',
            'subjects.*.marks_obtained' => 'nullable|numeric|min:0',
            'subjects.*.grade' => 'nullable|string',
            'subjects.*.grade_points' => 'nullable|numeric|min:0',
            'subjects.*.teacher_remarks' => 'nullable|string',
            'attendance_percentage' => 'nullable|numeric|min:0|max:100',
            'teacher_remarks' => 'nullable|string',
            'principal_remarks' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Vérifier si un bulletin existe déjà pour cet étudiant ce trimestre
        $exists = ReportCard::where('student_id', $request->student_id)
            ->where('academic_term_id', $request->academic_term_id)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Un bulletin existe déjà pour cet étudiant pour ce trimestre'
            ], 409);
        }

        DB::beginTransaction();
        try {
            // Calculer les totaux
            $totalMarks = 0;
            $marksObtained = 0;
            $gpaTotal = 0;
            $subjectCount = count($request->subjects);

            foreach ($request->subjects as $subject) {
                if (isset($subject['total_marks'])) {
                    $totalMarks += $subject['total_marks'];
                }
                if (isset($subject['marks_obtained'])) {
                    $marksObtained += $subject['marks_obtained'];
                }
                if (isset($subject['grade_points'])) {
                    $gpaTotal += $subject['grade_points'];
                }
            }

            $percentage = $totalMarks > 0 ? ($marksObtained / $totalMarks) * 100 : null;
            $gpa = $subjectCount > 0 ? $gpaTotal / $subjectCount : null;

            // Créer le bulletin
            $reportCard = ReportCard::create([
                'student_id' => $request->student_id,
                'academic_term_id' => $request->academic_term_id,
                'total_marks' => $totalMarks,
                'marks_obtained' => $marksObtained,
                'percentage' => $percentage,
                'gpa' => $gpa,
                'attendance_percentage' => $request->attendance_percentage,
                'teacher_remarks' => $request->teacher_remarks,
                'principal_remarks' => $request->principal_remarks,
                'status' => 'draft'
            ]);

            // Créer les lignes de matières
            foreach ($request->subjects as $subject) {
                ReportCardSubject::create([
                    'report_card_id' => $reportCard->id,
                    'subject_id' => $subject['subject_id'],
                    'total_marks' => $subject['total_marks'] ?? null,
                    'marks_obtained' => $subject['marks_obtained'] ?? null,
                    'percentage' => isset($subject['marks_obtained']) && isset($subject['total_marks']) 
                        ? ($subject['marks_obtained'] / $subject['total_marks']) * 100 
                        : null,
                    'grade' => $subject['grade'] ?? null,
                    'grade_points' => $subject['grade_points'] ?? null,
                    'teacher_remarks' => $subject['teacher_remarks'] ?? null
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $reportCard->load(['student.user', 'academicTerm', 'subjects.subject'])
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
     * Afficher un bulletin
     */
    public function show($id)
    {
        $reportCard = ReportCard::with(['student.user', 'student.section', 'academicTerm', 'subjects.subject'])
            ->find($id);

        if (!$reportCard) {
            return response()->json([
                'success' => false,
                'message' => 'Bulletin non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $reportCard
        ]);
    }

    /**
     * Publier un bulletin
     */
    public function publish($id)
    {
        $reportCard = ReportCard::find($id);

        if (!$reportCard) {
            return response()->json([
                'success' => false,
                'message' => 'Bulletin non trouvé'
            ], 404);
        }

        if ($reportCard->status === 'published') {
            return response()->json([
                'success' => false,
                'message' => 'Bulletin déjà publié'
            ], 409);
        }

        $reportCard->update([
            'status' => 'published',
            'published_at' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Bulletin publié',
            'data' => $reportCard
        ]);
    }

    /**
     * Obtenir les bulletins d'un étudiant
     */
    public function studentReportCards($studentId)
    {
        $reportCards = ReportCard::where('student_id', $studentId)
            ->with(['academicTerm', 'subjects.subject'])
            ->orderBy('academic_term_id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $reportCards
        ]);
    }

    /**
     * Obtenir les statistiques des bulletins
     */
    public function stats(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'academic_term_id' => 'required|exists:academic_terms,id',
            'class_id' => 'required|exists:classes,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $students = \App\Models\Student::whereHas('section', function ($q) use ($request) {
            $q->where('class_id', $request->class_id);
        })->get();

        $reportCards = ReportCard::where('academic_term_id', $request->academic_term_id)
            ->whereIn('student_id', $students->pluck('id'))
            ->get();

        $stats = [
            'total_students' => $students->count(),
            'with_report' => $reportCards->count(),
            'published' => $reportCards->where('status', 'published')->count(),
            'average_gpa' => $reportCards->whereNotNull('gpa')->avg('gpa'),
            'average_percentage' => $reportCards->whereNotNull('percentage')->avg('percentage'),
            'top_students' => $reportCards->sortByDesc('percentage')->take(5)->values(),
            'distribution' => [
                'A' => $reportCards->where('percentage', '>=', 80)->count(),
                'B' => $reportCards->where('percentage', '>=', 60)->where('percentage', '<', 80)->count(),
                'C' => $reportCards->where('percentage', '>=', 40)->where('percentage', '<', 60)->count(),
                'D' => $reportCards->where('percentage', '<', 40)->count(),
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    public function calculateRanks(Request $request)
{
    $request->validate([
        'academic_term_id' => 'required|exists:academic_terms,id',
        'section_id' => 'required|exists:sections,id'
    ]);

    // Récupérer tous les bulletins de la section pour ce trimestre, triés par pourcentage
    $reportCards = ReportCard::where('academic_term_id', $request->academic_term_id)
        ->whereHas('student', function($q) use ($request) {
            $q->where('section_id', $request->section_id);
        })
        ->orderByDesc('percentage')
        ->get();

    foreach ($reportCards as $index => $reportCard) {
        $reportCard->update([
            'rank_in_section' => $index + 1
            // Tu peux appliquer la même logique pour rank_in_class
        ]);
    }

    return response()->json(['success' => true, 'message' => 'Rangs mis à jour']);
}
}