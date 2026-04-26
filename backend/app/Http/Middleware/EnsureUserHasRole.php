<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Non authentifie.'], 401);
        }

        if (! $user->is_active) {
            return response()->json(['message' => 'Compte inactif.'], 403);
        }

        if (! in_array($user->role, $roles, true)) {
            return response()->json(['message' => 'Acces refuse.'], 403);
        }

        return $next($request);
    }
}
