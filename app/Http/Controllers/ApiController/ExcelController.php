<?php

namespace App\Http\Controllers\ApiController;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Services\ExcelExportService;
use App\Services\ExcelImportService;
use Exception;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ExcelController extends Controller
{
    private $excelImportService;

    public function __construct(ExcelImportService $excelImportService)
    {
        $this->excelImportService = $excelImportService;
    }

    public function index()
    {
        return view('import-excel');
    }

    public function postImport(Request $request)
    {
        try
        {
            Excel::import($this->excelImportService, $request->file('file'));
            return response()->json([
                'message' => 'Excel Upload successfully.',
                'route' => route('home'),
            ], 200);
        } catch(Exception $e) {
            return response()->json([
                'message' => 'Something went wrong',
                'exception' => $e->getMessage()
            ], 400);
        }
    }

    public function export(Project $project) {
        ob_end_clean(); // this
        ob_start(); // and this
        return Excel::download(new ExcelExportService($project), $project->project_name . '.xlsx');
    }
}
