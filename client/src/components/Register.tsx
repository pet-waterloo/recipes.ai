

import React from "react";
import { useNavigate } from "react-router-dom";

import { UserDataObject } from "../assets/Objects";

import { BACKEND_IP } from "../constants";

// ----------------------------------- //

const Register = (editCUserFunc: (user: UserDataObject | null) => void) => {
    const [registerData, setRegisterData] = React.useState<UserDataObject | null>(null);
    const emailRef = React.useRef<HTMLInputElement>(null);
    const passwordRef = React.useRef<HTMLInputElement>(null);
    const confirmPasswordRef = React.useRef<HTMLInputElement>(null);


    const navigate = useNavigate();

    // ----------------------------------- //

    const onRegisterSubmit = async (e: any) => {
        
        if (emailRef.current === null || passwordRef.current === null || confirmPasswordRef.current === null) {
            console.log("Invalid Input Data");
            e.preventDefault();
            return;
        }

        if (passwordRef.current?.value !== confirmPasswordRef.current?.value) {
            console.log("Passwords do not match");
            e.preventDefault();
            return;
        }

        // check if valid email
        if (emailRef.current?.value.endsWith('@gmail.com') == false) {
            console.log("Invalid Email");
            e.preventDefault();
            return;
        }

        e.preventDefault();

        console.log("Registering User");

        // send post request to backend
        await fetch(
            `${BACKEND_IP}/user/register/`,
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
            resp.json().then((data) => {
                console.log(data)
                if (data.accepted === true){
                    console.log("User Registered");
                    return;
                } else {

                }
            });
                
        });


    }

    // ----------------------------------- //

    return (
        <div>
            <h1>Register</h1>


            <form onSubmit={onRegisterSubmit}>
                <label>Email</label>
                <input type="text" placeholder="Email" ref={emailRef}/>

                <label>Password</label>
                <input type="password" placeholder="Password" ref={passwordRef}/>

                <label>Confirm Password</label>
                <input type="password" placeholder="Confirm Password" ref={confirmPasswordRef}/>

                <button type="submit">Register</button>
            </form>

            <div>
                <button onClick={() => {navigate("/login")}}>Login</button>
            </div>
        </div>
    )
}

export default Register;