<?php namespace App\Services;

use App\Enums\ProjectSettingField;
use App\Models\FloorRoom;
use App\Models\Project;
use App\Models\ProjectFloor;
use App\Models\RoomType;
use App\Models\Section;
use App\Models\Tap;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithStartRow;

class RoomImportExcelService implements ToModel
{
    private $projectRepository, $project,
            $projectFloorRepository, $floorRoom,
            $roomTypeRepository, $roomType,
            $section, $sectionRepository,
            $tap, $tapRepository;

    public function __construct(Project $project,
                                ProjectFloor $projectFloor,
                                FloorRoom $floorRoom,
                                RoomType $roomType,
                                Section $section,
                                Tap $tap)
    {
        $this->projectRepository = $project;
        $this->projectFloorRepository = $projectFloor;
        $this->floorRoom = $floorRoom;
        $this->roomTypeRepository = $roomType;
        $this->sectionRepository = $section;
        $this->tapRepository = $tap;
    }

    // Function to check string starting
    // with given substring
    function startsWith ($string, $startString)
    {
        $len = strlen($startString);
        return (substr($string, 0, $len) === $startString);
    }

    private $iteartion = 0;
    private $rooms = [];
    private $roomNumber = 1;

    public function model(array $row)
    {
        if($this->iteartion == 0){
            $this->project = $this->projectRepository->where('project_name', $row[0])->first();
            // Check if it is exist
            if($this->project == null) {
                $this->project = $this->projectRepository->create([
                    'project_name' => $row[0],
                ]);

                $fields = ProjectSettingField::FIELDS;
                foreach ($fields as $key => $value) {
                    $this->project->settings()->create([
                        'project_id' => $this->project->id,
                        'field_name' => $key,
                        'field_wirkzeit' => '',
                        'field_spulzeit' => '',
                        'aktiv' => 'ACTIVE'
                    ]);
                }
            }
        } else if($this->iteartion == 1) {
            // Add the description
            $this->project->update([
                'description' => $row[0]
            ]);

        } else if($this->iteartion == 3) {
            // Check for all the rooms
            $i=4;
            while(isset($row[$i])  && $row[$i] != "") {
                if(!$this->startsWith($row[$i], "Check")) {
                    // Check if room type Exist
                    $roomType = $this->roomTypeRepository->where('room_type', $row[$i])->first();
                    // If room type doesn't exist then create a new one
                    if($roomType == null){
                        $roomType = $this->roomTypeRepository->create([
                            'room_type' => $row[$i]
                        ]);
                    }

                    array_push($this->rooms, [
                        'index' => $i,
                        'room_type' =>$roomType
                    ]);
                }
                $i++;
            }
        } else if($this->iteartion > 5){
            $floorNumber = $row[0];
            $roomNumber = $row[2];
            $sectionNumber = $row[1];

            if(is_numeric($roomNumber) && is_numeric($sectionNumber) && is_numeric($floorNumber)) {
                // Find the floor
                $floor = $this->projectFloorRepository->where('project_id', $this->project->id)
                                                      ->where('floor_name', 'Floor '.$floorNumber)->first();

                // If floor doesn't exist create the floor
                if($floor == null) {
                    $floor = $this->projectFloorRepository->create([
                        'project_id' => $this->project->id,
                        'floor_name' => 'Floor '.$floorNumber]);
                }

                // Find the section
                $section = $this->sectionRepository->where([
                    'project_floor_id' => $floor->id,
                    'section_name' => 'Section'. $sectionNumber
                ])->first();

                if($section == null) {
                    $section = $this->sectionRepository->create([
                        'project_floor_id' => $floor->id,
                        'section_name' => 'Section'. $sectionNumber
                    ]);
                }

                // Loop To the rooms
               for($j=0; $j<count($this->rooms); $j++) {
                    // Find the number of rooms
                    $sheetIndex = $this->rooms[$j]['index'];
                    if($row[$sheetIndex] != "") {
                        // Check if room exist
                        $room = $this->floorRoom->where([
                            'section_id' => $section->id,
                            'room_name' => $roomNumber
                        ])->first();

                        if($room == null) {
                            // Create the room
                            $room = $this->floorRoom->create([
                                'section_id' => $section->id,
                                'room_name' => $roomNumber
                            ]);
                        }

                        for($k=0; $k<$row[$sheetIndex]; $k++) {

                            $this->tapRepository->create([
                                'floor_room_id' => $room->id,
                                'room_type_id' =>  $this->rooms[$j]['room_type']->id,
                                'name' => $this->rooms[$j]['room_type']->room_type.' '.($k+1),
                            ]);

                        }
                    }
               }


            }
        }
        $this->iteartion++;
    }

}
