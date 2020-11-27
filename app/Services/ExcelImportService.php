<?php namespace App\Services;

use App\Models\FloorRoom;
use App\Models\Project;
use App\Models\ProjectFloor;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithStartRow;

class ExcelImportService implements WithMultipleSheets
{
    private $roomImportExcelService;

    public function __construct(RoomImportExcelService $roomImportExcelService)
    {
        $this->roomImportExcelService = $roomImportExcelService;
    }

    public function sheets(): array
    {
        return [
            $this->roomImportExcelService,
        ];
    }

}
