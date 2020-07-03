<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectFloor extends Model
{
    use SoftDeletes;

    protected $fillable = ['project_id', 'floor_name', 'status', 'team_id']; 

    public function rooms()
    {
        return $this->hasMany("App\Models\FloorRoom", 'floor_id');
    }
}
