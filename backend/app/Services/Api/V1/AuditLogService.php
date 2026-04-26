<?php

namespace App\Services\Api\V1;

use App\Models\AuditLog;

class AuditLogService
{
    public function log(?int $userId, string $action, ?string $entityType = null, ?int $entityId = null, array $metadata = []): void
    {
        AuditLog::query()->create([
            'user_id' => $userId,
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'metadata' => $metadata,
        ]);
    }
}
