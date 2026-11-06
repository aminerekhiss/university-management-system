<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use App\Models\TuitionInvoice;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class StudentController extends Controller
{
    /* ============================================================
       GET PROFILE
    ============================================================ */
    public function profile()
    {
        try {
            $user = Auth::user();

            $student = Student::where('user_id', $user->id)->first();

            if (!$student) {
                return $this->notFound("Student profile not found");
            }

            return response()->json([
                'success' => true,
                'user'    => $user,
                'student' => $student
            ]);

        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    /* ============================================================
       UPDATE PROFILE
    ============================================================ */
    public function updateProfile(Request $request)
    {
        try {
            $user = Auth::user();

            $request->validate([
                'fullname'       => 'sometimes|string|max:255',
                'username'       => 'sometimes|string|max:255|unique:users,username,' . $user->id,
                'profile_image'  => 'sometimes|string|nullable',
            ]);

            $user->update($request->only(['fullname', 'username', 'profile_image']));

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'user'    => $user
            ]);

        } catch (ValidationException $e) {
            return $this->validationError($e);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    /* ============================================================
       LIST INVOICES
    ============================================================ */
    public function listInvoices()
    {
        try {
            $student = Student::where('user_id', Auth::id())->first();

            if (!$student) return $this->notFound("Student not found");

            $invoices = TuitionInvoice::where('student_id', $student->id)->get();

            return response()->json([
                'success'  => true,
                'invoices' => $invoices
            ]);

        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    /* ============================================================
       INVOICE DETAILS
    ============================================================ */
    public function invoiceDetails($id)
    {
        try {
            $student = Student::where('user_id', Auth::id())->first();

            if (!$student) return $this->notFound("Student not found");

            $invoice = TuitionInvoice::where('student_id', $student->id)
                ->where('id', $id)
                ->first();

            if (!$invoice) return $this->notFound("Invoice not found");

            return response()->json([
                'success' => true,
                'invoice' => $invoice
            ]);

        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    /* ============================================================
       PAYMENT HISTORY
    ============================================================ */
    public function paymentHistory()
    {
        try {
            $student = Student::where('user_id', Auth::id())->first();

            if (!$student) return $this->notFound("Student not found");

            $payments = Payment::whereHas('invoice', function ($q) use ($student) {
                $q->where('student_id', $student->id);
            })->with('invoice')->get();

            return response()->json([
                'success'  => true,
                'payments' => $payments
            ]);

        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    /* ============================================================
       DASHBOARD OVERVIEW
    ============================================================ */
    public function overview()
    {
        try {
            $student = Student::where('user_id', Auth::id())->first();

            if (!$student) return $this->notFound("Student not found");

            $invoices = TuitionInvoice::where('student_id', $student->id)->get();

            return response()->json([
                'success'        => true,
                'total_invoices' => $invoices->count(),
                'pending'        => $invoices->where('status', 'pending')->count(),
                'overdue'        => $invoices->where('status', 'overdue')->count(),
                'paid'           => $invoices->where('status', 'paid')->count(),
                'total_due'      => $invoices->whereIn('status', ['pending', 'overdue'])->sum('amount'),
                'total_paid'     => $invoices->where('status', 'paid')->sum('amount'),
            ]);

        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }


    /* ============================================================
       ERROR HANDLERS
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
