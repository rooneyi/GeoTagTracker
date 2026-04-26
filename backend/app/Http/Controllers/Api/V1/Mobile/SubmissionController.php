<?php

namespace App\Http\Controllers\Api\V1\Mobile;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Submission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SubmissionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $submissions = Submission::query()
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate((int) $request->integer('per_page', 20));

        return response()->json($submissions);
    }

    public function show(Request $request, Submission $submission): JsonResponse
    {
        if ((int) $submission->user_id !== (int) $request->user()->id) {
            return response()->json(['message' => 'Acces refuse.'], 403);
        }

        return response()->json($submission);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'image' => ['required', 'image', 'mimes:jpeg,jpg,png', 'max:10240'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'gps_accuracy' => ['nullable', 'numeric', 'min:0'],
            'captured_at' => ['required', 'date'],
            'device_platform' => ['required', 'string', 'max:40'],
            'device_model' => ['nullable', 'string', 'max:255'],
            'app_version' => ['nullable', 'string', 'max:40'],
            'address_label' => ['nullable', 'string', 'max:255'],
        ]);

        $imageFile = $request->file('image');
        $path = $imageFile->store('submissions/'.now()->format('Y/m/d'), 'public');

        $submission = Submission::query()->create([
            'user_id' => $request->user()->id,
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

        AuditLog::query()->create([
            'user_id' => $request->user()->id,
            'action' => 'submission.create',
            'entity_type' => 'submission',
            'entity_id' => $submission->id,
            'metadata' => [
                'photo_path' => $path,
                'ip' => $request->ip(),
            ],
        ]);

        return response()->json([
            'id' => $submission->id,
            'status' => $submission->status,
            'photo_url' => Storage::disk('public')->url($submission->photo_path),
            'captured_at' => $submission->captured_at,
            'received_at' => $submission->received_at,
            'position' => [
                'latitude' => $submission->latitude,
                'longitude' => $submission->longitude,
                'gps_accuracy' => $submission->gps_accuracy,
            ],
            'message' => 'Soumission enregistree avec succes.',
        ], 201);
    }
}
