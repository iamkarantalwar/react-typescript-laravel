<?php

namespace App\Http\Controllers\ApiController;

use Auth;
use Exception;
use App\Models\ProjectFloor;
use Illuminate\Http\Request;
use App\Enums\ProjectFloorStatus;
use App\Http\Requests\Api\ProjectFloorRequest;
use App\Http\Requests\Api\ProjectFloorUpdateRequest;

class ProjectFloorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $result = null;
        if($request->user()->role->role_name == "ADMIN") {
            $result =  ProjectFloor::where('project_id', $request->project_id)->get();
        } else {
            $result = ProjectFloor::where('project_id', $request->project_id)->where('team_id', $request->user()->team_id)->get();
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
    public function store(ProjectFloorRequest $request)
    {
        try {
            //code...
            $projectFloors = [];

            for($i=$request->post('from'); $i<=$request->post('to'); $i++)
            {
                $projectFloor = ProjectFloor::create([
                    'project_id' => $request->post('project_id'),
                    'floor_name' => $request->post('name').($i),
                    'status' => ProjectFloorStatus::PENDING,
                ]);

                array_push($projectFloors, $projectFloor);
            }
            return response()->json($projectFloors);
        } catch (\Throwable $th) {
            throw $th;
        }
        
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\ProjectFloor  $projectFloor
     * @return \Illuminate\Http\Response
     */
    public function show(ProjectFloor $projectFloor)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\ProjectFloor  $projectFloor
     * @return \Illuminate\Http\Response
     */
    public function edit(ProjectFloor $projectFloor)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\ProjectFloor  $projectFloor
     * @return \Illuminate\Http\Response
     */
    public function update(ProjectFloorUpdateRequest $request, ProjectFloor $projectFloor)
    {
        $update = $projectFloor->update($request->all());
        if($update) {
            return response()->json($projectFloor);
        } else {
            throw new Exception("Error Processing Request", 1);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\ProjectFloor  $projectFloor
     * @return \Illuminate\Http\Response
     */
    public function destroy(ProjectFloor $projectFloor)
    {
        $delete = $projectFloor->delete();
        if ($delete) {
            $result = true;
            return response()->json($result);
        } else {
            throw new Exception("Error Processing Request", 1);
        }
    }
}
