<?php

namespace App\Http\Controllers\ApiController;

use App\Http\Controllers\Controller;
use App\Services\ExcelImportService;
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
        return Excel::import($this->excelImportService, $request->file('file'));
    }
}
