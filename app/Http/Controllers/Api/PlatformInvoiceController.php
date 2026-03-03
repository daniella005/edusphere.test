<?php

namespace App\Http\Controllers\Api;

use App\Models\PlatformInvoice;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PlatformInvoiceController extends Controller
{
    /**
     * Afficher les factures plateforme
     */
    public function index(Request $request)
    {
        $query = PlatformInvoice::with(['school', 'subscription']);
        
        if ($request->has('school_id')) {
            $query->where('school_id', $request->school_id);
        }
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('due_date_from') && $request->has('due_date_to')) {
            $query->whereBetween('due_date', [$request->due_date_from, $request->due_date_to]);
        }
        
        $invoices = $query->orderBy('created_at', 'desc')->paginate(15);
        
        return response()->json([
            'success' => true,
            'data' => $invoices
        ]);
    }

    /**
     * Créer une facture
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'school_id' => 'required|exists:schools,id',
            'subscription_id' => 'nullable|exists:school_subscriptions,id',
            'amount' => 'required|numeric|min:0',
            'tax_amount' => 'nullable|numeric|min:0',
            'due_date' => 'required|date|after:today',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            $totalAmount = $request->amount + ($request->tax_amount ?? 0);
            
            $invoiceNumber = 'PINV-' . date('Ymd') . '-' . strtoupper(Str::random(8));
            
            $invoice = PlatformInvoice::create([
                'invoice_number' => $invoiceNumber,
                'school_id' => $request->school_id,
                'subscription_id' => $request->subscription_id,
                'amount' => $request->amount,
                'tax_amount' => $request->tax_amount ?? 0,
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'due_date' => $request->due_date,
                'notes' => $request->notes
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $invoice->load(['school', 'subscription'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher une facture
     */
    public function show($id)
    {
        $invoice = PlatformInvoice::with(['school', 'subscription.plan'])->find($id);

        if (!$invoice) {
            return response()->json([
                'success' => false,
                'message' => 'Facture non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $invoice
        ]);
    }

    /**
     * Mettre à jour une facture
     */
    public function update(Request $request, $id)
    {
        $invoice = PlatformInvoice::find($id);

        if (!$invoice) {
            return response()->json([
                'success' => false,
                'message' => 'Facture non trouvée'
            ], 404);
        }

        if ($invoice->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Seules les factures en attente peuvent être modifiées'
            ], 409);
        }

        $validator = Validator::make($request->all(), [
            'due_date' => 'sometimes|date|after:today',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $invoice->update($request->only(['due_date', 'notes']));

        return response()->json([
            'success' => true,
            'data' => $invoice
        ]);
    }

    /**
     * Marquer comme payée
     */
    public function markAsPaid(Request $request, $id)
    {
        $invoice = PlatformInvoice::find($id);

        if (!$invoice) {
            return response()->json([
                'success' => false,
                'message' => 'Facture non trouvée'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'payment_method' => 'required|string',
            'payment_reference' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        if ($invoice->status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Facture déjà payée'
            ], 409);
        }

        $invoice->update([
            'status' => 'paid',
            'paid_at' => now(),
            'payment_method' => $request->payment_method,
            'payment_reference' => $request->payment_reference
        ]);

        // Si la facture est liée à un abonnement, mettre à jour l'abonnement
        if ($invoice->subscription_id) {
            $subscription = $invoice->subscription;
            $subscription->update([
                'status' => 'active',
                'next_billing_date' => $this->calculateNextBillingDate($subscription->billing_cycle)
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Facture marquée comme payée',
            'data' => $invoice
        ]);
    }

    /**
     * Annuler une facture
     */
    public function cancel($id)
    {
        $invoice = PlatformInvoice::find($id);

        if (!$invoice) {
            return response()->json([
                'success' => false,
                'message' => 'Facture non trouvée'
            ], 404);
        }

        if ($invoice->status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Impossible d\'annuler une facture payée'
            ], 409);
        }

        $invoice->update([
            'status' => 'cancelled'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Facture annulée'
        ]);
    }

    /**
     * Obtenir les factures en retard
     */
    public function overdue()
    {
        $invoices = PlatformInvoice::where('status', 'pending')
            ->where('due_date', '<', now())
            ->with(['school'])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $invoices
        ]);
    }

    /**
     * Obtenir les statistiques
     */
    public function stats(Request $request)
    {
        $year = $request->get('year', now()->year);
        
        $stats = [
            'total_pending' => PlatformInvoice::where('status', 'pending')->sum('total_amount'),
            'total_overdue' => PlatformInvoice::where('status', 'pending')
                ->where('due_date', '<', now())
                ->sum('total_amount'),
            'total_paid' => PlatformInvoice::where('status', 'paid')
                ->whereYear('paid_at', $year)
                ->sum('total_amount'),
            'monthly' => []
        ];

        for ($month = 1; $month <= 12; $month++) {
            $stats['monthly'][$month] = PlatformInvoice::where('status', 'paid')
                ->whereYear('paid_at', $year)
                ->whereMonth('paid_at', $month)
                ->sum('total_amount');
        }

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    private function calculateNextBillingDate($billingCycle)
    {
        switch ($billingCycle) {
            case 'monthly':
                return now()->addMonth();
            case 'quarterly':
                return now()->addMonths(3);
            case 'yearly':
                return now()->addYear();
            default:
                return now()->addMonth();
        }
    }
}