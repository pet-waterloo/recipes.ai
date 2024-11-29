
import React from 'react';
import {useNavigate} from 'react-router-dom';

import { UserDataObject, UserLoginObject } from '../assets/Objects';
import { BACKEND_IP, GOOGLE_AUTH_KEY } from '../constants';


// ----------------------------------- //

const OAuthLogin = () => {
    const endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

    const params = {
        "client_id": GOOGLE_AUTH_KEY,
        "redirect_uri": `${BACKEND_IP}/auth/google-callback/`,
        "response_type": "code",
        "scope": "email profile",
        "include_granted_scopes": "true",
        "state": crypto.randomUUID(),
    };

    const queryString = new URLSearchParams(params).toString();
    const url = `${endpoint}?${queryString}`;

    // redirect to goole oauth url
    window.location.href = url;
};


// the function will
// take in no arguments
const Login = () => {

    const [loginData, setLoginData] = React.useState<UserLoginObject | null>(null);
    const emailRef = React.useRef<HTMLInputElement>(null);
    const passwordRef = React.useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    // return object
    const handleLogin = async (e: any) => {
        // check if email is a valid email
        if (emailRef.current === undefined || passwordRef.current?.value === undefined || emailRef.current?.value.endsWith('@gmail.com') == false) {
            console.log("Invalid Email");
            // TODO - implement notification system
            e.preventDefault();
            return ;
        }
        e.preventDefault();

        // send login request to backend
        const result = await fetch(
            `${BACKEND_IP}/user/login/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailRef.current?.value,
                    password: passwordRef.current?.value
                })
            }
        ).then((resp) => {
            const val = resp.json().then((data) => {
                // check the response
                console.log(data);
                if (data.accepted === true) {
                    // get login data
                    localStorage.setItem('session_id', data.session_id);
                    console.log(data.session_id);
                    navigate('/');
                }
            });
        });
    }

    // read the query query variables from url
    React.useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);

        // extract key values from query params
        // check if query string exists and has valid accepted
        const accepted = queryParams.get('accepted');
        const session_id = queryParams.get('session_id');

        if (accepted === null || session_id === null) {
            if (localStorage.getItem('session_id') === null) {
                navigate('/login');
            }
        }

        // save the session id into local storage
        localStorage.setItem('session_id', session_id);

        // handle normal login
        const result = fetch(
            `${BACKEND_IP}/user/verify/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session_id: session_id
                })
            }
        ).then((resp) => {
            const val = resp.json().then((data) => {
                // check the response
                console.log(data);
                if (data.accepted === false) {
                    navigate('/login');
                }
            });
            // navigate to dashboard
            navigate('/');
        });

        // debug info
        console.log("User Logged in with | Session ID: " + localStorage.getItem('session_id'));

    }, []);



    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={handleLogin}>
                <label>Email</label>
                <input type="text" name="email" ref={emailRef}/>
                <br />

                <label>Password</label>
                <input type="password" name="password" ref={passwordRef}/>
                <br />
                
                <button>Login</button>
            </form>

            <button onClick={OAuthLogin}>
                Login with Google
            </button>

            <div>
                <button onClick={() => {navigate("/register")}}>Create Account</button>
            </div>

        </div>
    );
};

export default Login;