<?php

namespace App\Http\Controllers\Api;

use App\Models\SchoolSetting;
use App\Models\School;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class SchoolSettingController extends Controller
{
    /**
     * Afficher les paramètres d'une école
     */
   public function index(Request $request)
{
    // On change 'required' en 'nullable'
    $validator = Validator::make($request->all(), [
        'school_id' => 'nullable|exists:schools,id'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'errors' => $validator->errors()
        ], 422);
    }

    $query = SchoolSetting::query();

    // On filtre seulement si le school_id est présent dans la requête
    if ($request->has('school_id')) {
        $query->where('school_id', $request->school_id);
    }

    $settings = $query->get();

    return response()->json([
        'success' => true,
        'data' => $settings
    ]);
}

    /**
     * Créer un paramètre d'école
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'school_id' => 'required|exists:schools,id',
            'key' => 'required|string|max:100',
            'value' => 'required',
            'description' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Vérifier l'unicité
        $exists = SchoolSetting::where('school_id', $request->school_id)
            ->where('key', $request->key)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Ce paramètre existe déjà pour cette école'
            ], 409);
        }

        // Convertir la valeur en JSON si nécessaire
        $value = is_string($request->value) ? $request->value : json_encode($request->value);

        $setting = SchoolSetting::create([
            'school_id' => $request->school_id,
            'key' => $request->key,
            'value' => $value,
            'description' => $request->description,
            'updated_by' => auth()->id()
        ]);

        return response()->json([
            'success' => true,
            'data' => $setting
        ], 201);
    }

    /**
     * Afficher un paramètre spécifique
     */
    public function show($schoolId, $key)
    {
        $setting = SchoolSetting::where('school_id', $schoolId)
            ->where('key', $key)
            ->first();

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Paramètre non trouvé'
            ], 404);
        }

        // Décoder la valeur JSON
        $setting->value = $this->decodeValue($setting->value);

        return response()->json([
            'success' => true,
            'data' => $setting
        ]);
    }

    /**
     * Mettre à jour un paramètre
     */
    public function update(Request $request, $id)
    {
        $setting = SchoolSetting::find($id);

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Paramètre non trouvé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'value' => 'required',
            'description' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $value = is_string($request->value) ? $request->value : json_encode($request->value);

        $setting->update([
            'value' => $value,
            'description' => $request->description ?? $setting->description,
            'updated_by' => auth()->id()
        ]);

        return response()->json([
            'success' => true,
            'data' => $setting
        ]);
    }

    /**
     * Supprimer un paramètre
     */
    public function destroy($id)
    {
        $setting = SchoolSetting::find($id);

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Paramètre non trouvé'
            ], 404);
        }

        $setting->delete();

        return response()->json([
            'success' => true,
            'message' => 'Paramètre supprimé'
        ]);
    }

    /**
     * Obtenir les paramètres d'une école sous forme de tableau clé-valeur
     */
    public function schoolSettings($schoolId)
    {
        $school = School::find($schoolId);

        if (!$school) {
            return response()->json([
                'success' => false,
                'message' => 'École non trouvée'
            ], 404);
        }

        $settings = SchoolSetting::where('school_id', $schoolId)
            ->get()
            ->mapWithKeys(function ($setting) {
                return [$setting->key => $this->decodeValue($setting->value)];
            });

        // Ajouter les paramètres par défaut de l'école
        $defaults = [
            'timezone' => $school->timezone,
            'currency' => $school->currency,
            'school_name' => $school->name,
            'school_code' => $school->code,
            'school_email' => $school->email,
        ];

        $settings = array_merge($defaults, $settings->toArray());

        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    /**
     * Mettre à jour plusieurs paramètres à la fois
     */
    public function bulkUpdate(Request $request, $schoolId)
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

        $school = School::find($schoolId);
        if (!$school) {
            return response()->json([
                'success' => false,
                'message' => 'École non trouvée'
            ], 404);
        }

        $updated = [];
        foreach ($request->settings as $key => $value) {
            $setting = SchoolSetting::where('school_id', $schoolId)
                ->where('key', $key)
                ->first();

            $valueJson = is_string($value) ? $value : json_encode($value);

            if ($setting) {
                $setting->update([
                    'value' => $valueJson,
                    'updated_by' => auth()->id()
                ]);
            } else {
                $setting = SchoolSetting::create([
                    'school_id' => $schoolId,
                    'key' => $key,
                    'value' => $valueJson,
                    'updated_by' => auth()->id()
                ]);
            }

            $updated[] = $setting;
        }

        return response()->json([
            'success' => true,
            'message' => count($updated) . ' paramètres mis à jour',
            'data' => $updated
        ]);
    }

    /**
     * Réinitialiser les paramètres d'une école aux valeurs par défaut
     */
    public function reset($schoolId)
    {
        $school = School::find($schoolId);
        if (!$school) {
            return response()->json([
                'success' => false,
                'message' => 'École non trouvée'
            ], 404);
        }

        // Supprimer tous les paramètres personnalisés
        SchoolSetting::where('school_id', $schoolId)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Paramètres réinitialisés'
        ]);
    }

    /**
     * Décoder une valeur JSON
     */
    private function decodeValue($value)
    {
        $decoded = json_decode($value, true);
        return (json_last_error() === JSON_ERROR_NONE) ? $decoded : $value;
    }
}