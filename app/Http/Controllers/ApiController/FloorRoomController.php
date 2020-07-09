<?php

namespace App\Http\Controllers\ApiController;

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
        if($request->floor_id) {
            return FloorRoom::with('taps')->where('floor_id', $request->floor_id)->get();
        } else {
            return FloorRoom::with('taps')->get();
        }
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
        $rooms = [];

        $room_details  = $request->post('room_details');

        $from = intval($request->post('from'));
        $to = intval($request->post('to'));

        for($k=$from; $k<=$to; $k++)
        {
            $room = FloorRoom::create([
                'floor_id' => $request->post('floor_id'),
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
        return $rooms;
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
            return $floorRoom;
        } else {
            return ['message' => 'Something Went Wrong.'];
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
        return abort(404);
    }
}
