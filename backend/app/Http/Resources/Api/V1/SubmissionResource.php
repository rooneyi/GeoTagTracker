<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class SubmissionResource extends JsonResource
{
    /**
     * @return array<string,mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'status' => $this->status,
            'photo_path' => $this->photo_path,
            'photo_url' => Storage::disk('public')->url($this->photo_path),
            'photo_name' => $this->photo_name,
            'captured_at' => $this->captured_at,
            'received_at' => $this->received_at,
            'viewed_at' => $this->viewed_at,
            'position' => [
                'latitude' => $this->latitude,
                'longitude' => $this->longitude,
                'gps_accuracy' => $this->gps_accuracy,
            ],
            'address_label' => $this->address_label,
            'device' => [
                'platform' => $this->device_platform,
                'model' => $this->device_model,
                'app_version' => $this->app_version,
            ],
            'user' => new UserResource($this->whenLoaded('user')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
