<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\AdminController;

// PUBLIC
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('admin/departments', [AdminController::class, 'getDepartments']);
Route::get('admin/staff', [AdminController::class, 'listStaff']);
// PROTECTED
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

});

// Student only routes

Route::middleware(['auth:sanctum', 'role:student'])->prefix('student')->group(function () {
    Route::get('/profile', [StudentController::class, 'profile']);
    Route::put('/profile', [StudentController::class, 'updateProfile']);

    Route::get('/invoices', [StudentController::class, 'listInvoices']);
    Route::get('/invoices/{id}', [StudentController::class, 'invoiceDetails']);

    Route::post('/pay', [PaymentController::class, 'pay']);

    Route::get('/payments', [StudentController::class, 'paymentHistory']);
    Route::get('/overview', [StudentController::class, 'overview']);
});
//staff
Route::middleware(['auth:sanctum', 'role:staff'])->prefix('staff')->group(function () {

    /** TUITION FEES */
    Route::get('/invoices', [StaffController::class, 'listInvoices']);
    Route::post('/invoices', [StaffController::class, 'createInvoice']);
    Route::put('/invoices/{id}', [StaffController::class, 'updateInvoice']);
    Route::delete('/invoices/{id}', [StaffController::class, 'deleteInvoice']);
    Route::post('/invoices/{id}/toggle-status', [StaffController::class, 'toggleInvoiceStatus']);

    /** PAYROLL */
    Route::get('/payroll', [StaffController::class, 'listPayroll']);
    Route::post('/payroll', [StaffController::class, 'createPayroll']);
    Route::put('/payroll/{id}', [StaffController::class, 'updatePayroll']);
    Route::delete('/payroll/{id}', [StaffController::class, 'deletePayroll']);
    Route::get('/payroll/report/{year}/{month}', [StaffController::class, 'monthlyPayrollReport']);

    /** BUDGETS */
    Route::get('/budgets', [StaffController::class, 'listBudgets']);
    Route::post('/budgets', [StaffController::class, 'createBudget']);
    Route::post('/budgets/transaction', [StaffController::class, 'addBudgetTransaction']);
    Route::get('/budgets/report/{budget}',[StaffController::class, 'budgetReport']
);

});


Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {

    // USERS
    Route::get('/users', [AdminController::class, 'getUsers']);
    Route::post('/users', [AdminController::class, 'createUser']);
    Route::put('/users/{id}', [AdminController::class, 'updateUser']);
    Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);

    // DEPARTMENTS
    
    Route::post('/departments', [AdminController::class, 'createDepartment']);
    Route::put('/departments/{id}', [AdminController::class, 'updateDepartment']);
    Route::delete('/departments/{id}', [AdminController::class, 'deleteDepartment']);

    // STAFF MGMT

    Route::post('/staff/assign', [AdminController::class, 'assignStaff']);
    Route::put('/staff/{id}/salary', [AdminController::class, 'updateSalary']);

    // BUDGETS
    Route::get('/budgets', [AdminController::class, 'allBudgets']);
    Route::post('/budgets', [AdminController::class, 'createBudget']);
    Route::put('/budgets/{id}', [AdminController::class, 'updateBudget']);
    Route::delete('/budgets/{id}', [AdminController::class, 'deleteBudget']);
});
