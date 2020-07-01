<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectSetting extends Model
{
    use SoftDeletes;

    protected $fillable = ['project_id', 'field_name', 'field_wirkzeit', 'field_spulzeit', 'aktiv'];

}
