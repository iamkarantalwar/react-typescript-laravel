<?php

namespace App\Http\Controllers\ApiController;

use App\Models\ProjectFloor;
use Illuminate\Http\Request;

class ProjectFloorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return ProjectFloor::all();
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
        //
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
