<?php

namespace App\Http\Requests\Api\V1\Admin\Technician;

use Illuminate\Foundation\Http\FormRequest;

class IndexTechnicianRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'is_active' => ['nullable', 'boolean'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
