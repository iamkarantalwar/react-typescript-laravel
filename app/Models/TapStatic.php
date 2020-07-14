<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TapStatic extends Model
{
    public $guarded = ['updated_at'];
    
    public function taps() {
        return $this->belongsTo("App\Models\Tap");
    }
}
