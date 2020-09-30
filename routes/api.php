<?php

use Illuminate\Http\Request;
// use Illuminate\Routing\Route;

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

Route::namespace('ApiController')->group(function(){

    Route::resource('team', 'TeamController');

    Route::group(['prefix' => 'project'], function () {

        Route::resource('', 'ProjectController');

        Route::get('/{project}/settings', 'ProjectSettingController@projectSettings');
        Route::put('/{project}/settings', 'ProjectSettingController@updateProjectSettings');

        Route::get('/{project}/settings/pumpstart', 'PumpstartOfProductController@index');
        Route::post('/{project}/settings/pumpstart', 'PumpstartOfProductController@store');
        Route::put('/{project}/settings/pumpstart/{pumpstart}', 'PumpstartOfProductController@update');
    });

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

    Route::resource('sections', 'SectionController');

});



Route::group(["prefix" => "admin", "namespace" => "ApiController" ], function() {
    Route::post("login",  "AdminAuthenticationController@login");
    Route::post("logout", "AdminAuthenticationController@logout")->middleware('auth:api');
});
