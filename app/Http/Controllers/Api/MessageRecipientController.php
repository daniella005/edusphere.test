<?php

namespace App\Http\Controllers\Api;

use App\Models\MessageRecipient;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class MessageRecipientController extends Controller
{
    /**
     * Afficher les destinataires d'un message
     */
    public function index(Request $request)
    {
        $query = MessageRecipient::with(['message', 'recipient']);
        
        if ($request->has('message_id')) {
            $query->where('message_id', $request->message_id);
        }
        
        if ($request->has('recipient_id')) {
            $query->where('recipient_id', $request->recipient_id);
        }
        
        if ($request->has('is_read')) {
            $query->where('is_read', $request->is_read);
        }
        
        $recipients = $query->paginate(15);
        
        return response()->json([
            'success' => true,
            'data' => $recipients
        ]);
    }

    /**
     * Afficher un destinataire spécifique
     */
    public function show($id)
    {
        $recipient = MessageRecipient::with(['message', 'recipient'])->find($id);

        if (!$recipient) {
            return response()->json([
                'success' => false,
                'message' => 'Destinataire non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $recipient
        ]);
    }

    /**
     * Marquer un message comme lu
     */
    public function markAsRead($id)
    {
        $recipient = MessageRecipient::find($id);

        if (!$recipient) {
            return response()->json([
                'success' => false,
                'message' => 'Destinataire non trouvé'
            ], 404);
        }

        if (!$recipient->is_read) {
            $recipient->update([
                'is_read' => true,
                'read_at' => now()
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Message marqué comme lu',
            'data' => $recipient
        ]);
    }

    /**
     * Marquer plusieurs messages comme lus
     */
    public function markBulkAsRead(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'recipient_id' => 'required|exists:profiles,id',
            'message_ids' => 'required|array',
            'message_ids.*' => 'exists:messages,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $updated = MessageRecipient::where('recipient_id', $request->recipient_id)
            ->whereIn('message_id', $request->message_ids)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now()
            ]);

        return response()->json([
            'success' => true,
            'message' => "$updated message(s) marqué(s) comme lu(s)"
        ]);
    }

    /**
     * Mettre un message en favori
     */
    public function toggleStar($id)
    {
        $recipient = MessageRecipient::find($id);

        if (!$recipient) {
            return response()->json([
                'success' => false,
                'message' => 'Destinataire non trouvé'
            ], 404);
        }

        $recipient->update([
            'is_starred' => !$recipient->is_starred
        ]);

        return response()->json([
            'success' => true,
            'message' => $recipient->is_starred ? 'Message ajouté aux favoris' : 'Message retiré des favoris',
            'data' => $recipient
        ]);
    }

    /**
     * Obtenir les statistiques de messages pour un utilisateur
     */
    public function stats($userId)
    {
        $total = MessageRecipient::where('recipient_id', $userId)->count();
        $unread = MessageRecipient::where('recipient_id', $userId)
            ->where('is_read', false)
            ->count();
        $starred = MessageRecipient::where('recipient_id', $userId)
            ->where('is_starred', true)
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total' => $total,
                'unread' => $unread,
                'starred' => $starred,
                'inbox' => MessageRecipient::where('recipient_id', $userId)
                    ->where('is_deleted', false)
                    ->count()
            ]
        ]);
    }
}