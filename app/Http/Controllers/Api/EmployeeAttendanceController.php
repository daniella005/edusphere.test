<?php

namespace App\Http\Controllers\Api;

use App\Models\EmployeeAttendance;
use App\Models\Profile;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class EmployeeAttendanceController extends Controller
{
    public function index(Request $request)
    {
        $query = EmployeeAttendance::with(['user', 'school']);
        
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        
        if ($request->has('school_id')) {
            $query->where('school_id', $request->school_id);
        }
        
        if ($request->has('date')) {
            $query->whereDate('date', $request->date);
        }
        
        if ($request->has('month')) {
            $query->whereMonth('date', $request->month)
                  ->whereYear('date', $request->get('year', now()->year));
        }
        
        $attendances = $query->orderBy('date', 'desc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $attendances
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:profiles,id',
            'school_id' => 'required|exists:schools,id',
            'date' => 'required|date',
            'status' => 'required|in:present,absent,late,excused',
            'check_in_time' => 'nullable|date_format:H:i:s',
            'check_out_time' => 'nullable|date_format:H:i:s|after:check_in_time',
            'leave_type' => 'nullable|string',
            'remarks' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $exists = EmployeeAttendance::where('user_id', $request->user_id)
            ->whereDate('date', $request->date)
            ->exists();
            
        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Une présence existe déjà pour cet employé à cette date'
            ], 409);
        }

        // Calculer les heures travaillées si check_in et check_out sont fournis
        $workHours = null;
        if ($request->check_in_time && $request->check_out_time) {
            $checkIn = Carbon::parse($request->check_in_time);
            $checkOut = Carbon::parse($request->check_out_time);
            $workHours = round($checkOut->diffInMinutes($checkIn) / 60, 2);
        }

        $attendance = EmployeeAttendance::create(array_merge(
            $request->all(),
            ['work_hours' => $workHours]
        ));

        return response()->json([
            'success' => true,
            'data' => $attendance->load(['user'])
        ], 201);
    }

    public function show($id)
    {
        $attendance = EmployeeAttendance::with(['user', 'school'])->find($id);
        
        if (!$attendance) {
            return response()->json([
                'success' => false,
                'message' => 'Présence non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $attendance
        ]);
    }

    public function update(Request $request, $id)
    {
        $attendance = EmployeeAttendance::find($id);
        
        if (!$attendance) {
            return response()->json([
                'success' => false,
                'message' => 'Présence non trouvée'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'sometimes|in:present,absent,late,excused',
            'check_in_time' => 'nullable|date_format:H:i:s',
            'check_out_time' => 'nullable|date_format:H:i:s|after:check_in_time',
            'leave_type' => 'nullable|string',
            'remarks' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        
        // Recalculer les heures travaillées si nécessaire
        if ($request->has('check_in_time') || $request->has('check_out_time')) {
            $checkIn = $request->check_in_time ?? $attendance->check_in_time;
            $checkOut = $request->check_out_time ?? $attendance->check_out_time;
            
            if ($checkIn && $checkOut) {
                $checkInCarbon = Carbon::parse($checkIn);
                $checkOutCarbon = Carbon::parse($checkOut);
                $data['work_hours'] = round($checkOutCarbon->diffInMinutes($checkInCarbon) / 60, 2);
            }
        }

        $attendance->update($data);

        return response()->json([
            'success' => true,
            'data' => $attendance
        ]);
    }

    public function destroy($id)
    {
        $attendance = EmployeeAttendance::find($id);
        
        if (!$attendance) {
            return response()->json([
                'success' => false,
                'message' => 'Présence non trouvée'
            ], 404);
        }

        $attendance->delete();

        return response()->json([
            'success' => true,
            'message' => 'Présence supprimée'
        ]);
    }

    public function monthlyReport(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:profiles,id',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2000|max:2100'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $attendances = EmployeeAttendance::where('user_id', $request->user_id)
            ->whereMonth('date', $request->month)
            ->whereYear('date', $request->year)
            ->get();

        $totalDays = $attendances->count();
        $presentDays = $attendances->where('status', 'present')->count();
        $absentDays = $attendances->where('status', 'absent')->count();
        $lateDays = $attendances->where('status', 'late')->count();
        $totalWorkHours = $attendances->sum('work_hours');

        return response()->json([
            'success' => true,
            'data' => [
                'user_id' => $request->user_id,
                'month' => $request->month,
                'year' => $request->year,
                'total_days' => $totalDays,
                'present' => $presentDays,
                'absent' => $absentDays,
                'late' => $lateDays,
                'attendance_rate' => $totalDays > 0 
                    ? round(($presentDays / $totalDays) * 100, 2)
                    : 0,
                'total_work_hours' => round($totalWorkHours, 2)
            ]
        ]);
    }
}