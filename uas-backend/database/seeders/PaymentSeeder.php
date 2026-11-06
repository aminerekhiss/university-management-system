<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Payment;
use App\Models\TuitionInvoice;
use Illuminate\Support\Str;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        // Get only invoices that are NOT overdue
        $invoices = TuitionInvoice::where('status', 'pending')->get();

        foreach ($invoices as $invoice) {
            // Create payment record
            Payment::create([
                'tuition_invoice_id' => $invoice->id,
                'amount' => $invoice->amount,
                'method' => 'card',
                'transaction_ref' => 'TX-' . Str::upper(Str::random(8)),
            ]);

            // Mark invoice as paid
            $invoice->update(['status' => 'paid']);
        }
    }
}
