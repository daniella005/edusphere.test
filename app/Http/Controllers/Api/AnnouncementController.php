<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AnnouncementController extends Controller
{
    /**
     * Liste des annonces (filtrées par audience pour les élèves/parents)
     */
    public function index(Request $request)
{
    // Sécurité : Forcer le school_id de l'utilisateur connecté ou valider strictement
    $schoolId = $request->school_id; 

    $query = Announcement::with(['author:id,first_name,last_name', 'school'])
        ->where('school_id', $schoolId)
        ->where('status', 'published')
        ->where('publish_date', '<=', now())
        ->where(function ($q) {
            $q->whereNull('expiry_date')
              ->orWhere('expiry_date', '>', now());
        });

    // Correction Audience : Laravel gère les colonnes JSON, mais s'assurer de la logique
    if ($request->has('role')) {
        // On cherche si le rôle est dans le tableau JSON 'audience'
        $query->whereJsonContains('audience', $request->role);
    }

    $announcements = $query->orderBy('is_pinned', 'desc')
                           ->orderBy('publish_date', 'desc')
                           ->get();

    return response()->json(['success' => true, 'data' => $announcements]);
}

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'school_id' => 'required|exists:schools,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'announcement_type' => 'required|in:general,event,holiday,academic,emergency',
            'audience' => 'nullable|array', // ['student', 'teacher', 'parent']
            'publish_date' => 'required|date',
            'author_id' => 'required|exists:profiles,id',
            'is_pinned' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $announcement = Announcement::create($request->all());

        // Ici, tu pourrais déclencher un Job pour envoyer SMS/Emails si cochés
        
        return response()->json(['success' => true, 'data' => $announcement], 201);
    }

    public function show($id)
    {
        $announcement = Announcement::with(['author'])->find($id);
        
        if (!$announcement) {
            return response()->json(['success' => false, 'message' => 'Annonce non trouvée'], 404);
        }

        // Incrémenter les vues
        $announcement->increment('views_count');

        return response()->json(['success' => true, 'data' => $announcement]);
    }

    public function destroy($id)
    {
        $announcement = Announcement::find($id);
        if (!$announcement) return response()->json(['success' => false], 404);
        
        $announcement->delete();
        return response()->json(['success' => true, 'message' => 'Annonce supprimée']);
    }
}