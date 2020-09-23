<?php

namespace App\Http\Controllers\ApiController;

use Exception;
use App\Models\Project;
use Illuminate\Http\Request;
use App\Models\ProjectSetting;
use App\Enums\ProjectSettingField;
use App\Http\Requests\Api\ProjectSettingsRequest;

class ProjectSettingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
       // return ProjectSettingField::FIELDS;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
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
        $projectSetting = ProjectSetting::create($request->all());
        if($projectSetting) {
            return response()->json($projectSetting, 200);
        } else {
            return response()->json([
                'message' => 'Something went wrong. Try again later. '
            ], 200);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\ProjectSetting  $projectSetting
     * @return \Illuminate\Http\Response
     */
    public function show(ProjectSetting $projectSetting, Request $request)
    {
        return response()->json($projectSetting, 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\ProjectSetting  $projectSetting
     * @return \Illuminate\Http\Response
     */
    public function edit(ProjectSetting $projectSetting)
    {
        return abort(404);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\ProjectSetting  $projectSetting
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ProjectSetting $projectSetting)
    {
        try {
            $update = $projectSetting->update($request->all());
            if($update) {
                return response()->json($projectSetting, 200);
            } else {
                return response()->json([
                    'message' => 'Something went wrong. Try again later.'
                ], 500);
            }
        } catch (\Throwable $th) {
            throw $th;
        }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\ProjectSetting  $projectSetting
     * @return \Illuminate\Http\Response
     */
    public function destroy(ProjectSetting $projectSetting)
    {
        $delete = $projectSetting->delete();
        if($delete) {
            return response()->json([
                'message' => 'Product Deleted Successfully.'
            ], 200);
        } else {
            return response()->json([
                'message' => 'Something Went Wrong. Try Again Later.'
            ], 500);
        }
    }

    public function projectSettings(Project $project)
    {
        $result = $project->settings;
        return response()->json($result);
    }

    public function updateProjectSettings(ProjectSettingsRequest $request, Project $projectSetting)
    {
        try {
            //code...
            foreach($request->post() as $setting)
            {
                ProjectSetting::where('id', $setting['id'])->update($setting);
            }
            $result = $projectSetting->settings;
            return response()->json($result);
        } catch (\Throwable $th) {
            throw $th;
        }

    }

}
