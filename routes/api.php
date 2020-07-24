<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/usera', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:web')->namespace('ApiController')->group(function(){

    Route::resource('team', 'TeamController');

    Route::resource('project', 'ProjectController');

    Route::resource('project-settings', 'ProjectSettingController');

    Route::resource('project-floors', 'ProjectFloorController');

    Route::resource('room-types', 'RoomTypeController');

    Route::resource('floor-rooms', 'FloorRoomController');

    Route::resource('user', 'UserController');

    Route::get('userroles', 'UserController@getUserRoles');

    Route::resource('tap-statics', 'TapStaticController');

    Route::group(['prefix' => 'tap-rounds'], function () {
        Route::get('', 'TapTimerController@index');
        Route::post('', 'TapTimerController@store');
        Route::put('/{timer}', 'TapTimerController@update');
        Route::put('/start-timer/{timer}', 'TapTimerController@startTimer');
    });

});



Route::group(["prefix" => "admin", "namespace" => "ApiController" ], function() {
    Route::post("login",  "AdminAuthenticationController@login");
    Route::post("logout", "AdminAuthenticationController@logout")->middleware('auth:api');
});