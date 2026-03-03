<?php

namespace App\Http\Controllers\Api;

use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class SubscriptionPlanController extends Controller
{
    /**
     * Afficher les plans d'abonnement
     */
    public function index(Request $request)
    {
        $query = SubscriptionPlan::query();
        
        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }
        
        if ($request->has('billing_cycle')) {
            $query->where('billing_cycle', $request->billing_cycle);
        }
        
        $plans = $query->get();
        
        return response()->json([
            'success' => true,
            'data' => $plans
        ]);
    }

    /**
     * Créer un plan
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100|unique:subscription_plans,name',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'billing_cycle' => 'required|string',
            'max_students' => 'nullable|integer|min:0',
            'max_teachers' => 'nullable|integer|min:0',
            'max_staff' => 'nullable|integer|min:0',
            'features' => 'nullable|array',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $plan = SubscriptionPlan::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $plan
        ], 201);
    }

    /**
     * Afficher un plan
     */
    public function show($id)
    {
        $plan = SubscriptionPlan::with(['subscriptions'])->find($id);

        if (!$plan) {
            return response()->json([
                'success' => false,
                'message' => 'Plan non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $plan
        ]);
    }

    /**
     * Mettre à jour un plan
     */
    public function update(Request $request, $id)
    {
        $plan = SubscriptionPlan::find($id);

        if (!$plan) {
            return response()->json([
                'success' => false,
                'message' => 'Plan non trouvé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:100|unique:subscription_plans,name,' . $id,
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'billing_cycle' => 'sometimes|string',
            'max_students' => 'nullable|integer|min:0',
            'max_teachers' => 'nullable|integer|min:0',
            'max_staff' => 'nullable|integer|min:0',
            'features' => 'nullable|array',
            'is_active' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $plan->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $plan
        ]);
    }

    /**
     * Supprimer un plan
     */
    public function destroy($id)
    {
        $plan = SubscriptionPlan::find($id);

        if (!$plan) {
            return response()->json([
                'success' => false,
                'message' => 'Plan non trouvé'
            ], 404);
        }

        if ($plan->subscriptions()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer : des écoles utilisent ce plan'
            ], 409);
        }

        $plan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Plan supprimé'
        ]);
    }

    /**
     * Comparer les plans
     */
    public function compare()
    {
        $plans = SubscriptionPlan::where('is_active', true)->get();
        
        $comparison = [];
        foreach ($plans as $plan) {
            $comparison[] = [
                'id' => $plan->id,
                'name' => $plan->name,
                'price' => $plan->price,
                'billing_cycle' => $plan->billing_cycle,
                'max_students' => $plan->max_students,
                'max_teachers' => $plan->max_teachers,
                'features' => $plan->features
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $comparison
        ]);
    }
}