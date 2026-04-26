<?php

namespace App\Http\Controllers\Api\V1\Mobile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Mobile\Submission\IndexMobileSubmissionRequest;
use App\Http\Requests\Api\V1\Mobile\Submission\StoreMobileSubmissionRequest;
use App\Http\Resources\Api\V1\SubmissionResource;
use App\Models\Submission;
use Illuminate\Http\Request;
use App\Services\Api\V1\MobileSubmissionService;

class SubmissionController extends Controller
{
    public function __construct(private readonly MobileSubmissionService $mobileSubmissionService)
    {
    }

    public function index(IndexMobileSubmissionRequest $request)
    {
        $submissions = $this->mobileSubmissionService->listForTechnician(
            user: $request->user(),
            perPage: (int) ($request->validated()['per_page'] ?? 20)
        );

        return SubmissionResource::collection($submissions)->response();
    }

    public function show(Request $request, Submission $submission): SubmissionResource
    {
        $submission = $this->mobileSubmissionService->showForTechnician($request->user(), $submission);

        return new SubmissionResource($submission);
    }

    public function store(StoreMobileSubmissionRequest $request)
    {
        $submission = $this->mobileSubmissionService->create(
            validated: $request->validated(),
            user: $request->user(),
            ip: (string) $request->ip()
        );

        return (new SubmissionResource($submission))
            ->additional(['message' => 'Soumission enregistree avec succes.'])
            ->response()
            ->setStatusCode(201);
    }
}
