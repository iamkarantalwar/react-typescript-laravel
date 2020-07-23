<?php

namespace App\Http\Requests\Api;

use App\Http\Requests\Api\ApiRequest;

class UserRequest extends ApiRequest
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
                'name'     => 'required',
                'email'    => 'required|unique:users,email',
                'password' => 'required|min:6',
                'shortcode'=> 'required',
                'team_id'  => 'required',
                'role_name'  => 'required',
            ];
        } else if($this->method() == "PUT" || $this->method() == "PATCH") {
            return [
                'name'     => 'required',
                // 'email'    => 'required|unique:users,email,'.$this->route('user')->id,
                // 'password' => 'required',
                'shortcode'=> 'required',
                'team_id'  => 'required',
                'role_name'  => 'required'
            ];
        }
    }

    public function messages()
    {
        return [
            'name.required' => 'Das Namensfeld ist erforderlich',
            'email.required' => 'Das E-Mail-Feld ist erforderlich.',
            'email.unique' =>  'Die E-Mail-Adresse wird bereits verwendet.',
            'password.required' => 'Das Passwortfeld ist erforderlich.',
            'password.min' => 'Das Passwort muss mindestens 6 Zeichen lang sein',
            'shortcode.required' => 'Das Shortcode-Feld ist erforderlich.',
            'role_name.required' => 'Der Rollenname ist erforderlich.',
            'team_id.required' => 'Das Feld Team-ID ist erforderlich.'
        ];
    }
}
