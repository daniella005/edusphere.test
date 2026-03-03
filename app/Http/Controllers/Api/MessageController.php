<?php

namespace App\Http\Controllers\Api;

use App\Models\Message;
use App\Models\MessageRecipient;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    /**
     * Afficher la liste des messages
     */
    public function index(Request $request)
    {
        $query = Message::with(['sender', 'school']);
        
        // Filtrer par école
        if ($request->has('school_id')) {
            $query->where('school_id', $request->school_id);
        }
        
        // Filtrer par expéditeur
        if ($request->has('sender_id')) {
            $query->where('sender_id', $request->sender_id);
        }
        
        // Messages reçus par un utilisateur
        if ($request->has('recipient_id')) {
            $query->whereHas('recipients', function ($q) use ($request) {
                $q->where('recipient_id', $request->recipient_id);
            });
        }
        
        $messages = $query->orderBy('created_at', 'desc')->paginate(15);
        
        return response()->json([
            'success' => true,
            'data' => $messages
        ]);
    }

    /**
     * Créer un nouveau message
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'school_id' => 'required|exists:schools,id',
            'sender_id' => 'required|exists:profiles,id',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
            'parent_message_id' => 'nullable|exists:messages,id',
            'is_broadcast' => 'boolean',
            'attachment_urls' => 'nullable|array',
            'recipients' => 'required_if:is_broadcast,false|array',
            'recipients.*' => 'exists:profiles,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try { 
            // On utilise le sender_id du JSON, sinon on cherche celui de l'user connecté
            $senderId = $request->sender_id;

            if (!$senderId && auth()->check()) {
                $senderId = auth()->user()->profile->id ?? null;
            }

            if (!$senderId) {
                return response()->json([
                    'success' => false, 
                    'message' => 'Expéditeur introuvable. Veuillez fournir un sender_id valide.'
                ], 422);
            }

            // Créer le message
            $message = Message::create([
                'school_id' => $request->school_id,
                'sender_id' => $senderId, // Utilise la variable vérifiée
                'subject' => $request->subject,
                'body' => $request->body,
                'parent_message_id' => $request->parent_message_id,
                'is_broadcast' => $request->is_broadcast ?? false,
                'attachment_urls' => $request->attachment_urls
            ]);

            // ... (reste du code pour les destinataires)

            // Ajouter les destinataires
            if (!$request->is_broadcast && $request->has('recipients')) {
                foreach ($request->recipients as $recipientId) {
                    MessageRecipient::create([
                        'message_id' => $message->id,
                        'recipient_id' => $recipientId
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Message envoyé avec succès',
                'data' => $message->load(['sender', 'recipients.recipient'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'envoi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher un message spécifique
     */
    public function show($id)
    {
        $message = Message::with(['sender', 'school', 'recipients.recipient', 'replies'])
            ->find($id);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Message non trouvé'
            ], 404);
        }

        // Marquer comme lu pour le destinataire actuel
        if (request()->has('user_id')) {
            MessageRecipient::where('message_id', $id)
                ->where('recipient_id', request()->user_id)
                ->where('is_read', false)
                ->update([
                    'is_read' => true,
                    'read_at' => now()
                ]);
        }

        return response()->json([
            'success' => true,
            'data' => $message
        ]);
    }

    /**
     * Mettre à jour un message
     */
    public function update(Request $request, $id)
    {
        $message = Message::find($id);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Message non trouvé'
            ], 404);
        }

        // Seul l'expéditeur peut modifier dans un délai raisonnable
        if ($message->sender_id != $request->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'êtes pas autorisé à modifier ce message'
            ], 403);
        }

        if ($message->created_at->diffInMinutes(now()) > 15) {
            return response()->json([
                'success' => false,
                'message' => 'Délai de modification dépassé (15 minutes)'
            ], 409);
        }

        $validator = Validator::make($request->all(), [
            'subject' => 'sometimes|string|max:255',
            'body' => 'sometimes|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $message->update($request->only(['subject', 'body']));

        return response()->json([
            'success' => true,
            'data' => $message
        ]);
    }

    /**
     * Supprimer un message
     */
    public function destroy(Request $request, $id)
    {
        $message = Message::find($id);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Message non trouvé'
            ], 404);
        }

        // Soft delete ou marquer comme supprimé pour le destinataire
        if ($request->has('user_id')) {
            MessageRecipient::where('message_id', $id)
                ->where('recipient_id', $request->user_id)
                ->update([
                    'is_deleted' => true,
                    'deleted_at' => now()
                ]);

            return response()->json([
                'success' => true,
                'message' => 'Message supprimé de votre boîte'
            ]);
        }

        // Seul l'expéditeur peut supprimer complètement
        if ($message->sender_id != $request->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }

        $message->delete();

        return response()->json([
            'success' => true,
            'message' => 'Message supprimé'
        ]);
    }

    /**
     * Obtenir les messages d'une conversation
     */
    public function conversation(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user1_id' => 'required|exists:profiles,id',
            'user2_id' => 'required|exists:profiles,id|different:user1_id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $messages = Message::where(function ($q) use ($request) {
                $q->where('sender_id', $request->user1_id)
                  ->whereHas('recipients', function ($r) use ($request) {
                      $r->where('recipient_id', $request->user2_id);
                  });
            })
            ->orWhere(function ($q) use ($request) {
                $q->where('sender_id', $request->user2_id)
                  ->whereHas('recipients', function ($r) use ($request) {
                      $r->where('recipient_id', $request->user1_id);
                  });
            })
            ->with(['sender', 'recipients'])
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $messages
        ]);
    }

    /**
     * Répondre à un message
     */
    public function reply(Request $request, $id)
    {
        $parentMessage = Message::find($id);

        if (!$parentMessage) {
            return response()->json([
                'success' => false,
                'message' => 'Message original non trouvé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'sender_id' => 'required|exists:profiles,id',
            'body' => 'required|string',
            'recipient_id' => 'required|exists:profiles,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            $reply = Message::create([
                'school_id' => $parentMessage->school_id,
                'sender_id' => $request->sender_id,
                'subject' => 'Re: ' . $parentMessage->subject,
                'body' => $request->body,
                'parent_message_id' => $id
            ]);

            MessageRecipient::create([
                'message_id' => $reply->id,
                'recipient_id' => $request->recipient_id
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $reply->load(['sender', 'recipients'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la réponse',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}