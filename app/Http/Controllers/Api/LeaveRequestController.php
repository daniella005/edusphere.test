<?php

namespace App\Http\Controllers\Api;

use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class LeaveRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = LeaveRequest::with(['user', 'school', 'approvedBy']);
        
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        
        if ($request->has('school_id')) {
            $query->where('school_id', $request->school_id);
        }
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('leave_type')) {
            $query->where('leave_type', $request->leave_type);
        }
        
        $requests = $query->orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $requests
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:profiles,id',
            'school_id' => 'required|exists:schools,id',
            'leave_type' => 'required|string',
            'start_date' => 'required|date|after:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Vérifier les chevauchements
        $overlap = LeaveRequest::where('user_id', $request->user_id)
            ->where('status', '!=', 'rejected')
            ->where(function ($q) use ($request) {
                $q->whereBetween('start_date', [$request->start_date, $request->end_date])
                  ->orWhereBetween('end_date', [$request->start_date, $request->end_date])
                  ->orWhere(function ($q2) use ($request) {
                      $q2->where('start_date', '<=', $request->start_date)
                         ->where('end_date', '>=', $request->end_date);
                  });
            })
            ->exists();
            
        if ($overlap) {
            return response()->json([
                'success' => false,
                'message' => 'Une demande de congé existe déjà pour cette période'
            ], 409);
        }

        $leaveRequest = LeaveRequest::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $leaveRequest->load(['user', 'school'])
        ], 201);
    }

    public function show($id)
    {
        $leaveRequest = LeaveRequest::with(['user', 'school', 'approvedBy'])->find($id);
        
        if (!$leaveRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Demande non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $leaveRequest
        ]);
    }

    public function update(Request $request, $id)
    {
        $leaveRequest = LeaveRequest::find($id);
        
        if (!$leaveRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Demande non trouvée'
            ], 404);
        }

        // Ne permettre la modification que si la demande est en attente
        if ($leaveRequest->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de modifier une demande déjà traitée'
            ], 409);
        }

        $validator = Validator::make($request->all(), [
            'leave_type' => 'sometimes|string',
            'start_date' => 'sometimes|date|after:today',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'reason' => 'sometimes|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $leaveRequest->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $leaveRequest
        ]);
    }

    public function approve(Request $request, $id)
{
    $leaveRequest = LeaveRequest::findOrFail($id);

    // Sécurité : on prend l'ID du profil de l'admin connecté automatiquement
    $adminProfileId = auth()->user()->profile->id;

    $leaveRequest->update([
        'status' => 'approved',
        'approved_by' => $adminProfileId, 
        'approved_at' => now()
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Demande approuvée par ' . auth()->user()->name,
        'data' => $leaveRequest
    ]);
}

    public function reject(Request $request, $id)
    {
        $leaveRequest = LeaveRequest::find($id);
        
        if (!$leaveRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Demande non trouvée'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'approved_by' => 'required|exists:profiles,id',
            'rejection_reason' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $leaveRequest->update([
            'status' => 'rejected',
            'approved_by' => $request->approved_by,
            'approved_at' => now(),
            'rejection_reason' => $request->rejection_reason
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Demande rejetée',
            'data' => $leaveRequest
        ]);
    }

    public function destroy($id)
    {
        $leaveRequest = LeaveRequest::find($id);
        
        if (!$leaveRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Demande non trouvée'
            ], 404);
        }

        $leaveRequest->delete();

        return response()->json([
            'success' => true,
            'message' => 'Demande supprimée'
        ]);
    }
}