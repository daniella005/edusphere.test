<?php

namespace App\Http\Controllers\Api;

use App\Models\SystemSetting;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class SystemSettingController extends Controller
{
    /**
     * Afficher tous les paramètres système
     */
    public function index(Request $request)
    {
        $query = SystemSetting::query();
        
        // Filtrer par visibilité publique
        if ($request->has('is_public')) {
            $query->where('is_public', $request->is_public);
        }
        
        // Récupérer depuis le cache si disponible
        $cacheKey = 'system_settings_' . md5($request->fullUrl());
        $settings = Cache::remember($cacheKey, 3600, function () use ($query) {
            return $query->get();
        });
        
        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    /**
     * Créer un paramètre système
     */
   public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'key' => 'required|string|max:100|unique:system_settings,key',
        'value' => 'required', // On accepte tout (string, array, int)
        'description' => 'nullable|string',
        'is_public' => 'boolean'
    ]);

    if ($validator->fails()) {
        return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
    }

    // Pas besoin de json_encode ici, le modèle s'en charge grâce au $casts
    $setting = SystemSetting::create([
        'key' => $request->key,
        'value' => $request->value, 
        'description' => $request->description,
        'is_public' => $request->is_public ?? false
    ]);

    $this->clearSettingsCache();

    return response()->json([
        'success' => true,
        'message' => 'Paramètre créé avec succès',
        'data' => $setting
    ], 201);
}
    /**
     * Afficher un paramètre spécifique
     */
    public function show($key)
    {
        $setting = SystemSetting::where('key', $key)->first();

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Paramètre non trouvé'
            ], 404);
        }

        // Décoder la valeur JSON si nécessaire
        $setting->value = $this->decodeValue($setting->value);

        return response()->json([
            'success' => true,
            'data' => $setting
        ]);
    }

    /**
     * Mettre à jour un paramètre
     */
    public function update(Request $request, $key)
    {
        $setting = SystemSetting::where('key', $key)->first();

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Paramètre non trouvé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'value' => 'required',
            'description' => 'nullable|string',
            'is_public' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Convertir la valeur en JSON
        $value = is_string($request->value) ? $request->value : json_encode($request->value);

        $setting->update([
            'value' => $value,
            'description' => $request->description ?? $setting->description,
            'is_public' => $request->is_public ?? $setting->is_public,
            'updated_by' => auth()->id()
        ]);

        // Vider le cache
        $this->clearSettingsCache();

        return response()->json([
            'success' => true,
            'message' => 'Paramètre mis à jour',
            'data' => $setting
        ]);
    }

    /**
     * Supprimer un paramètre
     */
    public function destroy($key)
    {
        $setting = SystemSetting::where('key', $key)->first();

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Paramètre non trouvé'
            ], 404);
        }

        $setting->delete();

        // Vider le cache
        $this->clearSettingsCache();

        return response()->json([
            'success' => true,
            'message' => 'Paramètre supprimé'
        ]);
    }

    /**
     * Obtenir plusieurs paramètres à la fois
     */
    public function bulkGet(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'keys' => 'required|array',
            'keys.*' => 'string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $settings = SystemSetting::whereIn('key', $request->keys)->get();
        
        // Décoder les valeurs
        $settings = $settings->map(function ($setting) {
            $setting->value = $this->decodeValue($setting->value);
            return $setting;
        });

        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    /**
     * Mettre à jour plusieurs paramètres
     */
    public function bulkUpdate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'settings' => 'required|array',
            'settings.*.key' => 'required|string|exists:system_settings,key',
            'settings.*.value' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $updated = [];
        foreach ($request->settings as $item) {
            $setting = SystemSetting::where('key', $item['key'])->first();
            $value = is_string($item['value']) ? $item['value'] : json_encode($item['value']);
            
            $setting->update([
                'value' => $value,
                'updated_by' => auth()->id()
            ]);
            
            $updated[] = $setting;
        }

        // Vider le cache
        $this->clearSettingsCache();

        return response()->json([
            'success' => true,
            'message' => count($updated) . ' paramètres mis à jour',
            'data' => $updated
        ]);
    }

    /**
     * Obtenir les paramètres publics (accessible sans authentification)
     */
    public function public()
    {
        $settings = SystemSetting::where('is_public', true)->get();
        
        $settings = $settings->mapWithKeys(function ($setting) {
            return [$setting->key => $this->decodeValue($setting->value)];
        });

        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    /**
     * Réinitialiser un paramètre à sa valeur par défaut
     */
    public function reset($key)
    {
        $setting = SystemSetting::where('key', $key)->first();

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Paramètre non trouvé'
            ], 404);
        }

        // Logique de valeur par défaut selon la clé
        $defaults = [
            'app_name' => 'EduSphere',
            'app_version' => '1.0.0',
            'timezone' => 'UTC',
            'date_format' => 'Y-m-d',
            'currency' => 'USD',
            'items_per_page' => 15,
        ];

        $defaultValue = $defaults[$key] ?? null;

        if ($defaultValue === null) {
            return response()->json([
                'success' => false,
                'message' => 'Pas de valeur par défaut définie pour ce paramètre'
            ], 400);
        }

        $setting->update([
            'value' => is_string($defaultValue) ? $defaultValue : json_encode($defaultValue)
        ]);

        // Vider le cache
        $this->clearSettingsCache();

        return response()->json([
            'success' => true,
            'message' => 'Paramètre réinitialisé',
            'data' => $setting
        ]);
    }

    /**
     * Exporter tous les paramètres
     */
    public function export()
    {
        $settings = SystemSetting::all()->mapWithKeys(function ($setting) {
            return [$setting->key => $this->decodeValue($setting->value)];
        });

        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    /**
     * Importer des paramètres
     */
    public function import(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'settings' => 'required|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $imported = [];
        foreach ($request->settings as $key => $value) {
            $setting = SystemSetting::where('key', $key)->first();
            
            if ($setting) {
                $setting->update([
                    'value' => is_string($value) ? $value : json_encode($value)
                ]);
            } else {
                $setting = SystemSetting::create([
                    'key' => $key,
                    'value' => is_string($value) ? $value : json_encode($value)
                ]);
            }
            
            $imported[] = $setting;
        }

        // Vider le cache
        $this->clearSettingsCache();

        return response()->json([
            'success' => true,
            'message' => count($imported) . ' paramètres importés',
            'data' => $imported
        ]);
    }

    /**
     * Décoder une valeur JSON si nécessaire
     */
    private function decodeValue($value)
    {
        $decoded = json_decode($value, true);
        return (json_last_error() === JSON_ERROR_NONE) ? $decoded : $value;
    }

    /**
     * Vider le cache des paramètres
     */
    private function clearSettingsCache()
    {
        // Vider tous les caches liés aux settings
        $keys = Cache::get('settings_cache_keys', []);
        foreach ($keys as $key) {
            Cache::forget($key);
        }
        Cache::forget('system_settings_*');
    }
}