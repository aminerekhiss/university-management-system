<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->user();

        // Not authenticated
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Check role
        if (!in_array($user->role, $roles)) {
            return response()->json(['message' => 'Forbidden: Access denied'], 403);
        }

        return $next($request);
    }
}
