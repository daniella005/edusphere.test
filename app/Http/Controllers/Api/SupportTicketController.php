<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class SupportTicketController extends Controller
{
    public function index(Request $request)
    {
        $query = SupportTicket::with(['submittedBy', 'assignedTo', 'school']);

        // Filtres pour l'admin
        if ($request->has('status')) $query->where('status', $request->status);
        if ($request->has('priority')) $query->where('priority', $request->priority);
        if ($request->has('school_id')) $query->where('school_id', $request->school_id);
        
        // Si c'est un utilisateur simple, il ne voit que ses tickets
        if ($request->has('my_tickets')) {
            $query->where('submitted_by', $request->user_id);
        }

        return response()->json([
            'success' => true,
            'data' => $query->latest()->paginate(15)
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string',
            'priority' => 'sometimes|in:low,medium,high,urgent',
            'submitted_by' => 'required|exists:profiles,id',
            'school_id' => 'nullable|exists:schools,id',
            'attachment_urls' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        // Génération d'un numéro de ticket unique type TKT-2026-XXXX
        $ticketNumber = 'TKT-' . date('Y') . '-' . strtoupper(Str::random(6));

        $ticket = SupportTicket::create(array_merge(
            $request->all(),
            ['ticket_number' => $ticketNumber, 'status' => 'open']
        ));

        return response()->json([
            'success' => true, 
            'message' => 'Ticket créé avec succès',
            'data' => $ticket
        ], 201);
    }

    public function show($id)
    {
        $ticket = SupportTicket::with(['submittedBy', 'assignedTo', 'comments.user'])->find($id);
        
        if (!$ticket) return response()->json(['success' => false, 'message' => 'Ticket non trouvé'], 404);
        
        return response()->json(['success' => true, 'data' => $ticket]);
    }

    public function update(Request $request, $id)
{
    // 1. Récupérer le ticket
    $ticket = SupportTicket::findOrFail($id);

    // 2. Vérification de sécurité (Optionnel mais recommandé)
    // Si l'utilisateur n'est pas un admin, il ne peut modifier que ses propres tickets
    if ($request->user()->role !== 'admin' && $ticket->user_id !== $request->user()->id) {
        return response()->json(['message' => 'Action non autorisée'], 403);
    }

    $validator = Validator::make($request->all(), [
        'status' => 'sometimes|string|in:open,pending,resolved,closed',
        'priority' => 'sometimes|string|in:low,medium,high',
        'subject' => 'sometimes|string|max:255',
        'message' => 'sometimes|string',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    // Sauvegarder l'ancien statut pour la notification
    $oldStatus = $ticket->status;

    // Mise à jour (on ne met JAMAIS à jour le user_id ici par sécurité)
    $ticket->update($request->only(['status', 'priority', 'subject', 'message']));

    // 3. Logique de notification (si le statut a changé)
    if ($oldStatus !== $ticket->status) {
        // Déclencher un événement ou appeler une méthode de notification
        $this->notifyStatusChange($ticket);
    }

    return response()->json([
        'success' => true,
        'data' => $ticket
    ]);
}

private function notifyStatusChange($ticket)
{
    $user = $ticket->user; // Assure-toi que la relation appartient à User dans le modèle
    
    // Notification à l'utilisateur qui a créé le ticket
    $user->notify(new \App\Notifications\TicketStatusChanged($ticket));
    
    // Optionnel : Notifier aussi les admins si nécessaire
}

}