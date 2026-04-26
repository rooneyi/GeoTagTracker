<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\DashboardStatsResource;
use App\Services\Api\V1\DashboardService;

class DashboardController extends Controller
{
    public function __construct(private readonly DashboardService $dashboardService)
    {
    }

    public function stats(): DashboardStatsResource
    {
        $stats = $this->dashboardService->stats();

        return new DashboardStatsResource($stats);
    }
}
