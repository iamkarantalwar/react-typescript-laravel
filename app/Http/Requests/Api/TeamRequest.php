<?php

namespace App\Http\Requests\Api;

use App\Http\Requests\Api\ApiRequest;

class TeamRequest extends ApiRequest
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
        if ($this->method() == "POST") {
            return [
                'team_name' => 'required|unique:teams,team_name'
            ];
        } else if($this->method() == "PUT" || $this->method() == "PATCH") {
            return [
                'team_name' => 'required|unique:teams,team_name,'.$this->route('team')->id
            ];
        }
        
    }

    public function messages()
    {
        return [
            'team_name.required' => 'Team name is Required',
        ];
    }

}
