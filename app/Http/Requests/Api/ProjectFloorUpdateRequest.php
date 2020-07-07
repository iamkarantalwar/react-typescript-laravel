<?php

namespace App\Http\Requests\Api;

use App\Rules\FloorStatusChangeRule;

use App\Http\Requests\Api\ApiRequest;

class ProjectFloorUpdateRequest extends ApiRequest
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
            'status' => ['required', new FloorStatusChangeRule(auth()->user()->role->role_name, $this->request->get('id'))]
        ];
    }
}
