
import React from 'react';
import {useNavigate} from 'react-router-dom';

import { UserDataObject, UserLoginObject } from '../assets/Objects';

import { BACKEND_IP } from '../constants';

// ----------------------------------- //


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
                    console.log(data.user_hash);
                    localStorage.setItem('cUser', data.user_hash);
                    navigate('/');
                }
            });
        });

    }

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

            <div>
                <button onClick={() => {navigate("/register")}}>Create Account</button>
            </div>

        </div>
    );
};

export default Login;