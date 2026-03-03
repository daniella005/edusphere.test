<?php

namespace App\Http\Controllers\Api;

use App\Models\StudentInvoice;
use App\Models\Student;
use App\Models\FeeStructure;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StudentInvoiceController extends Controller
{
    /**
     * Afficher la liste des factures
     */
    public function index(Request $request)
    {
        $query = StudentInvoice::with(['student', 'term', 'items', 'payments']);
        
        // Filtres
        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('due_date_from') && $request->has('due_date_to')) {
            $query->whereBetween('due_date', [$request->due_date_from, $request->due_date_to]);
        }
        
        // Factures impayées
        if ($request->has('overdue')) {
            $query->where('status', '!=', 'paid')
                  ->where('due_date', '<', now());
        }
        
        $perPage = $request->get('per_page', 15);
        $invoices = $query->orderBy('created_at', 'desc')->paginate($perPage);
        
        return response()->json([
            'success' => true,
            'data' => $invoices
        ]);
    }

    /**
     * Créer une nouvelle facture
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:students,id',
            'academic_term_id' => 'required|exists:academic_terms,id',
            'items' => 'required|array|min:1',
            'items.*.fee_structure_id' => 'required|exists:fee_structures,id',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'due_date' => 'required|date|after:today',
            'notes' => 'nullable|string',
            'status' => 'sometimes|in:pending,paid,partially_paid,cancelled' // <--- Ajouté partially_paid
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Calculer les montants
            $subtotal = 0;
            foreach ($request->items as $item) {
                $subtotal += $item['quantity'] * $item['unit_price'];
            }
            
            // Appliquer les réductions éventuelles (à personnaliser)
            $discount = 0;
            $lateFee = 0;
            $tax = 0;
            $total = $subtotal - $discount + $lateFee + $tax;
            
            // Générer un numéro de facture unique
            $invoiceNumber = 'INV-' . date('Ymd') . '-' . strtoupper(Str::random(6));
            $generatedBy = auth()->user()->profile->id ?? null;
            
            // Créer la facture
            $invoice = StudentInvoice::create([
                'invoice_number' => $invoiceNumber,
                'student_id' => $request->student_id,
                'academic_term_id' => $request->academic_term_id,
                'subtotal' => $subtotal,
                'discount_amount' => $discount,
                'late_fee_amount' => $lateFee,
                'tax_amount' => $tax,
                'total_amount' => $total,
                'paid_amount' => 0,
                'balance_amount' => $total,
                'due_date' => $request->due_date,
                'status' => 'pending',
                'notes' => $request->notes,
                'generated_by' => $generatedBy,
            ]);

            // Créer les lignes de facture
            foreach ($request->items as $item) {
                $invoice->items()->create([
                    'fee_structure_id' => $item['fee_structure_id'],
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'amount' => $item['quantity'] * $item['unit_price']
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Facture créée avec succès',
                'data' => $invoice->load(['student', 'items'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la facture',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher une facture spécifique
     */
    public function show($id)
    {
        $invoice = StudentInvoice::with(['student', 'term', 'items', 'payments'])->find($id);

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
        $invoice = StudentInvoice::find($id);

        if (!$invoice) {
            return response()->json([
                'success' => false,
                'message' => 'Facture non trouvée'
            ], 404);
        }

        // Ne pas permettre la modification si déjà payée
        if ($invoice->status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de modifier une facture déjà payée'
            ], 409);
        }

        $validator = Validator::make($request->all(), [
            'due_date' => 'sometimes|date|after:today',
            'notes' => 'nullable|string',
            'status' => 'sometimes|in:pending,paid,cancelled'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $invoice->update($request->only(['due_date', 'notes', 'status']));

        return response()->json([
            'success' => true,
            'message' => 'Facture mise à jour avec succès',
            'data' => $invoice
        ]);
    }

    /**
     * Supprimer une facture
     */
    public function destroy($id)
    {
        $invoice = StudentInvoice::find($id);

        if (!$invoice) {
            return response()->json([
                'success' => false,
                'message' => 'Facture non trouvée'
            ], 404);
        }

        // Ne pas permettre la suppression si des paiements sont associés
        if ($invoice->payments()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer une facture avec des paiements'
            ], 409);
        }

        DB::beginTransaction();
        try {
            // Supprimer les lignes de facture
            $invoice->items()->delete();
            // Supprimer la facture
            $invoice->delete();
            
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Facture supprimée avec succès'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les factures d'un étudiant
     */
    public function studentInvoices($studentId)
    {
        $student = Student::find($studentId);
        
        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Étudiant non trouvé'
            ], 404);
        }

        $invoices = StudentInvoice::where('student_id', $studentId)
            ->with(['term', 'payments'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $invoices
        ]);
    }

    /**
     * Obtenir le solde d'un étudiant
     */
    public function balance($studentId)
    {
        $student = Student::find($studentId);
        
        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Étudiant non trouvé'
            ], 404);
        }

        $totalInvoiced = StudentInvoice::where('student_id', $studentId)
            ->where('status', '!=', 'cancelled')
            ->sum('total_amount');
            
        $totalPaid = StudentInvoice::where('student_id', $studentId)
            ->where('status', '!=', 'cancelled')
            ->sum('paid_amount');
            
        // Version optimisée
        $balance = StudentInvoice::where('student_id', $studentId)
            ->where('status', '!=', 'cancelled')
            ->sum('balance_amount');
        
        $overdueInvoices = StudentInvoice::where('student_id', $studentId)
            ->where('status', 'pending')
            ->where('due_date', '<', now())
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'student_id' => $studentId,
                'total_invoiced' => $totalInvoiced,
                'total_paid' => $totalPaid,
                'balance' => $balance,
                'overdue_count' => $overdueInvoices->count(),
                'overdue_amount' => $overdueInvoices->sum('balance_amount')
            ]
        ]);
    }
}