<?php

use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $teams = App\Models\Team::all();
        if ($teams->count() > 0) {
            foreach($teams as $team) {
                $team->delete();
            }
        } 
        factory(App\Models\Team::class, 10)->create();
    }
}
