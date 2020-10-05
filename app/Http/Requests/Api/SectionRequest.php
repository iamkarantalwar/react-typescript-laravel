<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class SectionRequest extends FormRequest
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
            'floor_id' => 'required|integer',
            'section_name' => 'required',
            'quantity' => 'required|integer',
            'from' => 'required|integer|lt:to',
            'to' => 'required|integer|gt:from',
        ];
    }

    public function messages()
    {
        return [
            'section_name.required' => 'Das Namensfeld ist erforderlich.',
            'from.required' => 'Das Von Feld ist erforderlich.',
            'from.lt' => 'Das Von Feld soll kleiner sein als das Zu Feld',
            'quantity.required' => 'Das Mengenfeld ist erforderlich.',
            'to.required' => 'Das Zu Feld ist erforderlich.',
            'to.gt' => 'Das Feld An sollte größer sein als das Feld Von',
        ];
    }

}
