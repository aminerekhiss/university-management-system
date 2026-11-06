<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Department extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'code'];

 

    public function staff()
    {
        return $this->hasMany(Staff::class);
    }

    public function budgets()
    {
        return $this->hasMany(Budget::class);
    }
}
