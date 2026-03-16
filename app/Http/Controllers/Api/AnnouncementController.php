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
    // Dans AnnouncementController.php, modifie l'index pour que school_id soit optionnel
public function index(Request $request)
{
    $query = Announcement::with(['author:id,first_name,last_name', 'school']);

    // On ne filtre par school_id que s'il est fourni
    if ($request->filled('school_id')) {
        $query->where('school_id', $request->school_id);
    }

    // Pour le test, on peut vouloir voir même ce qui n'est pas encore publié
    $announcements = $query->orderBy('created_at', 'desc')->get();

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

    public function update(Request $request, $id) {
    try {
        $announcement = Announcement::findOrFail($id);
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'status' => 'sometimes|in:draft,published,archived',
            'is_pinned' => 'sometimes|boolean'
        ]);
        if ($validator->fails()) return response()->json(['success' => false, 'errors' => $validator->errors()], 422);

        $announcement->update($request->all());
        return response()->json(['success' => true, 'message' => 'Annonce mise à jour', 'data' => $announcement]);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'message' => 'Annonce introuvable'], 404);
    }
}

}