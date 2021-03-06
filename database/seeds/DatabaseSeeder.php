<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        //$this->call(ProjectSeeder::class);
        $this->call(RoomTypeSeeder::class);
        $this->call(UserSeeder::class);
        //$this->call(TeamSeeder::class);
    }
}
