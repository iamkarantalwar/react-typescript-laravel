<?php

namespace App\Http\Controllers\ApiController;

use Auth;
use Exception;
use App\Enums\UserRole;
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
    public function index(Request $request)
    {
        if($request->project_id) {
            return Project::where('id', $request->project_id)->first();
        } else {
            if ($request->user()->role->role_name==UserRole::ADMIN) {
                return Project::with(['floors', 'floors.rooms'])->get();
            } else {
                return Project::with(['floors' => function ($q) use($request) {
                    return $q->where('team_id', $request->user()->team_id);
                }])->get();
            }

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
    public function store(ProjectRequest $request)
    {
        try {
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
                return response()->json($project);
            } else {
                throw new Exception("Error Processing Request", 1);
            }
        } catch (\Throwable $th) {
            throw $th;
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
        return response()->json($project);
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
            return response()->json($project);
        } else {
           throw new Exception("Error Processing Request", 1);
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
            $result = true;
            return response()->json($result);
        } else {
            throw new Exception("Error Processing Request", 1);
        }
    }

}
