<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('logout/','\App\Http\Controllers\Auth\LoginController@logout');

$auth_routes = ['login', 'logout', 'test'];

Route::view('/{path?}', 'app')
       ->where("path", '^(?!.*(login|logout|api|test)).*$')
       ->middleware(["auth"])
       ->name("frontend");


Route::get('test', '\App\Http\Controllers\ApiController\ExcelController@index');
Route::post('test', '\App\Http\Controllers\ApiController\ExcelController@postImport');

Auth::routes(['register' => false]);

Route::get('/home', 'HomeController@index')->name('home');
