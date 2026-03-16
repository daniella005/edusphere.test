<?php

namespace App\Http\Controllers\Api;

use App\Models\SchoolModule;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class SchoolModuleController extends Controller
{
    /**
     * Afficher les modules d'une école
     */
    public function index(Request $request)
    {
        $query = SchoolModule::with(['school']);
        
        if ($request->has('school_id')) {
            $query->where('school_id', $request->school_id);
        }
        
        if ($request->has('is_enabled')) {
            $query->where('is_enabled', $request->is_enabled);
        }
        
        $modules = $query->get();
        
        return response()->json([
            'success' => true,
            'data' => $modules
        ]);
    }

    /**
 * Enregistrer un nouveau module pour une école
 */
public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'school_id' => 'required|exists:schools,id',
        'module_name' => 'required|string',
        'is_enabled' => 'boolean',
        'config' => 'nullable|array'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'errors' => $validator->errors()
        ], 422);
    }

    // Vérifier si le module existe déjà pour cette école (à cause de l'index unique)
    $exists = SchoolModule::where('school_id', $request->school_id)
        ->where('module_name', $request->module_name)
        ->exists();

    if ($exists) {
        return response()->json([
            'success' => false,
            'message' => 'Ce module est déjà configuré pour cette école.'
        ], 409);
    }

    $module = SchoolModule::create([
        'school_id' => $request->school_id,
        'module_name' => $request->module_name,
        'is_enabled' => $request->is_enabled ?? true,
        'config' => $request->config,
        'enabled_at' => ($request->is_enabled ?? true) ? now() : null,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Module créé avec succès',
        'data' => $module
    ], 201);
}

    /**
     * Activer/désactiver un module
     */
    public function toggle(Request $request, $id)
    {
        $module = SchoolModule::find($id);

        if (!$module) {
            return response()->json([
                'success' => false,
                'message' => 'Module non trouvé'
            ], 404);
        }

        $module->update([
            'is_enabled' => !$module->is_enabled,
            'enabled_at' => !$module->is_enabled ? now() : $module->enabled_at,
            'disabled_at' => $module->is_enabled ? now() : $module->disabled_at
        ]);

        return response()->json([
            'success' => true,
            'message' => $module->is_enabled ? 'Module activé' : 'Module désactivé',
            'data' => $module
        ]);
    }

    /**
     * Mettre à jour la configuration d'un module
     */
    public function updateConfig(Request $request, $id)
    {
        $module = SchoolModule::find($id);

        if (!$module) {
            return response()->json([
                'success' => false,
                'message' => 'Module non trouvé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'config' => 'required|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $module->update([
            'config' => $request->config
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Configuration mise à jour',
            'data' => $module
        ]);
    }

    /**
     * Obtenir les modules disponibles
     */
    public function available()
    {
        $modules = [
            ['name' => 'academic', 'label' => 'Gestion académique', 'description' => 'Classes, sections, matières'],
            ['name' => 'attendance', 'label' => 'Présences', 'description' => 'Gestion des présences'],
            ['name' => 'examinations', 'label' => 'Examens', 'description' => 'Examens, résultats, bulletins'],
            ['name' => 'assignments', 'label' => 'Devoirs', 'description' => 'Devoirs et soumissions'],
            ['name' => 'finance', 'label' => 'Finance', 'description' => 'Frais, factures, paiements'],
            ['name' => 'timetable', 'label' => 'Emploi du temps', 'description' => 'Planification des cours'],
            ['name' => 'communication', 'label' => 'Communication', 'description' => 'Messages, annonces'],
            ['name' => 'library', 'label' => 'Bibliothèque', 'description' => 'Gestion de la bibliothèque'],
            ['name' => 'transport', 'label' => 'Transport', 'description' => 'Gestion des transports'],
            ['name' => 'hostel', 'label' => 'Internat', 'description' => 'Gestion de l\'internat'],
            ['name' => 'reports', 'label' => 'Rapports', 'description' => 'Génération de rapports'],
        ];

        return response()->json([
            'success' => true,
            'data' => $modules
        ]);
    }

    /**
     * Mettre à jour un module (Méthode PUT/PATCH)
     */
    public function update(Request $request, $id)
    {
        $module = SchoolModule::find($id);

        if (!$module) {
            return response()->json([
                'success' => false,
                'message' => 'Module non trouvé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'is_enabled' => 'sometimes|boolean',
            'config' => 'sometimes|array',
            'module_name' => 'sometimes|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();

        // Logique métier : Si le statut change, on met à jour les timestamps correspondants
        if ($request->has('is_enabled') && $request->is_enabled != $module->is_enabled) {
            if ($request->is_enabled) {
                $data['enabled_at'] = now();
                $data['disabled_at'] = null;
            } else {
                $data['disabled_at'] = now();
            }
        }

        $module->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Module mis à jour avec succès',
            'data' => $module
        ]);
    }
    
}