<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AnnouncementRead;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnnouncementReadController extends Controller
{
    // Ajoute ceci juste après l'ouverture de la classe
public function index()
{
    $reads = AnnouncementRead::with(['user:id,first_name,last_name'])->get();
    return response()->json([
        'success' => true,
        'data' => $reads
    ]);
}

    /**
     * Marquer une annonce comme lue pour l'utilisateur connecté
     */
    public function markAsRead(Request $request)
{
    // On valide que l'ID est bien présent dans le JSON
    $request->validate([
        'announcement_id' => 'required|exists:announcements,id',
        'user_id' => 'sometimes|exists:profiles,id'
    ]);

    // On récupère l'ID de l'annonce depuis le body JSON
    $announcementId = $request->announcement_id;
    
    // On récupère l'user : soit celui authentifié, soit celui du JSON (pour tes tests)
    $userId = Auth::id() ?? $request->user_id;

    $read = AnnouncementRead::firstOrCreate([
        'announcement_id' => $announcementId,
        'user_id' => $userId,
    ], [
        'read_at' => $request->read_at ?? now()
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Annonce marquée comme lue',
        'data' => $read
    ]);
}

    /**
     * Obtenir la liste des personnes ayant lu une annonce spécifique
     * (Utile pour l'administration)
     */
    public function getReaders($announcementId)
    {
       $readers = AnnouncementRead::with(['user:id,first_name,last_name,profile_picture'])
            ->where('announcement_id', $announcementId)
        ->orderBy('read_at', 'desc')
        ->get();

        return response()->json([
            'success' => true,
            'count' => $readers->count(),
            'data' => $readers
        ]);
    }

    public function update(Request $request, $id)
{
    $item = \App\Models\AnnouncementRead::find($id);
    if (!$item) return response()->json(['status' => 'error', 'message' => 'Lecture non trouvée'], 404);

    $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
        'read_at' => 'sometimes|date',
        'ip_address' => 'sometimes|string'
    ]);

    if ($validator->fails()) return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);

    $item->update($request->all());
    return response()->json(['status' => 'success', 'message' => 'Statut de lecture mis à jour', 'data' => $item], 200);
}

}