<?php

namespace App\Http\Controllers\Api;

use App\Models\Notification;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class NotificationController extends Controller
{
    /**
     * Afficher les notifications d'un utilisateur
     */
    public function index(Request $request)
{
    // On passe de 'required' à 'nullable'
    $validator = Validator::make($request->all(), [
        'user_id' => 'nullable|exists:profiles,id'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'errors' => $validator->errors()
        ], 422);
    }

    $query = Notification::query();
    
    // On filtre seulement si l'ID est fourni
    if ($request->has('user_id')) {
        $query->where('user_id', $request->user_id);
    }
    
    if ($request->has('is_read')) {
        $query->where('is_read', $request->is_read);
    }
    
    if ($request->has('type')) {
        $query->where('notification_type', $request->type);
    }
    
    // On utilise get() au lieu de paginate() pour ton test PowerShell 
    // afin d'avoir un retour direct, ou garde paginate(20) si tu préfères.
    $notifications = $query->orderBy('created_at', 'desc')->get();
    
    return response()->json([
        'success' => true,
        'data' => $notifications
    ]);
}

    /**
     * Créer une notification
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:profiles,id',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'notification_type' => 'required|string',
            'reference_type' => 'nullable|string',
            'reference_id' => 'nullable|uuid',
            'action_url' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $notification = Notification::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $notification
        ], 201);
    }

    /**
     * Afficher une notification spécifique
     */
    public function show($id)
    {
        $notification = Notification::find($id);

        if (!$notification) {
            return response()->json([
                'success' => false,
                'message' => 'Notification non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $notification
        ]);
    }

    /**
     * Marquer une notification comme lue
     */
    public function markAsRead($id)
    {
        $notification = Notification::find($id);

        if (!$notification) {
            return response()->json([
                'success' => false,
                'message' => 'Notification non trouvée'
            ], 404);
        }

        if (!$notification->is_read) {
            $notification->update([
                'is_read' => true,
                'read_at' => now()
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Notification marquée comme lue',
            'data' => $notification
        ]);
    }

    /**
     * Marquer toutes les notifications comme lues
     */
    public function markAllAsRead(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:profiles,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $updated = Notification::where('user_id', $request->user_id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now()
            ]);

        return response()->json([
            'success' => true,
            'message' => "$updated notification(s) marquée(s) comme lue(s)"
        ]);
    }

    /**
     * Supprimer une notification
     */
    public function destroy($id)
    {
        $notification = Notification::find($id);

        if (!$notification) {
            return response()->json([
                'success' => false,
                'message' => 'Notification non trouvée'
            ], 404);
        }

        $notification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notification supprimée'
        ]);
    }

    /**
     * Supprimer toutes les notifications lues
     */
    public function clearRead(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:profiles,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $deleted = Notification::where('user_id', $request->user_id)
            ->where('is_read', true)
            ->delete();

        return response()->json([
            'success' => true,
            'message' => "$deleted notification(s) supprimée(s)"
        ]);
    }

    /**
     * Obtenir le nombre de notifications non lues
     */
    public function unreadCount($userId)
    {
        $count = Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'user_id' => $userId,
                'unread_count' => $count
            ]
        ]);
    }

    /**
     * Créer des notifications en masse
     */
    public function bulkCreate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:profiles,id',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'notification_type' => 'required|string',
            'reference_type' => 'nullable|string',
            'reference_id' => 'nullable|uuid',
            'action_url' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $notifications = [];
        foreach ($request->user_ids as $userId) {
            $notifications[] = [
                'id' => (string) \Illuminate\Support\Str::uuid(), // Génération manuelle obligatoire ici
                'user_id' => $userId,
                'title' => $request->title,
                'message' => $request->message,
                'notification_type' => $request->notification_type,
                'reference_type' => $request->reference_type,
                'reference_id' => $request->reference_id,
                'action_url' => $request->action_url,
                'created_at' => now(),
                'updated_at' => now()
            ];
        }

        Notification::insert($notifications);

        return response()->json([
            'success' => true,
            'message' => count($notifications) . ' notification(s) créée(s)'
        ]);
    }

    public function update(Request $request, $id) {
    $notification = Notification::find($id);
    if (!$notification) return response()->json(['success' => false, 'message' => 'Notification non trouvée'], 404);

    $validator = Validator::make($request->all(), [
        'title' => 'sometimes|string|max:255',
        'message' => 'sometimes|string',
        'is_read' => 'sometimes|boolean'
    ]);
    if ($validator->fails()) return response()->json(['success' => false, 'errors' => $validator->errors()], 422);

    $notification->update($request->all());
    return response()->json(['success' => true, 'message' => 'Notification mise à jour', 'data' => $notification]);
}

}