<?php

namespace Database\Seeders;

use App\Models\Budget;
use App\Models\Department;
use Illuminate\Database\Seeder;

class BudgetSeeder extends Seeder
{
    public function run(): void
    {
        Budget::create([
            'department_id' => Department::where('code', 'FIN')->first()->id,
            'fiscal_year' => 2025,
            'allocated_amount' => 500000,
            'spent_amount' => 200000,
            'status' => 'open'
        ]);

        Budget::create([
            'department_id' => Department::where('code', 'IT')->first()->id,
            'fiscal_year' => 2025,
            'allocated_amount' => 300000,
            'spent_amount' => 120000,
            'status' => 'open'
        ]);
    }
}
