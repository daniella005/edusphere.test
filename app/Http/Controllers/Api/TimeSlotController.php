<?php

namespace App\Http\Controllers\Api;

use App\Models\TimeSlot;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class TimeSlotController extends Controller
{
    /**
     * Afficher les créneaux horaires
     */
    public function index(Request $request)
    {
        $query = TimeSlot::with(['school']);
        
        if ($request->has('school_id')) {
            $query->where('school_id', $request->school_id);
        }
        
        if ($request->has('slot_type')) {
            $query->where('slot_type', $request->slot_type);
        }
        
        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }
        
        $slots = $query->orderBy('sequence_order')->get();
        
        return response()->json([
            'success' => true,
            'data' => $slots
        ]);
    }

    /**
     * Créer un créneau
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'school_id' => 'required|exists:schools,id',
            'name' => 'required|string|max:50',
            'start_time' => 'required|date_format:H:i:s',
            'end_time' => 'required|date_format:H:i:s|after:start_time',
            'slot_type' => 'required|string',
            'sequence_order' => 'required|integer|min:1',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Vérifier les chevauchements
        $overlap = TimeSlot::where('school_id', $request->school_id)
            ->where(function ($q) use ($request) {
                $q->whereBetween('start_time', [$request->start_time, $request->end_time])
                  ->orWhereBetween('end_time', [$request->start_time, $request->end_time])
                  ->orWhere(function ($q2) use ($request) {
                      $q2->where('start_time', '<=', $request->start_time)
                         ->where('end_time', '>=', $request->end_time);
                  });
            })
            ->exists();

        if ($overlap) {
            return response()->json([
                'success' => false,
                'message' => 'Ce créneau chevauche un créneau existant'
            ], 409);
        }

        $slot = TimeSlot::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $slot
        ], 201);
    }

    /**
     * Afficher un créneau
     */
    public function show($id)
    {
        $slot = TimeSlot::with(['school', 'timetableEntries'])->find($id);

        if (!$slot) {
            return response()->json([
                'success' => false,
                'message' => 'Créneau non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $slot
        ]);
    }

    /**
     * Mettre à jour un créneau
     */
    public function update(Request $request, $id)
    {
        $slot = TimeSlot::find($id);

        if (!$slot) {
            return response()->json([
                'success' => false,
                'message' => 'Créneau non trouvé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:50',
            'start_time' => 'sometimes|date_format:H:i:s',
            'end_time' => 'sometimes|date_format:H:i:s|after:start_time',
            'slot_type' => 'sometimes|string',
            'sequence_order' => 'sometimes|integer|min:1',
            'is_active' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Vérifier les chevauchements si les heures changent
        if ($request->has('start_time') || $request->has('end_time')) {
            $start = $request->start_time ?? $slot->start_time;
            $end = $request->end_time ?? $slot->end_time;

            $overlap = TimeSlot::where('school_id', $slot->school_id)
                ->where('id', '!=', $id)
                ->where(function ($q) use ($start, $end) {
                    $q->whereBetween('start_time', [$start, $end])
                      ->orWhereBetween('end_time', [$start, $end])
                      ->orWhere(function ($q2) use ($start, $end) {
                          $q2->where('start_time', '<=', $start)
                             ->where('end_time', '>=', $end);
                      });
                })
                ->exists();

            if ($overlap) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce créneau chevauche un créneau existant'
                ], 409);
            }
        }

        $slot->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $slot
        ]);
    }

    /**
     * Supprimer un créneau
     */
    public function destroy($id)
    {
        $slot = TimeSlot::find($id);

        if (!$slot) {
            return response()->json([
                'success' => false,
                'message' => 'Créneau non trouvé'
            ], 404);
        }

        if ($slot->timetableEntries()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer : des entrées d\'emploi du temps existent'
            ], 409);
        }

        $slot->delete();

        return response()->json([
            'success' => true,
            'message' => 'Créneau supprimé'
        ]);
    }

    /**
     * Réorganiser les créneaux
     */
    public function reorder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'school_id' => 'required|exists:schools,id',
            'slots' => 'required|array',
            'slots.*.id' => 'required|exists:time_slots,id',
            'slots.*.sequence_order' => 'required|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        foreach ($request->slots as $slotData) {
            TimeSlot::where('id', $slotData['id'])
                ->where('school_id', $request->school_id)
                ->update(['sequence_order' => $slotData['sequence_order']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Ordre mis à jour'
        ]);
    }

    /**
     * Obtenir les créneaux par type
     */
    public function byType($schoolId, $type)
    {
        $slots = TimeSlot::where('school_id', $schoolId)
            ->where('slot_type', $type)
            ->where('is_active', true)
            ->orderBy('sequence_order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $slots
        ]);
    }

    /**
     * Obtenir l'emploi du temps pour un jour spécifique
     */
    public function forDay(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'school_id' => 'required|exists:schools,id',
            'day' => 'required|string|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $slots = TimeSlot::where('school_id', $request->school_id)
            ->where('is_active', true)
            ->orderBy('sequence_order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $slots
        ]);
    }
}