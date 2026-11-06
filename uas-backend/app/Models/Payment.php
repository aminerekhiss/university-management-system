<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'tuition_invoice_id',
        'amount',
        'method',
        'transaction_ref'
    ];

    public function invoice()
    {
        return $this->belongsTo(TuitionInvoice::class, 'tuition_invoice_id');
    }
}
