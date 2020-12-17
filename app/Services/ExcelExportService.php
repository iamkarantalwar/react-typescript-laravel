<?php namespace App\Services;

use App\Models\FloorRoom;
use App\Models\Project;
use App\Models\RoomType;
use App\Models\Section;
use App\Models\Tap;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class ExcelExportService implements FromView
{

    protected $project;

    public function __construct(Project $project)
    {
        $this->project = $project;
    }

    public function view() : View
    {
        // return view('export-excel');
        $roomsAssignedToAProject = $this->roomsAssignedToAProject();
        $tapsAssignedToAProject = $this->tapsAssignedToAProject($roomsAssignedToAProject);
        return view('export-excel', [
            'totalNumberOfColumns' => $tapsAssignedToAProject->count()*4 + 4,
            'project' => $this->project,
            'tapsAssigned' => $tapsAssignedToAProject,
            'roomsAssigned' => $roomsAssignedToAProject,
        ]);
    }

    public function roomsAssignedToAProject() {
        $floorIds = $this->project->floors()->get()->pluck('id');
        $sectionIds = Section::whereIn('project_floor_id', $floorIds)->get()->pluck('id');
        return FloorRoom::whereIn('section_id', $sectionIds)->get();
    }

    public function tapsAssignedToAProject($roomsAssignedToAProject) {
        $roomIds = $roomsAssignedToAProject->pluck('id');
        $tapsId = Tap::whereIn('floor_room_id', $roomIds)->get()->unique('room_type_id')->values()->pluck('room_type_id');
        return RoomType::whereIn('id', $tapsId)->get();
    }


}
