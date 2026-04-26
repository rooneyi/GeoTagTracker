<?php

namespace App\Services\Api\V1;

use App\Models\Submission;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class MobileSubmissionService
{
    public function __construct(private readonly AuditLogService $auditLogService)
    {
    }

    public function listForTechnician(User $user, int $perPage = 20): LengthAwarePaginator
    {
        return Submission::query()
            ->where('user_id', $user->id)
            ->latest()
            ->paginate($perPage);
    }

    public function showForTechnician(User $user, Submission $submission): Submission
    {
        if ((int) $submission->user_id !== (int) $user->id) {
            throw new AuthorizationException('Acces refuse.');
        }

        return $submission;
    }

    public function create(array $validated, User $user, string $ip): Submission
    {
        /** @var UploadedFile $imageFile */
        $imageFile = $validated['image'];
        $path = $imageFile->store('submissions/'.now()->format('Y/m/d'), 'public');

        $submission = Submission::query()->create([
            'user_id' => $user->id,
            'photo_path' => $path,
            'photo_name' => basename($path),
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'gps_accuracy' => $validated['gps_accuracy'] ?? null,
            'captured_at' => $validated['captured_at'],
            'received_at' => now(),
            'status' => 'submitted',
            'address_label' => $validated['address_label'] ?? null,
            'device_platform' => $validated['device_platform'],
            'device_model' => $validated['device_model'] ?? null,
            'app_version' => $validated['app_version'] ?? null,
        ]);

        $this->auditLogService->log(
            userId: $user->id,
            action: 'submission.create',
            entityType: 'submission',
            entityId: $submission->id,
            metadata: [
                'photo_path' => $path,
                'ip' => $ip,
            ]
        );

        return $submission;
    }

    public function photoUrl(Submission $submission): string
    {
        return Storage::disk('public')->url($submission->photo_path);
    }
}
