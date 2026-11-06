<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BudgetTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'budget_id',
        'type',
        'description',
        'amount',
        'transaction_date'
    ];

    public function budget()
    {
        return $this->belongsTo(Budget::class);
    }
}
