<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;

class DepartmentController extends Controller
{
    public function index()
    {
        try {
            $departments = Department::all();
            return response()->json([
                'status' => 'success',
                'data' => $departments
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'school_id'   => 'required|exists:schools,id',
                'name'        => 'required|string|max:255',
                'code'        => 'required|string|max:50|unique:departments,code',
                'description' => 'nullable|string',
                'is_active'   => 'boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $department = Department::create($validator->validated());

            return response()->json([
                'status' => 'success',
                'message' => 'Département créé avec succès',
                'data' => $department
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
{
    try {
        $department = Department::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name'        => 'sometimes|string|max:255',
            'code'        => 'sometimes|string|max:50|unique:departments,code,' . $id,
            'description' => 'nullable|string',
            'is_active'   => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $department->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Département mis à jour',
            'data' => $department
        ]);
    } catch (Exception $e) {
        return response()->json(['status' => 'error', 'message' => 'Département non trouvé'], 404);
    }
}

}