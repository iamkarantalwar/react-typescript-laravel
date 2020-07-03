<?php

namespace App\Http\Controllers\ApiController;

use App\Models\ProjectFloor;
use Illuminate\Http\Request;
use App\Enums\ProjectFloorStatus;
use App\Http\Requests\Api\ProjectFloorRequest;

class ProjectFloorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return ProjectFloor::where('project_id', $request->project_id)->get();
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

        return $projectFloors;
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
    public function update(Request $request, ProjectFloor $projectFloor)
    {
        $update = $projectFloor->update($request->all());
        if($update) {
            return $projectFloor;
        } else {
            return ['message' => 'Something Went Wrong'];
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
        //
    }
}
