<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    /**
     * Liste des logs (avec filtres puissants)
     */
    public function index(Request $request)
    {
        $query = AuditLog::with(['user']);

        // Filtrer par école (obligatoire pour la sécurité multi-tenant)
        if ($request->has('school_id')) {
            $query->where('school_id', $request->school_id);
        }

        // Rechercher par utilisateur
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filtrer par type d'action (created, updated, deleted, login)
        if ($request->has('action')) {
            $query->where('action', $request->action);
        }

        // Filtrer par sévérité (info, warning, danger)
        if ($request->has('severity')) {
            $query->where('severity', $request->severity);
        }

        $logs = $query->latest()->paginate(50);

        return response()->json([
            'success' => true,
            'data' => $logs
        ]);
    }

    /**
     * Détails d'un log (pour voir les changements JSON)
     */
    public function show($id)
    {
        $log = AuditLog::with(['school', 'user'])->find($id);

        if (!$log) {
            return response()->json(['success' => false, 'message' => 'Log non trouvé'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $log
        ]);
    }
    
    /**
 * Enregistrer un nouveau log (Principalement pour test ou usage interne manuel)
 */
public function store(Request $request)
{
    $validated = $request->validate([
        'school_id'     => 'required|exists:schools,id',
        'user_id'       => 'nullable|exists:profiles,id',
        'user_email'    => 'nullable|email',
        'action'        => 'required|string',
        'resource_type' => 'required|string',
        'resource_id'   => 'nullable|uuid',
        'severity'      => 'nullable|string|in:info,warning,danger,critical',
    ]);

    // On ajoute automatiquement l'IP et l'User Agent pour la sécurité
    $validated['ip_address'] = $request->ip();
    $validated['user_agent'] = $request->userAgent();

    $log = AuditLog::create($validated);

    return response()->json([
        'success' => true,
        'message' => 'Log enregistré avec succès',
        'data' => $log
    ], 201);
}
    // Les méthodes update et destroy sont supprimées ou bloquées pour intégrité.
}