<?php

use App\User;
use App\Enums\UserRole;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = User::create([
            "name"     => "Admin",
            "email"    => "admin@gmail.com",
            "password" => Hash::make("admin"),
            "shortcode"=> "A"
        ]);

        $user->role()->create([
            "role_name"  => UserRole::ADMIN
        ]);
    }
}
