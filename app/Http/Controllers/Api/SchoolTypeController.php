<?php

namespace App\Http\Controllers\Api;

use App\Models\SchoolType;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SchoolTypeController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => SchoolType::where('is_active', true)->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|unique:school_types,name']);
        
        $type = SchoolType::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
        ]);

        return response()->json(['success' => true, 'data' => $type], 201);
    }

    public function update(Request $request, $id)
{
    $item = \App\Models\SchoolType::find($id);
    if (!$item) return response()->json(['status' => 'error', 'message' => 'Type d\'école introuvable'], 404);

    $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
        'name' => 'sometimes|required|unique:school_types,name,' . $id,
        'description' => 'nullable|string'
    ]);

    if ($validator->fails()) return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);

    $item->update($request->all());
    return response()->json(['status' => 'success', 'message' => 'Type d\'école mis à jour', 'data' => $item], 200);
}

}