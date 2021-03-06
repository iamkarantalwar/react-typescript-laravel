<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tap extends Model
{

    use SoftDeletes;

    public $fillable = ['name', 'floor_room_id', 'room_type_id'];

    public function statics() {
        return $this->hasMany("App\Models\TapStatic", 'taps_id');
    }

    public function timers() {
        return $this->hasMany("App\Models\TapTimer");
    }

    public function settings() {

    }

}
