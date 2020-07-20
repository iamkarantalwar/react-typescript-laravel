<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TapTimer extends Model
{
    public $fillable = ['tap_id', 'wirkzeit_status', 'spulzeit_status', 'project_setting_id', 'completed'];
}
