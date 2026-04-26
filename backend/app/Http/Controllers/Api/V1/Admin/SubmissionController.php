<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\Submission\IndexAdminSubmissionRequest;
use App\Http\Resources\Api\V1\SubmissionResource;
use App\Services\Api\V1\AdminSubmissionService;
use App\Models\Submission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubmissionController extends Controller
{
    public function __construct(private readonly AdminSubmissionService $adminSubmissionService)
    {
    }

    public function index(IndexAdminSubmissionRequest $request)
    {
        $submissions = $this->adminSubmissionService->list($request->validated());

        return SubmissionResource::collection($submissions)->response();
    }

    public function show(Submission $submission): SubmissionResource
    {
        $submission = $this->adminSubmissionService->show($submission);

        return new SubmissionResource($submission);
    }

    public function markViewed(Request $request, Submission $submission): JsonResponse
    {
        $submission = $this->adminSubmissionService->markViewed($submission, $request->user());

        return response()->json([
            'message' => 'Soumission marquee comme vue.',
            'submission' => (new SubmissionResource($submission))->resolve(),
        ]);
    }
}
