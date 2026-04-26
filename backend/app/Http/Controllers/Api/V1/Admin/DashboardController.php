<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $totalSubmissions = Submission::query()->count();
        $todaySubmissions = Submission::query()->whereDate('created_at', now()->toDateString())->count();
        $activeTechnicians = User::query()->where('role', 'technician')->where('is_active', true)->count();

        return response()->json([
            'total_submissions' => $totalSubmissions,
            'today_submissions' => $todaySubmissions,
            'active_technicians' => $activeTechnicians,
            'submitted_count' => Submission::query()->where('status', 'submitted')->count(),
            'viewed_count' => Submission::query()->where('status', 'viewed')->count(),
        ]);
    }
}
