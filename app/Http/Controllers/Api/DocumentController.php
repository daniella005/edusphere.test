<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $query = Document::with(['uploadedBy']);

        if ($request->has('school_id')) $query->where('school_id', $request->school_id);
        if ($request->has('category')) $query->where('category', $request->category);
        
        // Filtrer par entité liée (ex: tous les docs d'un élève précis)
        if ($request->has('ref_id')) {
            $query->where('reference_id', $request->ref_id)
                  ->where('reference_type', $request->ref_type);
        }

        return response()->json([
            'success' => true,
            'data' => $query->latest()->paginate(20)
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|max:10240', // Max 10MB
            'school_id' => 'nullable|exists:schools,id',
            'uploaded_by' => 'required|exists:profiles,id',
            'category' => 'nullable|string',
            'reference_type' => 'nullable|string',
            'reference_id' => 'nullable|uuid',
            'is_public' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            
            // On génère un nom unique pour éviter les collisions
            $fileName = Str::uuid() . '.' . $extension;
            
            // Stockage : on organise par école/catégorie
            $path = $file->storeAs('documents/' . ($request->school_id ?? 'system'), $fileName, 'public');

            $document = Document::create([
                'school_id' => $request->school_id,
                'uploaded_by' => $request->uploaded_by,
                'file_name' => $fileName,
                'original_name' => $originalName,
                'file_path' => $path,
                'file_size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'file_extension' => $extension,
                'category' => $request->category,
                'reference_type' => $request->reference_type,
                'reference_id' => $request->reference_id,
                'is_public' => $request->is_public ?? false,
                'description' => $request->description
            ]);

            return response()->json(['success' => true, 'data' => $document], 201);
        }

        return response()->json(['success' => false, 'message' => 'Fichier manquant'], 400);
    }

    public function destroy($id)
    {
        $document = Document::findOrFail($id);
        
        // Supprimer le fichier physique du stockage
        Storage::disk('public')->delete($document->file_path);
        
        $document->delete();

        return response()->json(['success' => true, 'message' => 'Document supprimé']);
    }

    public function download($id)
    {
        $document = Document::findOrFail($id);
        return Storage::disk('public')->download($document->file_path, $document->original_name);
    }
}