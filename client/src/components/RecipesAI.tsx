import React from 'react';

import { useNavigate } from 'react-router-dom';

import InfoTab from './InfoTab';
import Chatbox from './Chatbox';

const RecipesAI = () => {

    // verify that local storage has user login - else redirect
    const navigate = useNavigate();

    if (localStorage.getItem('cUser') === null) {
        navigate('/login');
    }

    // debug info
    console.log("User Logged In!");
    console.log("Session ID: " + localStorage.getItem('cUser'));

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