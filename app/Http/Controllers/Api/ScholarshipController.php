<?php

namespace App\Http\Controllers\Api;

use App\Models\Scholarship;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class ScholarshipController extends Controller
{
    public function index(Request $request)
    {
        $query = Scholarship::where('school_id', $request->header('X-School-Id'));
        
        if ($request->has('active')) {
            $query->where('is_active', $request->active);
        }

        return response()->json([
            'success' => true,
            'data' => $query->get()
        ]);
    }

   public function store(Request $request)
{
    // 1. Validation des données du corps de la requête
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'discount_type' => 'required|in:percentage,fixed',
        'discount_value' => 'required|numeric|min:0',
        'applicable_fee_categories' => 'nullable|array',
        'max_recipients' => 'nullable|integer|min:1',
    ]);

    if ($validator->fails()) {
        return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
    }

    // 2. Récupération et vérification du Header
    $schoolId = $request->header('X-School-Id');
    if (!$schoolId) {
        return response()->json(['success' => false, 'message' => 'Header X-School-Id manquant'], 400);
    }

    // 3. CRÉATION (La ligne qui manquait !)
    // On fusionne les données du formulaire avec l'ID récupéré dans le header
    $scholarship = Scholarship::create(array_merge(
        $request->all(),
        ['school_id' => $schoolId]
    ));

    // 4. Réponse
    return response()->json(['success' => true, 'data' => $scholarship], 201);
}
}