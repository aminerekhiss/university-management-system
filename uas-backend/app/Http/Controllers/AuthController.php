<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Student;
use App\Models\Staff;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    /* =====================================================
       REGISTER
    ======================================================*/
 public function register(Request $request)
{
    
    try {
        $rules = [
        'fullname' => 'required|string',
        'username' => 'required|string|unique:users,username',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|min:6',

        'role' => 'required|in:student,staff',
        'university_id' => 'nullable|string',
        'staff_id' => 'nullable|string',
        'profile_image' => 'nullable|string',
        'program' => 'nullable|string',
        'level' => 'nullable|string',
        ];

        if ($request->input('role') === 'staff') {
        $rules['department_id'] = 'required|exists:departments,id';
        } else {
        $rules['department_id'] = 'nullable';
        }

        $validated = $request->validate($rules);


        // 3) Create User
        $user = User::create([
            'fullname' => $validated['fullname'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'profile_image' => $validated['profile_image'] ?? null,
        ]);

        Log::info('[AUTH][REGISTER] User created', [
            'user_id' => $user->id,
            'role' => $user->role,
        ]);

        // 4) Create Student or Staff
        if ($validated['role'] === 'student') {
            Log::info('[AUTH][REGISTER] Creating Student', [
                'user_id' => $user->id,
                'student_code' => $validated['university_id'] ?? null,
                'program' => $validated['program'] ?? null,
                'level' => $validated['level'] ?? null,
            ]);

            Student::create([
                'user_id' => $user->id,
                'student_code' => $validated['university_id'] ?? null,
                'program' => $validated['program'] ?? null,
                'level' => $validated['level'] ?? null,
            ]);

            Log::info('[AUTH][REGISTER] Student created', ['user_id' => $user->id]);
        }

        if ($validated['role'] === 'staff') {
            Log::info('[AUTH][REGISTER] Creating Staff', [
                'user_id' => $user->id,
                'department_id' => $validated['department_id'] ?? null,
            ]);

            Staff::create([
                'user_id' => $user->id,
                'department_id' => $validated['department_id'],
                'base_salary' => 0,
            ]);

            Log::info('[AUTH][REGISTER] Staff created', ['user_id' => $user->id]);
        }

        // 5) Token
        $token = $user->createToken('auth_token')->plainTextToken;
        Log::info('[AUTH][REGISTER] Token issued', ['user_id' => $user->id]);

        return response()->json([
            'success' => true,
            'message' => 'Registration successful',
            'user' => $user,
            'token' => $token,
        ], 201)->cookie(
            'auth_token',
            $token,
            60 * 24,
            '/',
            null,
            true,      // secure
            true,      // httponly
            false,
            'Strict'
        );

    } catch (ValidationException $e) {
        // 6) Log validation errors (THIS is your 422)
        Log::warning('[AUTH][REGISTER] Validation failed', [
            'errors' => $e->errors(),
            'payload' => $request->except(['password', 'password_confirmation']),
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Validation error',
            'errors' => $e->errors(),
        ], 422);

    } catch (\Throwable $e) {
        // 7) Log unexpected errors
        Log::error('[AUTH][REGISTER] Unexpected error', [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Server error',
        ], 500);
    }
}



    /* =====================================================
       LOGIN
    ======================================================*/
    public function login(Request $request)
    {
        try {
            $validated = $request->validate([
                'email'    => 'required|email',
                'password' => 'required'
            ]);

            if (!Auth::attempt($validated)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ], 401);
            }

            /** @var User $user */
            $user = Auth::user();

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'token'   => $token,
                // Frontend-friendly structure
                'user' => [
                    'id'             => $user->id,
                    'fullname'       => $user->fullname,
                    'username'       => $user->username,
                    'email'          => $user->email,
                    'role'           => $user->role,
                    'profile_image'  => $user->profile_image,
                    'university_id'  => $user->university_id,
                    'staff_id'       => $user->staff_id,
                ]
            ])->cookie(
                'auth_token',
                $token,
                60 * 24,
                '/',
                null,
                true,      // secure
                true,      // httponly
                false,
                'Strict'
            );
            ;

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors'  => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }


    /* =====================================================
       LOGOUT
    ======================================================*/
    public function logout(Request $request)
    {
        try {
            if (!$request->user()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No authenticated user'
                ], 401);
            }

            $request->user()->tokens()->delete();

            return response()->json([
                'success' => true
            ])->cookie(
                'auth_token',
                '',
                -1
            );


        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }


    /* =====================================================
       GET CURRENT USER
    ======================================================*/
    public function me(Request $request)
    {
        try {
            if (!$request->user()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Not authenticated'
                ], 401);
            }

            return response()->json([
                'success' => true,
                'user'    => $request->user()
            ]);

        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

public function changePassword(Request $request)
{
    $request->validate([
        'current_password' => 'required',
        'new_password' => 'required|min:6|confirmed',
        'new_password_confirmation' => 'required',
    ]);

    $user = $request->user();

    if (!Hash::check($request->current_password, $user->password)) {
        return response()->json([
            'message' => 'Current password is incorrect'
        ], 422);
    }
    if ($request->current_password === $request->new_password) {
        return response()->json([
            'message' => 'New password cannot be the same as the current password'
        ], 422);
    }
    if ($request->new_password !== $request->new_password_confirmation) {
        return response()->json([
            'message' => 'New password confirmation does not match'
        ], 422);
    }
    $user->password = Hash::make($request->new_password);
    $user->save();

    return response()->json([
        'message' => 'Password updated successfully'
    ]);
}

    /* =====================================================
       GENERIC SERVER ERROR HANDLER
    ======================================================*/
    private function serverError($e)
    {
        return response()->json([
            'success' => false,
            'message' => 'Server error occurred',
            'error'   => $e->getMessage()
        ], 500);
    }
}
