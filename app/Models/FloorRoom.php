<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FloorRoom extends Model
{
    use SoftDeletes;
    protected $fillable = ['floor_id', 'quantity', 'room_name', 'room_type_id'];
}
