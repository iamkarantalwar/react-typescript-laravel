<?php

namespace App\Http\Requests\Api;


use App\Rules\AddFloorRoomsRule;
use App\Http\Requests\Api\ApiRequest;

class FloorRoomsRequest extends ApiRequest
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
            'from' => 'required|integer|lte:to',
            'quantity' => 'required|integer',
            'to' => 'required|integer|gte:from',
            'room_details' => ['required', new AddFloorRoomsRule($this->request->get('quantity'))],
        ];
    }
}
