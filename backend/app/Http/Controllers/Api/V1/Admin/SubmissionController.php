<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Submission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubmissionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $submissions = Submission::query()
            ->with('user:id,name,email')
            ->when($request->filled('status'), function ($query) use ($request): void {
                $query->where('status', $request->string('status')->toString());
            })
            ->when($request->filled('user_id'), function ($query) use ($request): void {
                $query->where('user_id', $request->integer('user_id'));
            })
            ->when($request->filled('from'), function ($query) use ($request): void {
                $query->whereDate('captured_at', '>=', $request->string('from')->toString());
            })
            ->when($request->filled('to'), function ($query) use ($request): void {
                $query->whereDate('captured_at', '<=', $request->string('to')->toString());
            })
            ->latest()
            ->paginate((int) $request->integer('per_page', 20));

        return response()->json($submissions);
    }

    public function show(Submission $submission): JsonResponse
    {
        $submission->load('user:id,name,email');

        return response()->json($submission);
    }

    public function markViewed(Request $request, Submission $submission): JsonResponse
    {
        $submission->forceFill([
            'status' => 'viewed',
            'viewed_at' => now(),
        ])->save();

        AuditLog::query()->create([
            'user_id' => $request->user()->id,
            'action' => 'submission.mark_viewed',
            'entity_type' => 'submission',
            'entity_id' => $submission->id,
            'metadata' => [
                'status' => 'viewed',
            ],
        ]);

        return response()->json([
            'message' => 'Soumission marquee comme vue.',
            'submission' => $submission,
        ]);
    }
}
