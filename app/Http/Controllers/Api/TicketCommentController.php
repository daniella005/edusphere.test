<?php

namespace App\Http\Controllers\Api;

use App\Models\TicketComment;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class TicketCommentController extends Controller
{
    /**
     * Afficher les commentaires d'un ticket
     */
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ticket_id' => 'required|exists:support_tickets,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $comments = TicketComment::where('ticket_id', $request->ticket_id)
            ->with(['user'])
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $comments
        ]);
    }

    /**
     * Créer un commentaire
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ticket_id' => 'required|exists:support_tickets,id',
            'user_id' => 'required|exists:profiles,id',
            'content' => 'required|string',
            'is_internal' => 'boolean',
            'attachment_urls' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Remplace la ligne 61 par celle-ci :
$comment = TicketComment::create($validator->validated());

            // Mettre à jour le ticket
            $ticket = $comment->ticket;
            $ticket->updated_at = now();
            
            // Si c'est le premier commentaire après création
            if ($ticket->first_response_at === null && $comment->user_id !== $ticket->submitted_by) {
                $ticket->first_response_at = now();
            }
            
            $ticket->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $comment->load(['user'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du commentaire',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher un commentaire spécifique
     */
    public function show($id)
    {
        $comment = TicketComment::with(['user', 'ticket'])->find($id);

        if (!$comment) {
            return response()->json([
                'success' => false,
                'message' => 'Commentaire non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $comment
        ]);
    }

    /**
     * Mettre à jour un commentaire
     */
    public function update(Request $request, $id)
    {
        $comment = TicketComment::find($id);

        if (!$comment) {
            return response()->json([
                'success' => false,
                'message' => 'Commentaire non trouvé'
            ], 404);
        }

        // Seul l'auteur peut modifier dans un délai raisonnable
        if ($comment->user_id != $request->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'êtes pas autorisé à modifier ce commentaire'
            ], 403);
        }

        if ($comment->created_at->diffInMinutes(now()) > 30) {
            return response()->json([
                'success' => false,
                'message' => 'Délai de modification dépassé (30 minutes)'
            ], 409);
        }

        $validator = Validator::make($request->all(), [
            'content' => 'sometimes|string',
            'attachment_urls' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $comment->update($request->only(['content', 'attachment_urls']));

        return response()->json([
            'success' => true,
            'data' => $comment
        ]);
    }

    /**
     * Supprimer un commentaire
     */
    public function destroy(Request $request, $id)
    {
        $comment = TicketComment::find($id);

        if (!$comment) {
            return response()->json([
                'success' => false,
                'message' => 'Commentaire non trouvé'
            ], 404);
        }

        // Seul l'auteur ou un admin peut supprimer
        if ($comment->user_id != $request->user_id && !$this->isAdmin($request->user_id)) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }

        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Commentaire supprimé'
        ]);
    }

    /**
     * Vérifier si un utilisateur est admin
     */
    private function isAdmin($userId)
    {
        return \App\Models\UserRole::where('user_id', $userId)
            ->whereIn('role', ['super_admin', 'school_admin'])
            ->exists();
    }
}