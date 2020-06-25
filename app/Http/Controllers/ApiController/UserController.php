<?php

namespace App\Http\Controllers\ApiController;

use Hash;
use App\User;
use App\Models\UserRole as UserRoleModel;
use App\Enums\UserRole;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\UserRequest;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
       
        return User::with(['role', 'team'])->get();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return abort(404);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(UserRequest $request)
    {
    
        $user = User::create([
            "name"     => $request->post("name"),
            "email"    => $request->post("email"),
            "password" => Hash::make($request->post("password")),
            "shortcode" => $request->post("shortcode"),
            "team_id"   => $request->post("team_id"),
        ]);

        $user->role()->create([
            "role_name" => $request->post("role_name"),
        ]);

        return User::with(['role', 'team'])->where("id", $user->id)->first();
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(UserRequest $request, User $user)
    {
        $user_updated = $user->update([
            "name"     => $request->post("name"),
            // "email"    => $request->post("email"),
            // "password" => Hash::make($request->post("password")),
            "shortcode" => $request->post("shortcode"),
            "team_id"   => $request->post("team_id"),
        ]);

        if ($user_updated) {

            $role_updated = $user->role()->update([
                "role_name" => $request->post("role_name"),
            ]);

            if($role_updated) {

                return User::with(['role', 'team'])->where("id", $user->id)->get();

            } else {
                return ["message" => "Something went wrong. Try again later."];
            }

        } else {
            return ["message" => "Something went wrong. Try again later."];
        }

       
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        //
    }

    public function getUserRoles() {
        return [
            ['role_name' => UserRole::ADMIN], 
            ['role_name' => UserRole::USER]
        ];
    }
}
