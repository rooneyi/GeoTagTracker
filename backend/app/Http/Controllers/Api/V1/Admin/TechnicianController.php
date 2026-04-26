<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\Technician\IndexTechnicianRequest;
use App\Http\Requests\Api\V1\Admin\Technician\StoreTechnicianRequest;
use App\Http\Requests\Api\V1\Admin\Technician\UpdateTechnicianRequest;
use App\Http\Requests\Api\V1\Admin\Technician\UpdateTechnicianStatusRequest;
use App\Http\Resources\Api\V1\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use App\Services\Api\V1\TechnicianService;

class TechnicianController extends Controller
{
    public function __construct(private readonly TechnicianService $technicianService)
    {
    }

    public function index(IndexTechnicianRequest $request)
    {
        $technicians = $this->technicianService->list($request->validated());

        return UserResource::collection($technicians)->response();
    }

    public function store(StoreTechnicianRequest $request): JsonResponse
    {
        $technician = $this->technicianService->create($request->validated(), $request->user());

        return response()->json((new UserResource($technician))->resolve(), 201);
    }

    public function update(UpdateTechnicianRequest $request, User $technician): JsonResponse
    {
        $technician = $this->technicianService->update($technician, $request->validated(), $request->user());

        return response()->json((new UserResource($technician))->resolve());
    }

    public function updateStatus(UpdateTechnicianStatusRequest $request, User $technician): JsonResponse
    {
        $technician = $this->technicianService->updateStatus(
            $technician,
            (bool) $request->validated('is_active'),
            $request->user()
        );

        return response()->json([
            'message' => 'Statut technicien mis a jour.',
            'technician' => (new UserResource($technician))->resolve(),
        ]);
    }
}
