
import React from 'react';


import './InfoTab.css';
import logo from "../assets/logo.png";

import {BACKEND_IP} from '../constants';


// ----------------------------------- //
import { InfoTabProps } from '../assets/Objects'


const InfoTabCard: React.FC<InfoTabProps> = ({ image_url, card_title }) => {
    return (
        <div className={"infotab-card"}>
            <img src={image_url} />
            <h1>{card_title}</h1>
        </div>
    )
}
const InfoTabButton = () => {
    return (
        <div className={"infotab-button"}>
            <h1>InfoTabButton</h1>
        </div>
    )
}


const InfoTab = () => {

    const cards = Array.from({length: 20});

    return (
        <div className="infotab-container">
            <div className="infotab-header">
                <h1>InfoTab</h1>
            </div>
            <div className="infotab-scrollable">
                <InfoTabButton />
                <InfoTabCard card_title={"InfoTabCard"} image_url={"https://upload.wikimedia.org/wikipedia/en/a/a6/Pok%C3%A9mon_Pikachu_art.png"} />

                {cards.map((_, index) => (
                    <InfoTabCard
                        card_title = {`InfoTabCard ${index+1}`}
                        image_url = "https://upload.wikimedia.org/wikipedia/en/a/a6/Pok%C3%A9mon_Pikachu_art.png"
                        key={index}
                    />
                ))}

                <div className="end-extra-space" style={{height: "10px"}}></div>
            </div>

            <div className="infotab-footer">
                <img src={logo} alt="logo"/>
            </div>

            <div className={"end-extra-space"}></div>
        </div>
    );

};



export default InfoTab;


