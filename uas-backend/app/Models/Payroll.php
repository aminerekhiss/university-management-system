<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payroll extends Model
{
    use HasFactory;

    protected $fillable = [
        'staff_id',
        'month',
        'year',
        'basic_salary',
        'allowances',
        'deductions',
        'net_salary',
        'status'
    ];

    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }
}
