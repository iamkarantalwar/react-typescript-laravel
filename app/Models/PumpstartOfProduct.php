<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PumpstartOfProduct extends Model
{
    protected $fillable = ['project_id', 'project_setting_id', 'pumpstart_date', 'pumpstart_time'];
}
