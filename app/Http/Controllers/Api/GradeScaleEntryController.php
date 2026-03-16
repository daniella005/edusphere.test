<?php

namespace App\Http\Controllers\Api;

use App\Models\GradeScaleEntry;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class GradeScaleEntryController extends Controller
{
    /**
     * Afficher les entrées d'une échelle
     */
    // Dans GradeScaleEntryController.php
public function index(Request $request)
{
    $query = GradeScaleEntry::with(['gradeScale']);

    if ($request->filled('grade_scale_id')) {
        $query->where('grade_scale_id', $request->grade_scale_id);
    }

    // Ajout d'une pagination ou d'un get()
    $entries = $query->orderBy('minimum_score', 'desc')->get(); // Trie du plus haut au plus bas (souvent mieux pour les bulletins)

    return response()->json(['success' => true, 'data' => $entries]);
}
    /**
     * Créer une entrée
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'grade_scale_id' => 'required|exists:grade_scales,id',
            'grade_name'     => 'required|string|max:10',
            'minimum_score'  => 'required|numeric|min:0|max:100',
            'maximum_score'  => 'required|numeric|min:0|max:100|gte:minimum_score',
            'grade_points'   => 'required|numeric|min:0',
            'description'    => 'nullable|string|max:100'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        if ($this->checkOverlap($request->grade_scale_id, $request->minimum_score, $request->maximum_score)) {
            return response()->json([
                'success' => false,
                'message' => 'Cette plage de score chevauche une entrée existante'
            ], 409);
        }

        $entry = GradeScaleEntry::create($request->all());

        return response()->json(['success' => true, 'data' => $entry], 201);
    }

    /**
     * Mettre à jour une entrée
     */
    public function update(Request $request, $id)
    {
        $entry = GradeScaleEntry::find($id);

        if (!$entry) {
            return response()->json(['success' => false, 'message' => 'Entrée non trouvée'], 404);
        }

        $validator = Validator::make($request->all(), [
            'grade_name'    => 'sometimes|string|max:10',
            'minimum_score' => 'sometimes|numeric|min:0|max:100',
            'maximum_score' => 'sometimes|numeric|min:0|max:100|gte:minimum_score',
            'grade_points'  => 'sometimes|numeric|min:0',
            'description'   => 'nullable|string|max:100'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        if ($request->has('minimum_score') || $request->has('maximum_score')) {
            $min = $request->minimum_score ?? $entry->minimum_score;
            $max = $request->maximum_score ?? $entry->maximum_score;

            if ($this->checkOverlap($entry->grade_scale_id, $min, $max, $id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cette plage de score chevauche une entrée existante'
                ], 409);
            }
        }

        $entry->update($request->all());

        return response()->json(['success' => true, 'data' => $entry]);
    }

    /**
     * Logique de vérification des chevauchements (Overlap)
     */
    private function checkOverlap($gradeScaleId, $min, $max, $excludeId = null)
    {
        $query = GradeScaleEntry::where('grade_scale_id', $gradeScaleId)
            ->where(function ($q) use ($min, $max) {
                $q->whereBetween('minimum_score', [$min, $max])
                  ->orWhereBetween('maximum_score', [$min, $max])
                  ->orWhere(function ($q2) use ($min, $max) {
                      $q2->where('minimum_score', '<=', $min)
                         ->where('maximum_score', '>=', $max);
                  });
            });

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }

    /**
     * Supprimer une entrée
     */
    public function destroy($id)
    {
        $entry = GradeScaleEntry::find($id);
        if (!$entry) {
            return response()->json(['success' => false, 'message' => 'Entrée non trouvée'], 404);
        }
        $entry->delete();
        return response()->json(['success' => true, 'message' => 'Entrée supprimée']);
    }

    /**
     * Obtenir la note correspondant à un score
     */
    public function getGrade(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'grade_scale_id' => 'required|exists:grade_scales,id',
            'score' => 'required|numeric|min:0|max:100'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $entry = GradeScaleEntry::where('grade_scale_id', $request->grade_scale_id)
            ->where('minimum_score', '<=', $request->score)
            ->where('maximum_score', '>=', $request->score)
            ->first();

        if (!$entry) {
            return response()->json(['success' => false, 'message' => 'Aucune note trouvée'], 404);
        }

        return response()->json(['success' => true, 'data' => $entry]);
    }

/**
 * Créer plusieurs entrées à la fois
 */
public function bulkStore(Request $request)
{
    $validator = Validator::make($request->all(), [
        'grade_scale_id' => 'required|exists:grade_scales,id',
        'entries' => 'required|array|min:1',
        'entries.*.grade_name' => 'required|string|max:10',
        'entries.*.minimum_score' => 'required|numeric|min:0|max:100',
        'entries.*.maximum_score' => 'required|numeric|min:0|max:100|gte:entries.*.minimum_score',
        'entries.*.grade_points' => 'required|numeric|min:0',
        'entries.*.description' => 'nullable|string|max:100'
    ]);

    if ($validator->fails()) {
        return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
    }

    DB::beginTransaction();
    try {
        // 1. Vérifier les chevauchements entre les nouvelles entrées du tableau
        $entries = $request->entries;
        for ($i = 0; $i < count($entries); $i++) {
            for ($j = $i + 1; $j < count($entries); $j++) {
                if ($this->rangesOverlap($entries[$i], $entries[$j])) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => 'Les plages de score se chevauchent entre elles dans votre liste.'
                    ], 409);
                }
            }
        }

        // 2. Vérifier les chevauchements avec la base de données et insérer
        $created = [];
        foreach ($entries as $entryData) {
            if ($this->checkOverlap($request->grade_scale_id, $entryData['minimum_score'], $entryData['maximum_score'])) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => "Le score {$entryData['minimum_score']}-{$entryData['maximum_score']} chevauche une entrée déjà existante."
                ], 409);
            }

            $created[] = GradeScaleEntry::create([
                'grade_scale_id' => $request->grade_scale_id,
                'grade_name'     => $entryData['grade_name'],
                'minimum_score'  => $entryData['minimum_score'],
                'maximum_score'  => $entryData['maximum_score'],
                'grade_points'   => $entryData['grade_points'],
                'description'    => $entryData['description'] ?? null
            ]);
        }

        DB::commit();
        return response()->json(['success' => true, 'message' => count($created) . ' entrées créées', 'data' => $created], 201);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['success' => false, 'message' => 'Erreur technique', 'error' => $e->getMessage()], 500);
    }
}

/**
 * Utilitaire pour comparer deux plages de scores
 */
private function rangesOverlap($range1, $range2)
{
    return !($range1['maximum_score'] < $range2['minimum_score'] || $range1['minimum_score'] > $range2['maximum_score']);
}

}