<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use SoftDeletes;

    protected $fillable = ["project_name", "description"];

    public function floors()
    {
        return $this->hasMany("App\Models\ProjectFloor");
    }

    public function settings()
    {
        return $this->hasMany("App\Models\ProjectSetting");
    }
}
