<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    protected $fillable = ['project_floor_id', 'section_name', 'locked'];

    public function floor()
    {
        return $this->belongsTo(ProjectFloor::class, 'project_floor_id');
    }
}
