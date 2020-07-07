<?php

namespace App\Rules;
use App\Enums\UserRole;
use App\Enums\ProjectFloorStatus;
use App\Models\ProjectFloor;
use Illuminate\Contracts\Validation\Rule;

class FloorStatusChangeRule implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    protected $user_role = null;
    protected $floor_id = null;

    public function __construct($user_role, $floor_id)
    {
        $this->user_role = $user_role;
        $this->floor_id = $floor_id;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        if($this->user_role == UserRole::ADMIN) {
            return true;
        } else {
            $floor = ProjectFloor::where('id', $this->floor_id)->first();
            if($floor->status == ProjectFloorStatus::FINISHED && $value!= ProjectFloorStatus::FINISHED)
            {
                return false;
            } else {
                return true;
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
        return 'You don`t have access to change this status.';
    }
}
