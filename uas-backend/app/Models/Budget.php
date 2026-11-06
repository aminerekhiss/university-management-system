<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Budget extends Model
{
    use HasFactory;

    protected $fillable = [
        'department_id',
        'fiscal_year',
        'allocated_amount',
        'spent_amount',
        'status'
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function transactions()
    {
        return $this->hasMany(BudgetTransaction::class);
    }
}
