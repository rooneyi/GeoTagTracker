<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardStatsResource extends JsonResource
{
    /**
     * @return array<string,int>
     */
    public function toArray(Request $request): array
    {
        return [
            'total_submissions' => (int) ($this->resource['total_submissions'] ?? 0),
            'today_submissions' => (int) ($this->resource['today_submissions'] ?? 0),
            'active_technicians' => (int) ($this->resource['active_technicians'] ?? 0),
            'submitted_count' => (int) ($this->resource['submitted_count'] ?? 0),
            'viewed_count' => (int) ($this->resource['viewed_count'] ?? 0),
        ];
    }
}
