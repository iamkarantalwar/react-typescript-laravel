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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::resource('project', 'ApiController\ProjectController');

Route::group(["prefix" => "admin", "namespace" => "ApiController" ], function() {
    Route::post("login",  "AdminAuthenticationController@login");
    Route::post("logout", "AdminAuthenticationController@logout")->middleware('auth:api');
});