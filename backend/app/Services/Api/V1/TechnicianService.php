<?php

namespace App\Services\Api\V1;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class TechnicianService
{
    public function __construct(private readonly AuditLogService $auditLogService)
    {
    }

    public function list(array $filters): LengthAwarePaginator
    {
        return User::query()
            ->where('role', 'technician')
            ->when(array_key_exists('is_active', $filters), function ($query) use ($filters): void {
                $query->where('is_active', (bool) $filters['is_active']);
            })
            ->orderBy('name')
            ->paginate((int) ($filters['per_page'] ?? 20));
    }

    public function create(array $validated, User $actor): User
    {
        $technician = User::query()->create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'email' => $validated['email'] ?? null,
            'password' => Hash::make($validated['password']),
            'role' => 'technician',
            'is_active' => $validated['is_active'] ?? true,
        ]);

        $this->auditLogService->log(
            userId: $actor->id,
            action: 'technician.create',
            entityType: 'user',
            entityId: $technician->id,
            metadata: ['phone' => $technician->phone]
        );

        return $technician;
    }

    public function update(User $technician, array $validated, User $actor): User
    {
        $this->guardTechnician($technician);

        $technician->name = $validated['name'];
        $technician->phone = $validated['phone'];
        $technician->email = $validated['email'] ?? null;

        if (! empty($validated['password'])) {
            $technician->password = Hash::make($validated['password']);
        }

        if (array_key_exists('is_active', $validated)) {
            $technician->is_active = (bool) $validated['is_active'];
        }

        $technician->save();

        $this->auditLogService->log(
            userId: $actor->id,
            action: 'technician.update',
            entityType: 'user',
            entityId: $technician->id,
            metadata: ['phone' => $technician->phone]
        );

        return $technician;
    }

    public function updateStatus(User $technician, bool $isActive, User $actor): User
    {
        $this->guardTechnician($technician);

        $technician->forceFill([
            'is_active' => $isActive,
        ])->save();

        $this->auditLogService->log(
            userId: $actor->id,
            action: 'technician.status',
            entityType: 'user',
            entityId: $technician->id,
            metadata: ['is_active' => $isActive]
        );

        return $technician;
    }

    private function guardTechnician(User $user): void
    {
        if (! $user->isTechnician()) {
            throw ValidationException::withMessages([
                'technician' => ['Utilisateur non technicien.'],
            ]);
        }
    }
}
