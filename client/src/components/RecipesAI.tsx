import React from 'react';

import { useNavigate } from 'react-router-dom';

import InfoTab from './InfoTab';
import Chatbox from './Chatbox';

import { BACKEND_IP } from '../constants';

const RecipesAI = () => {

    // verify that local storage has user login - else redirect
    const navigate = useNavigate();

    // check if valid session id
    const handleLogin = async () => {
        const session_id = localStorage.getItem('session_id');
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
        });
    };

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

        handleLogin();
        // debug info
        console.log("User Logged in with | Session ID: " + localStorage.getItem('session_id'));

    });


    return (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet"></link>

            <div className={"container"}>

                <div className={"container-grid"}>
                <InfoTab />
                <Chatbox />
                </div>
                
            </div>
        </>
    )
}

export default RecipesAI;