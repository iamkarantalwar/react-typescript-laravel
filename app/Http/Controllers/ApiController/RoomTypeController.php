<?php

namespace App\Http\Controllers\ApiController;

use App\Http\Requests\Api\RoomTypeRequest;
use Exception;
use App\Models\RoomType;
use Illuminate\Http\Request;

class RoomTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(RoomType::all(), 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return abort(400);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(RoomTypeRequest $request)
    {
        $roomType = RoomType::create($request->all());
        if($roomType) {
            return response()->json($roomType, 200);
        } else {
            return response()->json([
                'message' => 'Something went wrong. Try again later.'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\RoomType  $roomType
     * @return \Illuminate\Http\Response
     */
    public function show(RoomType $roomType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\RoomType  $roomType
     * @return \Illuminate\Http\Response
     */
    public function edit(RoomType $roomType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\RoomType  $roomType
     * @return \Illuminate\Http\Response
     */
    public function update(RoomTypeRequest $request, RoomType $roomType)
    {
        $update = $roomType->update($request->all());
        if($update) {
            return response()->json($roomType, 200);
        } else {
            return response()->json([
                'message' => 'Something went wrong. Try again later.'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\RoomType  $roomType
     * @return \Illuminate\Http\Response
     */
    public function destroy(RoomType $roomType)
    {
        //
    }
}
