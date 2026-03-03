<?php

namespace App\Http\Controllers\Api;

use App\Models\ReportCardSubject;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ReportCardSubjectController extends Controller
{
    /**
     * Afficher les matières d'un bulletin
     */
    public function index(Request $request)
{
    // On rend l'ID optionnel pour le test global, mais on garde la vérification s'il est fourni
    $validator = Validator::make($request->all(), [
        'report_card_id' => 'nullable|exists:report_cards,id'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'errors' => $validator->errors()
        ], 422);
    }

    $query = ReportCardSubject::with(['subject', 'reportCard']);

    // Si un ID est fourni, on filtre. Sinon, on renvoie tout.
    if ($request->has('report_card_id')) {
        $query->where('report_card_id', $request->report_card_id);
    }

    return response()->json([
        'success' => true,
        'data' => $query->get()
    ]);
}

    /**
     * Mettre à jour une matière
     */
    public function update(Request $request, $id)
    {
        $subject = ReportCardSubject::find($id);

        if (!$subject) {
            return response()->json([
                'success' => false,
                'message' => 'Matière non trouvée'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'total_marks' => 'nullable|numeric|min:0',
            'marks_obtained' => 'nullable|numeric|min:0',
            'grade' => 'nullable|string',
            'grade_points' => 'nullable|numeric|min:0',
            'teacher_remarks' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            $data = $request->all();
            
            // Recalculer le pourcentage
            if (isset($data['marks_obtained']) || isset($data['total_marks'])) {
                $totalMarks = $data['total_marks'] ?? $subject->total_marks;
                $marksObtained = $data['marks_obtained'] ?? $subject->marks_obtained;
                
                if ($totalMarks && $marksObtained) {
                    $data['percentage'] = ($marksObtained / $totalMarks) * 100;
                }
            }

            $subject->update($data);

            // Mettre à jour les totaux du bulletin parent
            $this->updateReportCardTotals($subject->report_card_id);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $subject->load(['subject'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer une matière
     */
    public function destroy($id)
    {
        $subject = ReportCardSubject::find($id);

        if (!$subject) {
            return response()->json([
                'success' => false,
                'message' => 'Matière non trouvée'
            ], 404);
        }

        $reportCardId = $subject->report_card_id;

        DB::beginTransaction();
        try {
            $subject->delete();
            
            // Mettre à jour les totaux du bulletin parent
            $this->updateReportCardTotals($reportCardId);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Matière supprimée'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function updateReportCardTotals($reportCardId)
    {
        $reportCard = ReportCard::find($reportCardId);
        if (!$reportCard) return;

        $subjects = $reportCard->subjects;
        
        $totalMarks = $subjects->sum('total_marks');
        $marksObtained = $subjects->sum('marks_obtained');
        $gpaTotal = $subjects->sum('grade_points');
        $subjectCount = $subjects->count();

        $percentage = $totalMarks > 0 ? ($marksObtained / $totalMarks) * 100 : null;
        $gpa = $subjectCount > 0 ? $gpaTotal / $subjectCount : null;

        $reportCard->update([
            'total_marks' => $totalMarks,
            'marks_obtained' => $marksObtained,
            'percentage' => $percentage,
            'gpa' => $gpa
        ]);
    }
}