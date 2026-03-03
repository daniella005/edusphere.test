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
}