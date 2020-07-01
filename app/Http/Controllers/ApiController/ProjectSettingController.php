<?php

namespace App\Http\Controllers\ApiController;

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
        return abort(404);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\ProjectSetting  $projectSetting
     * @return \Illuminate\Http\Response
     */
    public function show(Project $projectSetting, Request $request)
    {
        return $projectSetting->settings;
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
    public function update(ProjectSettingsRequest $request, Project $projectSetting)
    {
        foreach($request->post() as $setting)
        {
            ProjectSetting::where('id', $setting['id'])->update($setting);
        }

        return $projectSetting->settings;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\ProjectSetting  $projectSetting
     * @return \Illuminate\Http\Response
     */
    public function destroy(ProjectSetting $projectSetting)
    {
        //
    }
}
