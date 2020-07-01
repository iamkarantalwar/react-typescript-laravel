<?php

namespace App\Http\Requests\Api;

use App\Http\Requests\Api\ApiRequest;

use Illuminate\Foundation\Http\FormRequest;

class ProjectFloorRequest extends ApiRequest
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
            'name' => 'required',
            'quantity' => 'required|integer',
            'from' => 'required|integer|lt:to',
            'to' => 'required|integer|gt:from',
            'project_id' => 'required|integer'
        ];
    }
}
