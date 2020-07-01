<?php

namespace App\Http\Controllers\ApiController;

use App\Models\Project;
use Illuminate\Http\Request;
use App\Enums\ProjectSettingField;
use App\Http\Requests\Api\ProjectRequest;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Project::with(['floors'])->get();
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
    public function store(ProjectRequest $request)
    {
        $project = Project::create($request->all());
        if ($project) {
            //Add Project Settings
            $fields = ProjectSettingField::FIELDS;
            foreach ($fields as $key => $value) {
                $project->settings()->create([
                    'project_id' => $project->id, 
                    'field_name' => $key, 
                    'field_wirkzeit' => '', 
                    'field_spulzeit' => '', 
                    'aktiv' => 'ACTIVE'
                ]);
            }
            return $project;
        } else {
            return ["message" => "Something went wrong. Try again later."];
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Project  $project
     * @return \Illuminate\Http\Response
     */
    public function show(Project $project)
    {
        return $project;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Project  $project
     * @return \Illuminate\Http\Response
     */
    public function edit(Project $project)
    {
        return abort(404);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Project  $project
     * @return \Illuminate\Http\Response
     */
    public function update(ProjectRequest $request, Project $project)
    {
        $if_update = $project->update($request->all());
        if ($if_update) {
            return $project;
        } else {
            return ["message" => "Something Went Wrong"];
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Project  $project
     * @return \Illuminate\Http\Response
     */
    public function destroy(Project $project)
    {
        $delete = $project->delete();
        if ($delete) {
            return ["message" => "Project Deleted Successfully"];
        } else {
            return ["message" => "Something Went Wrong."];
        }
    }
}
