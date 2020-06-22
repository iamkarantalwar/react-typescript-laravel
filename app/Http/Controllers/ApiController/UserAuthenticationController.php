<?php

namespace App\Http\Controllers\ApiController;

use Str;
use Auth;
use Validator;
use App\User;
use App\Enums\UserRole;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UserAuthenticationController extends Controller
{
    public function create(Request $request) {
        //Check for validation 
        $validator = Validator::make($request->json()->all(), [
            'name'     => 'required',
            'email'    => 'required|unique:users,email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return ($validator->errors());
        }

        $user = User::create([
            "name"     => $request->post("name"),
            "email"    => $request->post("email"),
            "password" => Hash::make($request->post("password"))
        ]);

        $user->role()->create([
            "role_name" => UserRole::USER,
        ]);

        return $user;

    }

    public function login(Request $request) {
        try {
            //Check for validation 
            $validator = Validator::make($request->json()->all(), [
                'email'    => 'required',
                'password' => 'required',
            ]);

            if ($validator->fails()) {
                return ($validator->errors());
            }
            $user = ["email" => $request->post("email"), 
            "password" => $request->post("password")
            ];

            //Check If E-Mail and Password is correct.
            if(Auth::attempt($user)) {
                $user = User::where("email", $request->post("email"))->first();
                //Check If User Is Admin
                if($user->role->role_name == UserRole::USER) {
                    //Create a random string token
                    $token = Str::random(80);

                    // Attach a token with user
                    $user->forceFill([
                        'api_token' => hash('sha256', $token),
                    ])->save();
                    
                    //Return Token As A response
                    return ['token' => $token];

                } else {
                    return ['message' => 'Invalid Credentials'];
                }
            } else {
                return ['message' => 'Invalid Credentials'];
            }
        } catch (\Exception $th) {
            return ['message' => 'Something Went Wrong'];
        }
    }

    public function logout(Request $request) {
        //Fetch The Authenticate User
        $user = $request->user();

        //Check If User is Admin
        if($user->role->role_name == UserRole::USER) {
            $user->api_token = null;
            $user->save();
            return ['message' => 'User Logged Out Successfully'];
        } else {
            return ['message' => "You're not an user."];
        }
        
    }
}

