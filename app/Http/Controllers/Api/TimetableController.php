<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TimetableEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TimetableController extends Controller
{
    public function index(Request $request)
    {
        $query = TimetableEntry::with(['section', 'timeSlot', 'subject', 'teacher', 'term']);

        // Filtres essentiels
        if ($request->has('section_id')) $query->where('section_id', $request->section_id);
        if ($request->has('teacher_id')) $query->where('teacher_id', $request->teacher_id);
        if ($request->has('day_of_week')) $query->where('day_of_week', $request->day_of_week);
        if ($request->has('academic_term_id')) $query->where('academic_term_id', $request->academic_term_id);

        $entries = $query->get()->groupBy('day_of_week');

        return response()->json([
            'success' => true,
            'data' => $entries
        ]);
    }

    public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'section_id' => 'required|exists:sections,id',
        'time_slot_id' => 'required|exists:time_slots,id',
        'day_of_week' => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
        'subject_id' => 'nullable|exists:subjects,id',
        'teacher_id' => 'nullable|exists:teachers,id',
        'academic_term_id' => 'required|exists:academic_terms,id',
        'room_number' => 'nullable|string',
    ]);

    if ($validator->fails()) {
        return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
    }

    $day = strtolower($request->day_of_week);

    // 1. Vérification de conflit pour la CLASSE (Section)
    $classConflict = TimetableEntry::where('section_id', $request->section_id)
        ->where('day_of_week', $day)
        ->where('time_slot_id', $request->time_slot_id)
        ->where('academic_term_id', $request->academic_term_id)
        ->exists();

    if ($classConflict) {
        return response()->json([
            'success' => false, 
            'message' => 'Cette classe a déjà un cours prévu sur ce créneau.'
        ], 409);
    }

    // 2. Vérification de conflit pour l'ENSEIGNANT
    if ($request->teacher_id) {
        $teacherConflict = TimetableEntry::where('teacher_id', $request->teacher_id)
            ->where('day_of_week', $day)
            ->where('time_slot_id', $request->time_slot_id)
            ->where('academic_term_id', $request->academic_term_id)
            ->exists();

        if ($teacherConflict) {
            return response()->json([
                'success' => false, 
                'message' => 'Cet enseignant est déjà occupé ailleurs sur ce créneau.'
            ], 409);
        }
    }

    // 3. Création
    $data = $request->all();
    $data['day_of_week'] = $day; // On s'assure que c'est en minuscule

    $entry = TimetableEntry::create($data);
    
    return response()->json([
        'success' => true, 
        'message' => 'Cours ajouté avec succès',
        'data' => $entry->load(['timeSlot', 'subject', 'teacher'])
    ], 201);
}

    /**
     * Récupérer l'emploi du temps complet d'une section (classe)
     */
    public function forSection($sectionId)
    {
        $timetable = TimetableEntry::with(['timeSlot', 'subject', 'teacher'])
            ->where('section_id', $sectionId)
            ->where('is_active', true)
            ->get()
            ->groupBy('day_of_week');

        return response()->json([
            'success' => true,
            'data' => $timetable
        ]);
    }

    public function destroy($id)
    {
        $entry = TimetableEntry::find($id);
        if (!$entry) return response()->json(['success' => false, 'message' => 'Entrée non trouvée'], 404);
        
        $entry->delete();
        return response()->json(['success' => true, 'message' => 'Cours retiré de l\'emploi du temps']);
    }
}