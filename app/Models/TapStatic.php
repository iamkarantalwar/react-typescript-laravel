<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TapStatic extends Model
{
    public $guarded = ['updated_at'];
    
    public function taps() {
        return $this->belongsTo("App\Models\Tap");
    }

    public function setting() {
        return $this->belongsTo("App\Models\ProjectSetting", 'project_setting_id');
    }

    public function user() {
        return $this->belongsTo("App\User");
    }
}
