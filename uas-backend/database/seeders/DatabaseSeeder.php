<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            DepartmentSeeder::class,
            UserSeeder::class,
            StudentSeeder::class,
            StaffSeeder::class,
            TuitionInvoiceSeeder::class,
            BudgetSeeder::class,
            BudgetTransactionSeeder::class,
            PayrollSeeder::class,
            PaymentSeeder::class, 
        ]);
    }
}
