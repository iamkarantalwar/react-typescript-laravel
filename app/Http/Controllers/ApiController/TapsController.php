<?php

namespace App\Http\Controllers\ApiController;

use Exception;
use App\Models\Tap;
use Illuminate\Http\Request;

class TapsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Taps  $taps
     * @return \Illuminate\Http\Response
     */
    public function show(Tap $taps)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Taps  $taps
     * @return \Illuminate\Http\Response
     */
    public function edit(Tap $taps)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Taps  $taps
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Tap $tap)
    {
        $update = $tap->update([
            'name' => $request->post('name')
        ]);
        if($update){
            return response()->json($tap, 200);
        } else {
            return response()->json([
                'message' => 'Something went wrong. Try again later.'
            ], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Taps  $taps
     * @return \Illuminate\Http\Response
     */
    public function destroy(Tap $tap)
    {
        $delete = $tap->delete();
        if($delete) {
            return response()->json([
                'message' => 'Tap deleted successfully.'
            ], 200);
        } else {
            return response()->json([
                'message' => 'Something went wrong. Try again later.'
            ], 400);
        }
    }
}
