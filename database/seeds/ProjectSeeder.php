<?php

use Illuminate\Database\Seeder;

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

        factory(App\Models\Project::class, 10)->create();
    }
}
