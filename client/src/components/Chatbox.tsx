import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { CohereClientV2 } from 'cohere-ai'


import sendIcon from '../assets/send.png'
import {BACKEND_IP, MAX_MESSAGE_LENGTH} from '../constants'

import './Chatbox.css'



const COHERE = new CohereClientV2({
  token: '9HktGAxtxhvzTGcEb7UmVl1Px8M9SYv5Z9z5fpsp',
});



// ----------------------------------- //

interface ChatItemProps {
    message: string,
    avatar_url?: string,
    ai: boolean,
}


const ChatItem: React.FC<ChatItemProps> = ({message, avatar_url, ai}) => {

    // attach a created date
    const createdDate = new Date().toLocaleTimeString();
    const classType = ai ? "ai" : "user";

    return (
        // add a conditional rendering to the
        <div className={`${classType}-chat`}>
        {/* // <div className={"ai-chat"}> */}
            <div className={"chat-item"}>
                {/* for icon image */}
                <div className="invisible-data">
                    <p className="created-date">{createdDate}</p>
                </div>
                {
                    avatar_url ? 
                        <div className="chat-item-header">
                            <img src={avatar_url}/>
                        </div>
                        : null
                }

                {/* turn input into a set of <p> objects for every new line */}
                <div className="chat-item-text">
                    {
                        message.split("\n").map((line, index) => (
                            <p key={index}>{line}</p>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}


const Chatbox = () => {
    const [chatboxRef, setChatboxRef] = React.useState(useRef<HTMLDivElement>(null));
    const [messages, setMessages] = React.useState<ChatItemProps[]>([
        {message: "Hello! I am a chatbot. Ask me anything!", ai: true}
    ]);
    
    const [cObject, setCObject] = React.useState<ChatItemProps | null>(null);
    const [inputTextState, setInputTextState] = React.useState<string>("");

    // -----------------------------------
    // testing purposes
    const [enableSendRequest, setEnableSendRequest] = React.useState<boolean>(false);


    // -----------------------------------
    // text input objects + functions
    const handleInputTextState = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputTextState(event.target.value);
    };
    
    const handleInputTextSubmit = () => {
        if (!enableSendRequest) return;
        setEnableSendRequest(false);

        console.log(inputTextState);
        setInputTextState("");

        // handle text request -- always a user request
        handleNewMessage(inputTextState);
    }

    const handleInputTextKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            // cancel the default action, if needed
            event.preventDefault();
            if (!enableSendRequest) return;

            // send request + disable request sending (until ai says otherwise)
            handleInputTextSubmit();
        }
    }

    // -----------------------------------
    // handling new message creation + ai response

    const handleNewResponse = async(query_string: string) => {
        // create a new message
        const newResponse : ChatItemProps = {message: query_string, ai: true};
        setMessages([...messages, newResponse]);

        // update message -> create copy of old + save it -> new message object
        try{
            const stream = await COHERE.chatStream(
                {
                    model: "command-r",
                    messages: [
                        {
                            role: "user",
                            content: query_string
                        }
                    ]
                }
            );

            for await (const chatEvent of stream) {
                if (chatEvent.type === "content-start" || chatEvent.type === "content-delta") {
                    const text = chatEvent.delta?.message?.content?.text;
                    console.log("AI message: ", text);
                    
                    const updatedMessage = { ...newResponse, message: newResponse.message + text };
                    setCObject(updatedMessage);
                }
            }
        } catch (error){
            console.error(error);
        }
        
    }

    const handleNewMessage = async (query_string: string) => {
        // create a new message
        const newMessage : ChatItemProps = {message: query_string, ai: false};
        setMessages([...messages, newMessage]);

        return fetch(`${BACKEND_IP}/api/ping`, {
            method: "GET"
        }).catch(
            (error) => {
                console.error(error);
            }
        ).then(
            (response) => {
                console.log(response);
            }
        );

        // ping the server
        // return fetch(`${BACKEND_IP}/api/ws/ai/`, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({
        //         query: query_string
        //     })
        // });
    }

    // -----------------------------------
    // set effect - updates

    // scroll when load
    useEffect(() => {
        if (chatboxRef.current)
            chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }, [messages]);
    
    // -----------------------------------
    // render

    return (
        <>
            <div className={"chatbox-container"}>
                <div className="chatbox-chatbox">
                    <div className={"chatbox-header"}>
                        <h1>Chatbox</h1>
                    </div>
                    <div className={"chatbox-scrollable"} ref={chatboxRef}>
                        {messages.map((data, index) => (
                            <ChatItem message={data.message} ai={data.ai} key={index}/>
                        ))}

                        {/* <AIChat chatData={currAIText != null ? currAIText?.chat_text : ""} key={currAIText?.index}/> */}

                        <div className="end-extra-space"></div>
                    </div>
                </div>
                <div className="chatbox-text">
                    <textarea value={inputTextState} onChange={handleInputTextState} onKeyDown={handleInputTextKeyDown} placeholder="Type a message..." />
                    <label className="toggle-switch">
                            Enable Test Sending?
                            <input type="checkbox" checked={enableSendRequest} onChange={() => {
                                setEnableSendRequest(!enableSendRequest);
                            }} />
                            <span className="slider"></span>
                        </label>
                    <button onClick={handleInputTextSubmit}>
                        <img src={sendIcon} width={32} height={32} alt="sendicon" />
                    </button>
                </div>
            </div>
        </>
    )
};

export default Chatbox;