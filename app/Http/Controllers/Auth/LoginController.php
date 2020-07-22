<?php

namespace App\Http\Controllers\Auth;

use Str;
use Auth;
use App\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/';

    protected function destroyToken() {
        $user = Auth::user();
        User::where('id', $user->id)->update([
            'api_token' => null,
        ]);
    }

    protected function generateToken() {
        $token = null;
        $user = Auth::user();
        //If token is not available then generate it
        if(Auth::user()->api_token == null )
        {
            //Generate a random token
            $token = Str::random(80);

            // Attach a token with user
            $user->forceFill([
                'api_token' => hash('sha256', $token),
            ])->save();
            
            //Return Token As A response
            session(['token' => $token, 'role' => $user->role->role_name]);
        } else {
            //Return Token As A response
            session(['token' => $user->api_token, 'role' => $user->role->role_name]);
        }
    }
    
    protected function authenticated(Request $request, $user)
    {
        $this->generateToken();
    }

    public function logout(Request $request)
    {
        try {
            $this->destroyToken();
        } catch (\Throwable $th) {
            //throw $th;
        }
       

        $this->guard()->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return $this->loggedOut($request) ?: redirect('/');
    }

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }
}
