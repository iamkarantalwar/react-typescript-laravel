<?php

namespace App\Http\Controllers\ApiController;

use App\Http\Controllers\Controller;
use App\Models\PumpstartOfProduct;
use Carbon\Carbon;
use Illuminate\Http\Request;

class PumpstartOfProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $project_id = $request->get('project_id');
        $pumpstartOfProducts = PumpstartOfProduct::where('project_id', $project_id)->get();
        return response()->json($pumpstartOfProducts, 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $now = Carbon::now();

        $pumpstartOfProduct = PumpstartOfProduct::create([
            'project_id' => $request->post('project_id'),
            'project_setting_id' => $request->post('project_setting_id'),
            'pumpstart_date' => $now->format('Y-m-d'),
            'pumpstart_time' => $now->format('H:i:s'),
        ]);

        if($pumpstartOfProduct) {
            return response()->json($pumpstartOfProduct, 200);
        } else {
            return response()->json([
                'message' => 'Something went wrong. Try again later.',
            ], 400);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\PumpstartOfProduct  $pumpstartOfProduct
     * @return \Illuminate\Http\Response
     */
    public function show(PumpstartOfProduct $pumpstartOfProduct)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\PumpstartOfProduct  $pumpstartOfProduct
     * @return \Illuminate\Http\Response
     */
    public function edit(PumpstartOfProduct $pumpstartOfProduct)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\PumpstartOfProduct  $pumpstartOfProduct
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, PumpstartOfProduct $pumpstartOfProduct)
    {
        $update = $pumpstartOfProduct->update([
            'pumpstart_date' => $request->pumpstart_date,
            'pumpstart_time' => $request->pumpstart_time,
        ]);

        if($update) {
            return response()->json($pumpstartOfProduct, 200);
        } else {
            return response()->json([
                'message' => 'Something went wrong. Try again later.',
            ], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\PumpstartOfProduct  $pumpstartOfProduct
     * @return \Illuminate\Http\Response
     */
    public function destroy(PumpstartOfProduct $pumpstartOfProduct)
    {
        //
    }
}
