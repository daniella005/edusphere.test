<?php

namespace App\Http\Controllers\Api;

use App\Models\GradeScale;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB; // <-- AJOUTE CETTE LIGNE

class GradeScaleController extends Controller
{
    /**
     * Afficher les échelles de notation
     */
    public function index(Request $request)
    {
        $query = GradeScale::with(['school']);
        
        if ($request->has('school_id')) {
            $query->where('school_id', $request->school_id);
        }
        
        if ($request->has('is_default')) {
            $query->where('is_default', $request->is_default);
        }
        
        $scales = $query->get();
        
        return response()->json([
            'success' => true,
            'data' => $scales
        ]);
    }

    /**
     * Créer une échelle
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'school_id' => 'required|exists:schools,id',
            'name' => 'required|string|max:100',
            'is_default' => 'boolean',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $exists = GradeScale::where('school_id', $request->school_id)
            ->where('name', $request->name)
            ->exists();
            
        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Une échelle avec ce nom existe déjà'
            ], 409);
        }

        DB::beginTransaction();
        try {
            if ($request->is_default) {
                GradeScale::where('school_id', $request->school_id)
                    ->update(['is_default' => false]);
            }

            $scale = GradeScale::create($request->all());

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $scale
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher une échelle
     */
    public function show($id)
    {
        $scale = GradeScale::with(['school', 'entries'])->find($id);

        if (!$scale) {
            return response()->json([
                'success' => false,
                'message' => 'Échelle non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $scale
        ]);
    }

    /**
     * Mettre à jour une échelle
     */
    public function update(Request $request, $id)
    {
        $scale = GradeScale::find($id);

        if (!$scale) {
            return response()->json([
                'success' => false,
                'message' => 'Échelle non trouvée'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:100',
            'is_default' => 'sometimes|boolean',
            'is_active' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            if ($request->is_default) {
                GradeScale::where('school_id', $scale->school_id)
                    ->update(['is_default' => false]);
            }

            $scale->update($request->all());

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $scale
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer une échelle
     */
    public function destroy($id)
    {
        $scale = GradeScale::find($id);

        if (!$scale) {
            return response()->json([
                'success' => false,
                'message' => 'Échelle non trouvée'
            ], 404);
        }

        if ($scale->entries()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Supprimez d\'abord les entrées de cette échelle'
            ], 409);
        }

        $scale->delete();

        return response()->json([
            'success' => true,
            'message' => 'Échelle supprimée'
        ]);
    }

    /**
     * Obtenir l'échelle par défaut d'une école
     */
    public function default($schoolId)
    {
        $scale = GradeScale::where('school_id', $schoolId)
            ->where('is_default', true)
            ->with(['entries'])
            ->first();

        if (!$scale) {
            $scale = GradeScale::where('school_id', $schoolId)
                ->where('is_active', true)
                ->with(['entries'])
                ->first();
        }

        if (!$scale) {
            return response()->json([
                'success' => false,
                'message' => 'Aucune échelle trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $scale
        ]);
    }
}