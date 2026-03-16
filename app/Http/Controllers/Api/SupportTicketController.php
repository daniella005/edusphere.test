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
    $ticket = SupportTicket::findOrFail($id);

    // FIX : Utilise l'ID du profil si ton middleware injecte le profil, 
    // ou assure-toi que la relation avec 'submitted_by' est cohérente.
    if ($request->header('User-ID') && $ticket->submitted_by !== $request->header('User-ID')) {
         // Logique de restriction ici si nécessaire
    }

    $validator = Validator::make($request->all(), [
        'status'   => 'sometimes|string|in:open,pending,resolved,closed',
        'priority' => 'sometimes|string|in:low,medium,high,urgent', // Ajout de urgent
        'subject'  => 'sometimes|string|max:255',
        'description' => 'sometimes|string', // C'était 'message' dans ton code, mais 'description' dans store()
    ]);

    if ($validator->fails()) {
        return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
    }

    $oldStatus = $ticket->status;
    
    // Utilise les bons noms de colonnes (description vs message)
    $ticket->update($request->only(['status', 'priority', 'subject', 'description']));

    if ($oldStatus !== $ticket->status) {
        $this->notifyStatusChange($ticket);
    }

    return response()->json(['success' => true, 'data' => $ticket]);
}

private function notifyStatusChange($ticket)
{
    // Utilise la relation définie dans ton modèle (probablement submittedBy)
    $user = $ticket->submittedBy; 
    
    if ($user) {
        // Optionnel : $user->notify(new ...);
        // Pour l'instant, commente la notification si la classe n'existe pas encore
    }
}

}