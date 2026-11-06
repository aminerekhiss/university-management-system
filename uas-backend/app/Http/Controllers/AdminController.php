<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Department;
use App\Models\Staff;
use App\Models\Budget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class AdminController extends Controller
{
    /* =====================================================
       USER MANAGEMENT
    ======================================================*/

    public function getUsers()
    {
        try {
            $users = User::with(['student', 'staff'])->get();

            return response()->json([
                'success' => true,
                'data' => $users
            ]);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }


    public function createUser(Request $request)
    {
        try {
            $validated = $request->validate([
                'fullname' => 'required|string',
                'username' => 'required|string|unique:users',
                'email' => 'required|email|unique:users',
                'role' => 'required|in:student,staff,admin',
                'password' => 'required|string|min:6',
            ]);

            $user = User::create([
                'fullname' => $validated['fullname'],
                'username' => $validated['username'],
                'email' => $validated['email'],
                'role'  => $validated['role'],
                'password' => Hash::make($validated['password']),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'data' => $user
            ], 201);

        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }


    public function updateUser(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $user->update($request->only(['fullname', 'username', 'email', 'role']));

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'data' => $user
            ]);
        } catch (ModelNotFoundException $e) {
            return $this->notFound("User not found");
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }


    public function deleteUser($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);
        } catch (ModelNotFoundException $e) {
            return $this->notFound("User not found");
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }


    /* =====================================================
       DEPARTMENT MANAGEMENT
    ======================================================*/

    public function getDepartments()
    {
        try {
            return response()->json([
                'success' => true,
                'data' => Department::all()
            ]);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }


    public function createDepartment(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|unique:departments',
                'code' => 'required|string|unique:departments',
            ]);

            $dept = Department::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Department created successfully',
                'data' => $dept
            ], 201);

        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }


    public function updateDepartment(Request $request, $id)
    {
        try {
            $dept = Department::findOrFail($id);
            $dept->update($request->only(['name', 'code']));

            return response()->json([
                'success' => true,
                'message' => 'Department updated',
                'data' => $dept
            ]);
        } catch (ModelNotFoundException $e) {
            return $this->notFound("Department not found");
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }


    public function deleteDepartment($id)
    {
        try {
            $dept = Department::findOrFail($id);
            $dept->delete();

            return response()->json([
                'success' => true,
                'message' => 'Department deleted'
            ]);
        } catch (ModelNotFoundException $e) {
            return $this->notFound("Department not found");
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }



    /* =====================================================
       STAFF MANAGEMENT
    ======================================================*/

    public function listStaff()
    {
        try {
            return response()->json([
                'success' => true,
                'data' => Staff::with(['user', 'department'])->get()
            ]);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }


    public function assignStaff(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'department_id' => 'required|exists:departments,id',
                'base_salary' => 'required|numeric|min:0'
            ]);

            $staff = Staff::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Staff assigned successfully',
                'data' => $staff
            ], 201);

        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }


    public function updateSalary(Request $request, $id)
    {
        try {
            $staff = Staff::findOrFail($id);

            $request->validate([
                'base_salary' => 'required|numeric|min:0'
            ]);

            $staff->update([
                'base_salary' => $request->base_salary,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Salary updated',
                'data' => $staff
            ]);

        } catch (ModelNotFoundException $e) {
            return $this->notFound("Staff member not found");
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }


    /* =====================================================
       BUDGET MANAGEMENT
    ======================================================*/

    public function allBudgets()
    {
        try {
            return response()->json([
                'success' => true,
                'data' => Budget::with('department')->get()
            ]);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }


    public function createBudget(Request $request)
    {
        try {
            $validated = $request->validate([
                'department_id' => 'required|exists:departments,id',
                'fiscal_year' => 'required|digits:4',
                'allocated_amount' => 'required|numeric|min:0'
            ]);

            $budget = Budget::create([
                'department_id' => $validated['department_id'],
                'fiscal_year' => $validated['fiscal_year'],
                'allocated_amount' => $validated['allocated_amount'],
                'spent_amount' => 0,
                'status' => 'open'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Budget created successfully',
                'data' => $budget
            ], 201);

        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }


    public function updateBudget(Request $request, $id)
    {
        try {
            $budget = Budget::findOrFail($id);

            $budget->update($request->only(['allocated_amount', 'spent_amount', 'status']));

            return response()->json([
                'success' => true,
                'message' => 'Budget updated',
                'data' => $budget
            ]);

        } catch (ModelNotFoundException $e) {
            return $this->notFound("Budget not found");
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }


    public function deleteBudget($id)
    {
        try {
            $budget = Budget::findOrFail($id);
            $budget->delete();

            return response()->json([
                'success' => true,
                'message' => 'Budget deleted successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return $this->notFound("Budget not found");
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }



    /* =====================================================
       SHARED ERROR HANDLERS
    ======================================================*/

    private function notFound($message)
    {
        return response()->json([
            'success' => false,
            'message' => $message
        ], 404);
    }

    private function serverError($e)
    {
        return response()->json([
            'success' => false,
            'message' => 'Server Error',
            'error' => $e->getMessage()
        ], 500);
    }
}
