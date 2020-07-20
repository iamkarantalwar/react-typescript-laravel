<?php

namespace App\Http\Controllers\ApiController;

use App\Models\TapTimer;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TapTimerController extends Controller
{
    public function index(Request $request) 
    {
        if($request->tap_id) {
            $rounds = TapTimer::where('tap_id', $request->tap_id)->get();
            return response()->json($rounds, 200);
        } else {
            return response()->json(TapTimer::all(), 200);
        }
    }

    public function store(Request $request) 
    {
       $timers = [];
       foreach($request->all() as $timer) {
            $timer = TapTimer::create($timer);
            if($timer) {
                array_push($timers, $timer);
            } else {
                foreach($timers as $timer) {
                    $timer->delete();
                }
                throw new Exception("Error Processing Request", 1);
            }
        }
        return response()->json($timers, 200);
    }
}
