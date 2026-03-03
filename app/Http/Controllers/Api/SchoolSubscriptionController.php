<?php

namespace App\Http\Controllers\Api;

use App\Models\SchoolSubscription;
use App\Models\SubscriptionPlan; // Ajouté pour plus de clarté
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SchoolSubscriptionController extends Controller
{
    /**
     * Afficher les abonnements
     */
    public function index(Request $request)
    {
        $query = SchoolSubscription::with(['school', 'plan']);
        
        if ($request->has('school_id')) {
            $query->where('school_id', $request->school_id);
        }
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        $subscriptions = $query->orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $subscriptions
        ]);
    }

    /**
     * Créer un abonnement
     */
   
public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'school_id' => 'required|exists:schools,id',
            'plan_id' => 'required|exists:subscription_plans,id',
            'start_date' => 'required|date', 
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $plan = SubscriptionPlan::findOrFail($request->plan_id);
        
        $startDate = Carbon::parse($request->start_date);
        // Utilisation de la fonction unique et corrigée
        $endDate = $this->calculateEndDate($plan->billing_cycle, $startDate);

        $subscription = SchoolSubscription::create([
            'school_id' => $request->school_id,
            'plan_id' => $plan->id,
            'status' => 'active',
            'amount' => $plan->price,
            'billing_cycle' => $plan->billing_cycle,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'next_billing_date' => $endDate,
        ]);

        return response()->json(['success' => true, 'data' => $subscription], 201);
    }


    /**
     * Afficher un abonnement
     */
    public function show($id)
    {
        $subscription = SchoolSubscription::with(['school', 'plan', 'invoices'])
            ->find($id);

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'Abonnement non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $subscription
        ]);
    }

    /**
     * Mettre à jour un abonnement
     */
    public function update(Request $request, $id)
    {
        $subscription = SchoolSubscription::find($id);

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'Abonnement non trouvé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'sometimes|string',
            'end_date' => 'nullable|date',
            'next_billing_date' => 'nullable|date'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $subscription->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $subscription
        ]);
    }

    /**
     * Obtenir l'abonnement actuel d'une école
     */
    public function current($schoolId)
    {
        $subscription = SchoolSubscription::where('school_id', $schoolId)
            ->whereIn('status', ['active', 'trial'])
            ->with(['plan'])
            ->first();

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'Aucun abonnement actif trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $subscription
        ]);
    }

    /**
     * Suspendre un abonnement
     */
    public function suspend($id)
    {
        $subscription = SchoolSubscription::find($id);

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'Abonnement non trouvé'
            ], 404);
        }

        if (!in_array($subscription->status, ['active', 'trial'])) {
            return response()->json([
                'success' => false,
                'message' => 'Seuls les abonnements actifs peuvent être suspendus'
            ], 409);
        }

        $subscription->update([
            'status' => 'suspended'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Abonnement suspendu'
        ]);
    }

    /**
     * Réactiver un abonnement
     */
    public function reactivate($id)
    {
        $subscription = SchoolSubscription::find($id);

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'Abonnement non trouvé'
            ], 404);
        }

        if ($subscription->status !== 'suspended') {
            return response()->json([
                'success' => false,
                'message' => 'Seuls les abonnements suspendus peuvent être réactivés'
            ], 409);
        }

        $subscription->update([
            'status' => 'active'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Abonnement réactivé'
        ]);
    }

    /**
     * Annuler un abonnement
     */
    public function cancel($id)
    {
        $subscription = SchoolSubscription::find($id);

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'Abonnement non trouvé'
            ], 404);
        }

        if (in_array($subscription->status, ['cancelled', 'expired'])) {
            return response()->json([
                'success' => false,
                'message' => 'Abonnement déjà terminé'
            ], 409);
        }

        $subscription->update([
            'status' => 'cancelled',
            'cancelled_at' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Abonnement annulé'
        ]);
    }

    /**
     * Renouveler un abonnement
     */
    public function renew($id)
    {
        $subscription = SchoolSubscription::find($id);

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'Abonnement non trouvé'
            ], 404);
        }

        if ($subscription->status === 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Abonnement déjà actif'
            ], 409);
        }

        $newEndDate = $this->calculateEndDate($subscription->billing_cycle);

        $subscription->update([
            'status' => 'active',
            'start_date' => now(),
            'end_date' => $newEndDate,
            'next_billing_date' => $newEndDate,
            'cancelled_at' => null
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Abonnement renouvelé',
            'data' => $subscription
        ]);
    }
     
    private function calculateEndDate($billingCycle, $startDate = null)
    {
        $date = $startDate ? Carbon::parse($startDate) : now();
        
        return match ($billingCycle) {
            'monthly' => $date->copy()->addMonth(),
            'quarterly' => $date->copy()->addMonths(3),
            'yearly' => $date->copy()->addYear(),
            default => $date->copy()->addMonth(),
        };
    }
       
    /**
     * Changer de plan
     */
    public function changePlan(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'plan_id' => 'required|exists:subscription_plans,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $subscription = SchoolSubscription::find($id);

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'Abonnement non trouvé'
            ], 404);
        }

        $newPlan = SubscriptionPlan::find($request->plan_id);

        DB::beginTransaction();
        try {
            // Mettre à jour l'abonnement
            $subscription->update([
                'plan_id' => $newPlan->id,
                'amount' => $newPlan->price,
                'billing_cycle' => $newPlan->billing_cycle
            ]);

            // Créer une facture pour le prorata
            // Logique de prorata ici

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Plan changé avec succès',
                'data' => $subscription->load('plan')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du changement de plan',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}