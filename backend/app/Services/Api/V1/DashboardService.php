<?php

namespace App\Services\Api\V1;

use App\Models\Submission;
use App\Models\User;

class DashboardService
{
    /**
     * @return array<string,int>
     */
    public function stats(): array
    {
        return [
            'total_submissions' => Submission::query()->count(),
            'today_submissions' => Submission::query()->whereDate('created_at', now()->toDateString())->count(),
            'active_technicians' => User::query()->where('role', 'technician')->where('is_active', true)->count(),
            'submitted_count' => Submission::query()->where('status', 'submitted')->count(),
            'viewed_count' => Submission::query()->where('status', 'viewed')->count(),
        ];
    }
