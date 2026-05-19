<?php

namespace App\Services\Api\V1;

use App\Models\Submission;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AdminSubmissionService
{
    public function __construct(private readonly AuditLogService $auditLogService)
    {
    }

    public function list(array $filters): LengthAwarePaginator
    {
        return Submission::query()
            ->with('user:id,name,phone')
            ->when(! empty($filters['status']), function ($query) use ($filters): void {
                $query->where('status', $filters['status']);
            })
            ->when(! empty($filters['user_id']), function ($query) use ($filters): void {
                $query->where('user_id', (int) $filters['user_id']);
            })
            ->when(! empty($filters['from']), function ($query) use ($filters): void {
                $query->whereDate('captured_at', '>=', $filters['from']);
            })
            ->when(! empty($filters['to']), function ($query) use ($filters): void {
                $query->whereDate('captured_at', '<=', $filters['to']);
            })
            ->latest()
            ->paginate((int) ($filters['per_page'] ?? 20));
    }

    public function show(Submission $submission): Submission
    {
        return $submission->load('user:id,name,phone');
    }

    public function markViewed(Submission $submission, User $actor): Submission
    {
        $submission->forceFill([
            'status' => 'viewed',
            'viewed_at' => now(),
        ])->save();

        $this->auditLogService->log(
            userId: $actor->id,
            action: 'submission.mark_viewed',
            entityType: 'submission',
            entityId: $submission->id,
            metadata: ['status' => 'viewed']
        );

        return $submission;
    }
}
