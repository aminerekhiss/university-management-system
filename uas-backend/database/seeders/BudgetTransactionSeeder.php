<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Budget;
use App\Models\Department;
use App\Models\BudgetTransaction;
use Carbon\Carbon;

class BudgetTransactionSeeder extends Seeder
{
    public function run(): void
    {
        // Fetch budgets by department code (SAFE)
        $financeBudget = Budget::whereHas('department', function($q) {
            $q->where('code', 'FIN');
        })->first();

        $itBudget = Budget::whereHas('department', function($q) {
            $q->where('code', 'IT');
        })->first();

        // Safety check
        if (!$financeBudget || !$itBudget) {
            throw new \Exception("Budgets for Finance or IT not found.");
        }

        // Finance Transactions
        BudgetTransaction::create([
            'budget_id' => $financeBudget->id,
            'type' => 'Income',
            'description' => 'Government Funding',
            'amount' => 200000,
            'transaction_date' => Carbon::now()->subDays(20),
        ]);

        BudgetTransaction::create([
            'budget_id' => $financeBudget->id,
            'type' => 'Expense',
            'description' => 'Scholarship Payments',
            'amount' => 35000,
            'transaction_date' => Carbon::now()->subDays(12),
        ]);

        // IT Transactions
        BudgetTransaction::create([
            'budget_id' => $itBudget->id,
            'type' => 'Expense',
            'description' => 'Software Licenses',
            'amount' => 15000,
            'transaction_date' => Carbon::now()->subDays(5),
        ]);
    }
}
