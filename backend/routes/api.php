<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Admin\DashboardController;
use App\Http\Controllers\Api\V1\Admin\SubmissionController as AdminSubmissionController;
use App\Http\Controllers\Api\V1\Admin\TechnicianController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\Mobile\SubmissionController as MobileSubmissionController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function (): void {
    Route::prefix('auth')->group(function (): void {
        Route::post('/login', [AuthController::class, 'login']);
        Route::middleware('auth:sanctum')->group(function (): void {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
        });
    });

    Route::prefix('mobile')
        ->middleware(['auth:sanctum', 'role:technician'])
        ->group(function (): void {
            Route::apiResource('submissions', MobileSubmissionController::class)
                ->only(['index', 'show', 'store']);
        });

    Route::prefix('admin')
        ->middleware(['auth:sanctum', 'role:admin'])
        ->group(function (): void {
            Route::get('/submissions', [AdminSubmissionController::class, 'index']);
            Route::get('/submissions/{submission}', [AdminSubmissionController::class, 'show']);
            Route::patch('/submissions/{submission}/mark-viewed', [AdminSubmissionController::class, 'markViewed']);

            Route::get('/technicians', [TechnicianController::class, 'index']);
            Route::post('/technicians', [TechnicianController::class, 'store']);
            Route::put('/technicians/{technician}', [TechnicianController::class, 'update']);
            Route::patch('/technicians/{technician}/status', [TechnicianController::class, 'updateStatus']);

            Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
        });
});
