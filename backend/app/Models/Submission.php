<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Submission extends Model
{
    protected $fillable = [
        'user_id',
        'photo_path',
        'photo_name',
        'latitude',
        'longitude',
        'gps_accuracy',
        'captured_at',
        'received_at',
        'status',
        'address_label',
        'device_platform',
        'device_model',
        'app_version',
        'viewed_at',
    ];

    protected function casts(): array
    {
        return [
            'captured_at' => 'datetime',
            'received_at' => 'datetime',
            'viewed_at' => 'datetime',
            'latitude' => 'float',
            'longitude' => 'float',
            'gps_accuracy' => 'float',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
