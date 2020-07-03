<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class AddFloorRoomsRule implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    protected $totalQuantity = null;

    public function __construct($totalQuantity)
    {
        $this->totalQuantity = $totalQuantity;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $rooms)
    {
        
        $quantity = 0;
        if($this->totalQuantity == null)
        {
            return false;
        } else {
            foreach($rooms as $room) {
                if(is_numeric($room['quantity'])) {
                    $quantity = $quantity + $room['quantity'];
                }
            }

            if($quantity == $this->totalQuantity) {
                return true;
            } else {
                return false;
            }
        }
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'The total quantity is not equal to the sum of the room type quantity.';
    }
}
