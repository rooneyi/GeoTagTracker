<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class TechnicianController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $technicians = User::query()
            ->where('role', 'technician')
            ->when($request->filled('is_active'), function ($query) use ($request): void {
                $query->where('is_active', $request->boolean('is_active'));
            })
            ->orderBy('name')
            ->paginate((int) $request->integer('per_page', 20));

        return response()->json($technicians);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:30'],
            'password' => ['required', 'string', 'min:8'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $technician = User::query()->create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            'role' => 'technician',
            'is_active' => $validated['is_active'] ?? true,
        ]);

        AuditLog::query()->create([
            'user_id' => $request->user()->id,
            'action' => 'technician.create',
            'entity_type' => 'user',
            'entity_id' => $technician->id,
            'metadata' => [
                'email' => $technician->email,
            ],
        ]);

        return response()->json($technician, 201);
    }

    public function update(Request $request, User $technician): JsonResponse
    {
        if (! $technician->isTechnician()) {
            return response()->json(['message' => 'Utilisateur non technicien.'], 422);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($technician->id)],
            'phone' => ['nullable', 'string', 'max:30'],
            'password' => ['nullable', 'string', 'min:8'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $technician->name = $validated['name'];
        $technician->email = $validated['email'];
        $technician->phone = $validated['phone'] ?? null;

        if (array_key_exists('password', $validated) && $validated['password']) {
            $technician->password = Hash::make($validated['password']);
        }

        if (array_key_exists('is_active', $validated)) {
            $technician->is_active = (bool) $validated['is_active'];
        }

        $technician->save();

        AuditLog::query()->create([
            'user_id' => $request->user()->id,
            'action' => 'technician.update',
            'entity_type' => 'user',
            'entity_id' => $technician->id,
            'metadata' => [
                'email' => $technician->email,
            ],
        ]);

        return response()->json($technician);
    }

    public function updateStatus(Request $request, User $technician): JsonResponse
    {
        if (! $technician->isTechnician()) {
            return response()->json(['message' => 'Utilisateur non technicien.'], 422);
        }

        $validated = $request->validate([
            'is_active' => ['required', 'boolean'],
        ]);

        $technician->forceFill([
            'is_active' => (bool) $validated['is_active'],
        ])->save();

        AuditLog::query()->create([
            'user_id' => $request->user()->id,
            'action' => 'technician.status',
            'entity_type' => 'user',
            'entity_id' => $technician->id,
            'metadata' => [
                'is_active' => (bool) $validated['is_active'],
            ],
        ]);

        return response()->json([
            'message' => 'Statut technicien mis a jour.',
            'technician' => $technician,
        ]);
    }
}
