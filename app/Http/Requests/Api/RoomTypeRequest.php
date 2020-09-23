<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class RoomTypeRequest extends FormRequest
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
                'room_type' => 'required|unique:room_types,room_type'
            ];
        } else if($this->method() == "PUT" || $this->method() == "PATCH") {
            return [
                'room_type' => 'required|unique:room_types,room_type,'.$this->route('room_type')->id
            ];
        }
    }
}
