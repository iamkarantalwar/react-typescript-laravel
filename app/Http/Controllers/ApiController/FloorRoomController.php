<?php

namespace App\Http\Controllers\ApiController;

use Exception;
use App\Models\Tap;
use App\Models\RoomType;
use App\Models\FloorRoom;
use Illuminate\Http\Request;
use App\Http\Requests\Api\FloorRoomsRequest;

class FloorRoomController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $result = null;
        if($request->section_id) {
            $result = FloorRoom::with('taps')->get()->where('section_id', $request->section_id)->values();
        } else {
            $result = FloorRoom::with('taps')->get();
        }
        return response()->json($result);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return abort(404);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(FloorRoomsRequest $request)
    {
        try {
            $rooms = [];

            $room_details  = $request->post('room_details');

            $from = intval($request->post('from'));
            $to = intval($request->post('to'));

            for($k=$from; $k<=$to; $k++)
            {
                $room = FloorRoom::create([
                    'section_id' => $request->post('section_id'),
                    'room_name' => $request->name.' '.$k,
                ]);

                for($i=0; $i<count($request->post('room_details')); $i++) {
                    if ($room_details[$i]['quantity'] != null) {
                        for($j=0; $j<$room_details[$i]['quantity']; $j++)
                        {
                            $tap = Tap::create([
                                'floor_room_id' => $room->id,
                                'room_type_id' => $room_details[$i]['room_type']['id'],
                                'name' => RoomType::where('id', $room_details[$i]['room_type']['id'])->first()->room_type.' '.($j+1),
                            ]);
                            $from++;
                        }
                    }
                }

                array_push($rooms, $room);
            }
            return response()->json($rooms);
        } catch (\Throwable $th) {
            throw $th;
        }

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\FloorRoom  $floorRoom
     * @return \Illuminate\Http\Response
     */
    public function show(FloorRoom $floorRoom)
    {
        return abort(404);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\FloorRoom  $floorRoom
     * @return \Illuminate\Http\Response
     */
    public function edit(FloorRoom $floorRoom)
    {
        return abort(404);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\FloorRoom  $floorRoom
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, FloorRoom $floorRoom)
    {
        $update = $floorRoom->update($request->all());
        if($update) {
            $response = FloorRoom::with('taps')->where('id', $floorRoom->id)->first();
            return response()->json($response);
        } else {
            throw new Exception("Error Processing Request", 1);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\FloorRoom  $floorRoom
     * @return \Illuminate\Http\Response
     */
    public function destroy(FloorRoom $floorRoom)
    {
       $delete = $floorRoom->delete();
       if($delete) {
           return response()->json([
               'message' => 'Room Deleted Successfully.'
           ], 200);
       } else {
           return response()->json([
               'message' => 'Something Went Wrong. Try Again Later.'
           ], 400);
       }
    }
}
