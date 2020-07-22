<?php

namespace App\Http\Controllers\ApiController;

use Exception;
use Carbon\Carbon;
use App\Models\TapTimer;
use Illuminate\Http\Request;
use App\Models\ProjectSetting;
use App\Enums\ProjectSettingOption;
use App\Http\Controllers\Controller;


class TapTimerController extends Controller
{
    public function index(Request $request) 
    {
        if($request->tap_id) {
            $timers = TapTimer::where('tap_id', $request->tap_id)->get();
            //Get Current Time Stamp
            $current_time_stamp = Carbon::now();
            //Iterate through each timer
            //Get the index
            $i = 0;
            foreach ($timers as $timer) {
                //Find If Spulziet/ Werzikuit timer is started or after that it's completed or not
                //If they started and not completed then compare with the current time
                if($timer->wirkzeit_timer_started != null && $timer->wirkzeit_status != true) {
                    $setting = ProjectSetting::where('id', $timer->project_setting_id)->first();
                    $wirkzeit_setting_timer = preg_replace('/[^0-9]/', '', $setting->field_wirkzeit);
                    if($current_time_stamp >= Carbon::parse($timer->wirkzeit_timer_started)->addSeconds($wirkzeit_setting_timer)) {
                        $timer->update([
                            'wirkzeit_status' => true
                        ]);
                        $timers[$i]->wirkzeit_status = true;
                    //If Time Is Pending Then Send The Time to the Front-end That is pending
                    } else if($current_time_stamp < Carbon::parse($timer->wirkzeit_timer_started)->addSeconds($wirkzeit_setting_timer)) {
                        $difference = Carbon::parse($timer->wirkzeit_timer_started)
                                      ->addSeconds($wirkzeit_setting_timer)
                                      ->diffInSeconds($current_time_stamp);

                        $timer->update([
                            'wirkzeit_pending_timer' => $difference
                        ]);

                        $timers[$i]->wirkzeit_pending_timer = $difference;
                    }
                } else if($timer->spulzeit_timer_started !=null && $timer->spulzeit_status != true) {
                    $setting = ProjectSetting::where('id', $timer->project_setting_id)->first();
                    $spulzeit_setting_timer = preg_replace('/[^0-9]/', '', $setting->field_spulzeit);
                    if($current_time_stamp > Carbon::parse($timer->spulzeit_timer_started)->addSeconds($spulzeit_setting_timer)) {
                        $timer->update([
                            'spulzeit_status' => true
                        ]);
                        $timers[$i]->spulzeit_status = true;
                    //If Time Is Pending Then Send The Time to the Front-end That is pending
                    } else if($current_time_stamp < Carbon::parse($timer->spulzeit_timer_started)->addSeconds($spulzeit_setting_timer)){
                        $difference = Carbon::parse($timer->spulzeit_timer_started)
                                      ->addSeconds($spulzeit_setting_timer)
                                      ->diffInSeconds($current_time_stamp);

                        $timer->update([
                            'spulzeit_pending_timer' => $difference
                        ]);

                        $timers[$i]->spulzeit_pending_timer = $difference;
                    }
                }
                $i = $i + 1;
            }
            return response()->json($timers, 200);
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

    public function update(Request $request, TapTimer $timer)
    {
        $request = $request->all();
        if(isset($request['field'])) {
            if($request['field'] == ProjectSettingOption::wirkzeit) {
                $request['wirkzeit_timer_started'] = Carbon::now();
                array_merge($request, ['wirkzeit_timer_started' => Carbon::now()]);
            } else if($request['field'] == ProjectSettingOption::spulzeit) {
                $request['spulzeit_timer_started'] = Carbon::now();
                array_merge($request, ['spulzeit_timer_started' => Carbon::now()]);
            }
        }
        $update = $timer->update($request);
        if($update) {
            return response()->json($timer, 200);
        } else {
            throw new Exception("Error Processing Request", 1);
        }
    }
}
