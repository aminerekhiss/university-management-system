<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'user_id',
        'student_code',
        'program',
        'level',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tuitionInvoices()
    {
        return $this->hasMany(TuitionInvoice::class);
    }
}
