<?php

namespace App\Http\Controllers\Api;

use App\Models\StudentInvoiceItem;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class StudentInvoiceItemController extends Controller
{
    public function index(Request $request)
    {
        $query = StudentInvoiceItem::with(['invoice', 'feeStructure']);
        
        if ($request->has('invoice_id')) {
            $query->where('invoice_id', $request->invoice_id);
        }
        
        $items = $query->get();
        
        return response()->json([
            'success' => true,
            'data' => $items
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'invoice_id' => 'required|exists:student_invoices,id',
            'fee_structure_id' => 'nullable|exists:fee_structures,id',
            'description' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'unit_price' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            $amount = $request->quantity * $request->unit_price;
            
            $item = StudentInvoiceItem::create(array_merge(
                $request->all(),
                ['amount' => $amount]
            ));

            // Mettre à jour le total de la facture
            $invoice = $item->invoice;
            $invoice->subtotal += $amount;
            $invoice->total_amount += $amount;
            $invoice->balance_amount += $amount;
            $invoice->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $item->load(['invoice', 'feeStructure'])
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

    public function show($id)
    {
        $item = StudentInvoiceItem::with(['invoice', 'feeStructure'])->find($id);
        
        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Ligne de facture non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $item
        ]);
    }

    public function update(Request $request, $id)
    {
        $item = StudentInvoiceItem::find($id);
        
        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Ligne de facture non trouvée'
            ], 404);
        }

        // Ne pas permettre la modification si la facture est payée
        if ($item->invoice->status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de modifier une facture payée'
            ], 409);
        }

        $validator = Validator::make($request->all(), [
            'description' => 'sometimes|string',
            'quantity' => 'sometimes|integer|min:1',
            'unit_price' => 'sometimes|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Soustraire l'ancien montant
            $item->invoice->subtotal -= $item->amount;
            $item->invoice->total_amount -= $item->amount;
            $item->invoice->balance_amount -= $item->amount;

            // Mettre à jour l'item
            $item->fill($request->all());
            $item->amount = $item->quantity * $item->unit_price;
            $item->save();

            // Ajouter le nouveau montant
            $item->invoice->subtotal += $item->amount;
            $item->invoice->total_amount += $item->amount;
            $item->invoice->balance_amount += $item->amount;
            $item->invoice->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $item
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $item = StudentInvoiceItem::find($id);
        
        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Ligne de facture non trouvée'
            ], 404);
        }

        // Ne pas permettre la suppression si la facture est payée
        if ($item->invoice->status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de modifier une facture payée'
            ], 409);
        }

        DB::beginTransaction();
        try {
            // Soustraire le montant de la facture
            $invoice = $item->invoice;
            $invoice->subtotal -= $item->amount;
            $invoice->total_amount -= $item->amount;
            $invoice->balance_amount -= $item->amount;
            $invoice->save();

            // Supprimer l'item
            $item->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Ligne supprimée'
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
}