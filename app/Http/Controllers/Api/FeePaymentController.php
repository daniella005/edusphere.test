<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FeePayment;
use App\Models\StudentInvoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class FeePaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = FeePayment::with(['student', 'invoice', 'receivedBy']);

        if ($request->has('student_id')) $query->where('student_id', $request->student_id);
        if ($request->has('payment_method')) $query->where('payment_method', $request->payment_method);

        return response()->json([
            'success' => true,
            'data' => $query->orderBy('payment_date', 'desc')->get()
        ]);
    }

    public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'invoice_id' => 'required|exists:student_invoices,id',
        'amount' => 'required|numeric|min:1',
        'payment_method' => 'required|string',
        'payment_date' => 'required|date',
        'payment_reference' => 'nullable|string',
        'received_by' => 'nullable|exists:profiles,id', // On permet de l'envoyer manuellement pour le test
        'notes' => 'nullable|string'
    ]);

    if ($validator->fails()) {
        return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
    }

    $invoice = StudentInvoice::findOrFail($request->invoice_id);

    if ($invoice->balance_amount <= 0) {
        return response()->json(['success' => false, 'message' => 'Cette facture est déjà soldée.'], 400);
    }

    DB::beginTransaction();
    try {
        // LOGIQUE DE RÉCUPÉRATION DU PROFIL :
        // 1. On regarde si received_by est dans le JSON (utile pour tes tests Postman)
        // 2. Sinon on regarde l'utilisateur connecté
        $profileId = $request->received_by ?? (auth()->user()->profile->id ?? null);

        if (!$profileId) {
            return response()->json([
                'success' => false, 
                'message' => 'Impossible d\'identifier l\'auteur du paiement (Profil manquant).'
            ], 403);
        }

        $payment = FeePayment::create([
            'receipt_number' => 'RCP-' . strtoupper(Str::random(8)),
            'invoice_id' => $invoice->id,
            'student_id' => $invoice->student_id,
            'amount' => $request->amount,
            'payment_method' => $request->payment_method,
            'payment_date' => $request->payment_date,
            'payment_reference' => $request->payment_reference,
            'received_by' => $profileId,
            'status' => 'paid',
            'notes' => $request->notes
        ]);

        // Mise à jour de la facture
        $invoice->refreshTotals(); 

        DB::commit();
        
        $invoice->refresh(); 

        return response()->json([
            'success' => true,
            'message' => 'Paiement enregistré avec succès',
            'receipt_number' => $payment->receipt_number,
            'new_balance' => $invoice->balance_amount
        ], 201);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
    }
}

    public function show($id)
    {
        $payment = FeePayment::with(['invoice', 'student', 'receivedBy'])->find($id);
        if (!$payment) return response()->json(['success' => false, 'message' => 'Paiement non trouvé'], 404);
        return response()->json(['success' => true, 'data' => $payment]);
    }
}