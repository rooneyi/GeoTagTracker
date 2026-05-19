<?php

namespace App\Http\Requests\Api\V1\Mobile\Submission;

use Illuminate\Foundation\Http\FormRequest;

class StoreMobileSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'image' => ['required', 'file', 'image', 'mimes:jpeg,jpg,png', 'max:35240'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'gps_accuracy' => ['nullable', 'numeric', 'min:0'],
            'captured_at' => ['required', 'date'],
            'device_platform' => ['required', 'string', 'max:40'],
            'device_model' => ['nullable', 'string', 'max:255'],
            'app_version' => ['nullable', 'string', 'max:40'],
            'address_label' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'image.required' => 'La photo est obligatoire.',
            'image.uploaded' => 'La photo n\'a pas pu être reçue (taille max 10 Mo, formats JPEG ou PNG).',
            'image.image' => 'Le fichier doit être une image.',
            'image.mimes' => 'La photo doit être au format JPEG ou PNG.',
            'image.max' => 'La photo ne doit pas dépasser 10 Mo.',
        ];
    }
}
