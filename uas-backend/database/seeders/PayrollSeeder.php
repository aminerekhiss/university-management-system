<?php

namespace Database\Seeders;

use App\Models\Payroll;
use App\Models\Staff;
use Illuminate\Database\Seeder;

class PayrollSeeder extends Seeder
{
    public function run(): void
    {
        $staff = Staff::all();

        foreach ($staff as $s) {
            Payroll::create([
                'staff_id' => $s->id,
                'month' => 12,
                'year' => 2025,
                'basic_salary' => $s->base_salary,
                'allowances' => 1000,
                'deductions' => 500,
                'net_salary' => ($s->base_salary + 1000 - 500),
                'status' => 'processed'
            ]);
        }
    }
}
