<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TapTimer extends Model
{
    public $fillable = ['tap_id', 'wirkzeit_status', 'spulzeit_status', 'project_setting_id', 'completed',
                        'wirkzeit_pending_timer', 'spulzeit_pending_timer', 'wirkzeit_timer_started',
                        'spulzeit_timer_started', 'wirkzeit_timer_started_user_id', 'spulzeit_timer_started_user_id',
                        'wirkzeit_timer_started_date', 'wirkzeit_timer_started_time', 'spulzeit_timer_started_date',
                        'spulzeit_timer_started_time'];
}
