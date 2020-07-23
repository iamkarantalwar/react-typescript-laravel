<?php

namespace App\Http\Requests\Api;

use App\Http\Requests\Api\ApiRequest;

class ProjectSettingsRequest extends ApiRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            '*.project_id' => 'required',
            '*.field_name' => 'required',
            '*.field_wirkzeit' => 'required',
            '*.field_spulzeit' => 'required',
            '*.aktiv' => 'required'
        ];
    }

    public function messages() {
        return [
            '*.field_wirkzeit.required' => 'Feld Wirkzeit Kann nicht leer sein',
            '*.field_spulzeit.required' => 'Feld Spulzeit Kann nicht leer sein',
        ];
    }
}
