<?php

namespace App\Http\Controllers\ApiController;

use Exception;
use Carbon\Carbon;
use App\Models\TapTimer;
use App\Models\TapStatic;
use Illuminate\Http\Request;

class TapStaticController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $collection = TapStatic::whereHas('taps', function($q) use($request) {
                    return $q->where('id', $request->tap_id);
                })->with(['setting', 'user'])
                ->get()
                ->map(function ($q) {
                    $timer = TapTimer::where('project_setting_id', $q->project_setting_id)->where('tap_id', $q->taps_id)->first();
                    //Add Timer With Collection
                    $q->timer = $timer;
                    return $q;
                });

        return response()->json($collection);
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
    public function store(Request $request)
    {
        $data = $request->all();
        $data['user_id'] = $request->user()->id;
        $dt = Carbon::now();
        $data['date'] = $dt->format('Y-m-d');
        $data['time'] = $dt->format('H:i:s');
        $tapStatic = TapStatic::create($data);
        if($tapStatic) {
            $result = TapStatic::with(['setting', 'user'])->where('id', $tapStatic->id)->first();
            $result->timer = TapTimer::where('project_setting_id', $result->project_setting_id)->where('tap_id', $result->taps_id)->first();
            return response()->json($result);
        } else {
            throw new Exception("Error Processing Request", 1);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\TapStatic  $tapStatic
     * @return \Illuminate\Http\Response
     */
    public function show(TapStatic $tapStatic)
    {
        return abort(404);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\TapStatic  $tapStatic
     * @return \Illuminate\Http\Response
     */
    public function edit(TapStatic $tapStatic)
    {
        return abort(404);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TapStatic  $tapStatic
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, TapStatic $tapStatic)
    {

        if($request->timer) {
            $timerRequest = $request->timer;
            $timer = TapTimer::where('id', $timerRequest['id'])->first();
            $update = $timer->update([
                'wirkzeit_timer_started_date' => $timerRequest['wirkzeit_timer_started_date'],
                'wirkzeit_timer_started_time' => $timerRequest['wirkzeit_timer_started_time'],
                'spulzeit_timer_started_date' => $timerRequest['spulzeit_timer_started_date'],
                'spulzeit_timer_started_time' => $timerRequest['spulzeit_timer_started_time'],
                'wirkzeit_timer_started_user_id' => $timerRequest['wirkzeit_timer_started_user_id'],
                'spulzeit_timer_started_user_id' => $timerRequest['spulzeit_timer_started_user_id'],

            ]);
            if($update) {
                $update = $tapStatic->update($request->all());
                if($update) {
                    $result =  TapStatic::with(['setting', 'user'])->where('id', $tapStatic->id)->first();
                    $result->timer = TapTimer::where('project_setting_id', $result->project_setting_id)->where('tap_id', $result->taps_id)->first();
                    return response()->json($result);
                } else {
                    throw new Exception("Something went wrong", 1);
                }
            } else {
                throw new Exception("Error Processing Request", 1);
            }
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TapStatic  $tapStatic
     * @return \Illuminate\Http\Response
     */
    public function destroy(TapStatic $tapStatic)
    {
        //
    }
}
