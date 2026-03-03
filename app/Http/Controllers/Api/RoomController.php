<?php

namespace App\Http\Controllers\Api;

use App\Models\Room;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $query = Room::with(['school']);
        
        if ($request->has('school_id')) {
            $query->where('school_id', $request->school_id);
        }
        
        if ($request->has('room_type')) {
            $query->where('room_type', $request->room_type);
        }
        
        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }
        
        $rooms = $query->get();
        
        return response()->json([
            'success' => true,
            'data' => $rooms
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'school_id' => 'required|exists:schools,id',
            'name' => 'required|string|max:100',
            'code' => 'required|string|max:20',
            'building' => 'nullable|string|max:100',
            'floor' => 'nullable|integer|min:-5|max:50',
            'capacity' => 'nullable|integer|min:1|max:500',
            'room_type' => 'nullable|string',
            'facilities' => 'nullable|array',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $exists = Room::where('school_id', $request->school_id)
            ->where('code', $request->code)
            ->exists();
            
        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Une salle avec ce code existe déjà'
            ], 409);
        }

        $room = Room::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $room
        ], 201);
    }

    public function show($id)
    {
        $room = Room::with(['school', 'examSchedules'])->find($id);
        
        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Salle non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $room
        ]);
    }

    public function update(Request $request, $id)
    {
        $room = Room::find($id);
        
        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Salle non trouvée'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:100',
            'building' => 'nullable|string|max:100',
            'floor' => 'nullable|integer|min:-5|max:50',
            'capacity' => 'nullable|integer|min:1|max:500',
            'room_type' => 'nullable|string',
            'facilities' => 'nullable|array',
            'is_active' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $room->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $room
        ]);
    }

    public function destroy($id)
    {
        $room = Room::find($id);
        
        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Salle non trouvée'
            ], 404);
        }

        if ($room->examSchedules()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer : des examens sont planifiés dans cette salle'
            ], 409);
        }

        $room->delete();

        return response()->json([
            'success' => true,
            'message' => 'Salle supprimée'
        ]);
    }

    public function available(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'school_id' => 'required|exists:schools,id',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i:s',
            'end_time' => 'required|date_format:H:i:s|after:start_time'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Récupérer toutes les salles actives
        $rooms = Room::where('school_id', $request->school_id)
            ->where('is_active', true)
            ->get();

        // Filtrer celles qui sont disponibles
        $available = $rooms->filter(function ($room) use ($request) {
            return $room->isAvailable($request->date, $request->start_time, $request->end_time);
        })->values();

        return response()->json([
            'success' => true,
            'data' => $available
        ]);
    }
}