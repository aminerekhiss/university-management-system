<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TuitionInvoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'name',
        'amount',
        'due_date',
        'status'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
