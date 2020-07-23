<?php

namespace App\Http\Requests\Api;

use App\Http\Requests\Api\ApiRequest;

class ProjectRequest extends ApiRequest
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
            'project_name' => 'required',
            'description'  => 'required',
        ];
    }

    public function messages() 
    {
        return [
            'project_name.required' => 'Projektname ist erforderlich.',
            'description.required'  => 'Projektbeschreibung ist erforderlich.'
        ];
    }
}
