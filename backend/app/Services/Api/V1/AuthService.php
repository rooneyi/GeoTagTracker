<?php

namespace App\Services\Api\V1;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class AuthService
{
    public function __construct(private readonly AuditLogService $auditLogService)
    {
    }

    /**
     * @return array{token:string,token_type:string,user:User}
     */
    public function login(array $validated, Request $request): array
    {
        /** @var User|null $user */
        $user = User::query()->where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants invalides.'],
            ]);
        }

        if (! $user->is_active) {
            throw new HttpException(403, 'Compte inactif.');
        }

        $user->forceFill(['last_login_at' => now()])->save();

        $this->auditLogService->log(
            userId: $user->id,
            action: 'auth.login',
            entityType: 'user',
            entityId: $user->id,
            metadata: ['ip' => $request->ip()]
        );

        return [
            'token' => $user->createToken($validated['device_name'] ?? 'api-client')->plainTextToken,
            'token_type' => 'Bearer',
            'user' => $user,
        ];
    }

    public function logout(Request $request): void
    {
        $token = $request->user()?->currentAccessToken();

        if ($token) {
            $token->delete();
        }

        $this->auditLogService->log(
            userId: $request->user()?->id,
            action: 'auth.logout',
            entityType: 'user',
            entityId: $request->user()?->id,
            metadata: ['ip' => $request->ip()]
        );
    }
}
