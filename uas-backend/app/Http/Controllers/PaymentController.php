<?php

namespace App\Http\Controllers;

use App\Models\TuitionInvoice;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PaymentController extends Controller
{
    /* =====================================================
       PAY INVOICE
    ======================================================*/
    public function pay(Request $request)
    {
        try {
            // Validate input
            $validated = $request->validate([
                'invoice_id' => 'required|exists:tuition_invoices,id'
            ]);

            $invoice = TuitionInvoice::find($validated['invoice_id']);

            if (!$invoice) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invoice not found'
                ], 404);
            }

            if ($invoice->status === 'paid') {
                return response()->json([
                    'success' => false,
                    'message' => 'Invoice is already paid'
                ], 400);
            }

            // Update invoice
            $invoice->update([
                'status' => 'paid'
            ]);

            // Create payment record
            $payment = Payment::create([
                'tuition_invoice_id' => $invoice->id,
                'amount'            => $invoice->amount,
                'method'            => 'card',
                'transaction_ref'   => 'TXN-' . strtoupper(uniqid()),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment processed successfully',
                'invoice' => $invoice,
                'payment' => $payment
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }


    /* =====================================================
       GENERIC ERROR HANDLER
    ======================================================*/
    private function serverError($e)
    {
        return response()->json([
            'success' => false,
            'message' => 'Server error occurred',
            'error'   => $e->getMessage()
        ], 500);
    }
}
