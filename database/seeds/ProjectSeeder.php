<?php

use Illuminate\Database\Seeder;
use App\Enums\ProjectSettingField;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $projects = App\Models\Project::all();
        if ($projects->count() > 0) {
            foreach($projects as $project) {
                $project->delete();
            }
        } 

        factory(App\Models\Project::class, 10)
        ->create()
        ->each(function ($project) {
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
        });
    }
}
