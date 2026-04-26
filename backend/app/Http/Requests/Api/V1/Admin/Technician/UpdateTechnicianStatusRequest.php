<?php

namespace App\Http\Requests\Api\V1\Admin\Technician;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTechnicianStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'is_active' => ['required', 'boolean'],
        ];
    }
}
