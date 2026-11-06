<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use App\Models\TuitionInvoice;
use App\Models\Payment;
use App\Models\Staff;
use App\Models\Payroll;
use App\Models\Budget;
use App\Models\BudgetTransaction;
use Carbon\Carbon;

class StaffController extends Controller
{
    /* ============================================================
       TUITION INVOICES
    ============================================================ */

    public function listInvoices()
    {
        try {
            return response()->json([
                'success' => true,
                'invoices' => TuitionInvoice::with('student.user')->get()
            ]);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    public function createInvoice(Request $request)
    {
        try {
            $data = $request->validate([
                'student_id' => 'required|exists:students,id',
                'name'       => 'required|string',
                'amount'     => 'required|numeric|min:1',
                'due_date'   => 'required|date',
            ]);

            $invoice = TuitionInvoice::create([
                ...$data,
                'status' => 'pending'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Invoice created successfully',
                'invoice' => $invoice
            ]);

        } catch (ValidationException $e) {
            return $this->validationError($e);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    public function updateInvoice(Request $request, $id)
    {
        try {
            $invoice = TuitionInvoice::find($id);

            if (!$invoice) {
                return $this->notFound("Invoice not found");
            }

            $invoice->update($request->only(['name', 'amount', 'due_date']));

            return response()->json([
                'success' => true,
                'message' => 'Invoice updated',
                'invoice' => $invoice
            ]);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    public function deleteInvoice($id)
    {
        try {
            $invoice = TuitionInvoice::find($id);

            if (!$invoice) return $this->notFound("Invoice not found");

            $invoice->delete();

            return response()->json([
                'success' => true,
                'message' => 'Invoice deleted'
            ]);

        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    public function toggleInvoiceStatus($id)
    {
        try {
            $invoice = TuitionInvoice::find($id);

            if (!$invoice) return $this->notFound("Invoice not found");

            $newStatus = $invoice->status === 'paid' ? 'pending' : 'paid';

            $invoice->update(['status' => $newStatus]);

            return response()->json([
                'success' => true,
                'message' => 'Invoice status updated',
                'invoice' => $invoice
            ]);

        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    /* ============================================================
       PAYROLL MANAGEMENT
    ============================================================ */

    public function listPayroll()
    {
        try {
            return response()->json([
                'success' => true,
                'payroll' => Payroll::with('staff.user')->get()
            ]);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    public function createPayroll(Request $request)
    {
        try {
            $data = $request->validate([
                'staff_id'    => 'required|exists:staff,id',
                'month'       => 'required|numeric|min:1|max:12',
                'year'        => 'required|numeric',
                'basic_salary'=> 'required|numeric|min:0',
                'allowances'  => 'required|numeric|min:0',
                'deductions'  => 'required|numeric|min:0',
            ]);

            $net = $data['basic_salary'] + $data['allowances'] - $data['deductions'];

            $record = Payroll::create([
                ...$data,
                'net_salary' => $net
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payroll created',
                'record'  => $record
            ]);

        } catch (ValidationException $e) {
            return $this->validationError($e);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    public function updatePayroll(Request $request, $id)
    {
        try {
            $record = Payroll::find($id);
            if (!$record) return $this->notFound("Payroll record not found");

            $record->update($request->only([
                'basic_salary','allowances','deductions','month','year'
            ]));

            // Recalculate net
            $record->net_salary =
                $record->basic_salary + $record->allowances - $record->deductions;
            $record->save();

            return response()->json([
                'success' => true,
                'message' => 'Payroll updated',
                'record'  => $record
            ]);

        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    public function deletePayroll($id)
    {
        try {
            $record = Payroll::find($id);
            if (!$record) return $this->notFound("Payroll record not found");

            $record->delete();

            return response()->json([
                'success' => true,
                'message' => 'Payroll entry deleted'
            ]);

        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    public function monthlyPayrollReport($year, $month)
    {
        try {
            $records = Payroll::with('staff.user')
                ->where('year', $year)
                ->where('month', $month)
                ->get();

            return response()->json([
                'success' => true,
                'generated' => Carbon::now(),
                'month' => $month,
                'year'  => $year,
                'records' => $records
            ]);

        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    /* ============================================================
       BUDGET MANAGEMENT
    ============================================================ */

    public function listBudgets()
    {
        try {
            return response()->json([
                'success' => true,
                'budgets' => Budget::with('department')->get()
            ]);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    public function createBudget(Request $request)
    {
        try {
            $data = $request->validate([
                'department_id'    => 'required|exists:departments,id',
                'fiscal_year'      => 'required|numeric',
                'allocated_amount' => 'required|numeric|min:1',
            ]);

            $budget = Budget::create([
                ...$data,
                'spent_amount' => 0
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Budget created',
                'budget'  => $budget
            ]);

        } catch (ValidationException $e) {
            return $this->validationError($e);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    public function addBudgetTransaction(Request $request)
{
    try {
        $data = $request->validate([
            'budget_id'        => 'required|exists:budgets,id',
            'type'             => 'required|in:Income,Expense',
            'description'      => 'required|string',
            'amount'           => 'required|numeric|min:1',
            'transaction_date' => 'required|date',
        ]);

        $budget = Budget::findOrFail($data['budget_id']);

        // 🔴 ENFORCE LIMIT
        if ($data['type'] === 'Expense') {
            if ($budget->spent_amount + $data['amount'] > $budget->allocated_amount) {
                return response()->json([
                    'success' => false,
                    'message' => 'Budget exceeded'
                ], 422);
            }

            // Update spent amount
            $budget->increment('spent_amount', $data['amount']);
        }

        if ($data['type'] === 'Income') {
            // Optional: allow income to increase allocation
            $budget->increment('allocated_amount', $data['amount']);
        }

        $tx = BudgetTransaction::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Transaction added',
            'transaction' => $tx
        ]);

    } catch (ValidationException $e) {
        return $this->validationError($e);
    } catch (\Exception $e) {
        return $this->serverError($e);
    }
}

public function budgetReport($budget_id)
{
    try {
        $budget = Budget::with(['department', 'transactions'])
            ->find($budget_id);

        if (!$budget) {
            return $this->notFound("Budget not found");
        }

        return response()->json([
            'success' => true,
            'generated' => Carbon::now(),
            'budget' => $budget
        ]);

    } catch (\Exception $e) {
        return $this->serverError($e);
    }
}



    /* ============================================================
       COMMON ERROR HANDLERS
    ============================================================ */

    private function validationError($e)
    {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors'  => $e->errors()
        ], 422);
    }

    private function notFound($msg)
    {
        return response()->json([
            'success' => false,
            'message' => $msg
        ], 404);
    }

    private function serverError($e)
    {
        return response()->json([
            'success' => false,
            'message' => 'Server error occurred',
            'error'   => $e->getMessage()
        ], 500);
    }
}
