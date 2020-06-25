<?php

use App\Models\RoomType;
use Illuminate\Database\Seeder;

class RoomTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        
        RoomType::create(
        [
            "room_type" => "HW",     
        ]);

        RoomType::create(
        [
            "room_type" => "CW",     
        ]);

        RoomType::create(
        [
            "room_type" => "Mischwasser",     
        ]);

        RoomType::create(
        [
            "room_type" => "Dusche",     
        ]);

        RoomType::create(
        [
            "room_type" => "Toilette",     
        ]);

        RoomType::create(
        [
            "room_type" => "Urinal",     
        ]);

        RoomType::create(
        [
            "room_type" => "Spulmaschine",     
        ]);

        RoomType::create(
        [
            "room_type" => "Wasserpender",     
        ]);

        RoomType::create(
        [
            "room_type" => "Zapfhahn",     
        ]);

        RoomType::create(
        [
            "room_type" => "Cola/Fanta",     
        ]);

        RoomType::create(
        [
            "room_type" => "Kaffeemaschine",     
        ]);
    }
}
