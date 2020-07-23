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
            'room_details' => 'required',
        ];
    }

    public function messages() 
    {
        return [
            'name.required' => 'Das Namensfeld ist erforderlich.',
            'from.required' => 'Das Von Feld ist erforderlich.',
            'from.lt' => 'Das Von Feld soll kleiner sein als das Zu Feld',
            'quantity.required' => 'Das Mengenfeld ist erforderlich.',
            'to.required' => 'Das Zu Feld ist erforderlich.',
            'to.gt' => 'Das Feld An sollte größer sein als das Feld Von',
        ];
    }
}
