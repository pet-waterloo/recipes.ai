import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { CohereClientV2 } from 'cohere-ai'


import sendIcon from '../assets/send.png'
import {BACKEND_IP, MAX_QUERY_LENGTH, MAX_RESPONSE_TOKENS } from '../constants'

import './Chatbox.css'



const COHERE = new CohereClientV2({
  token: '9HktGAxtxhvzTGcEb7UmVl1Px8M9SYv5Z9z5fpsp',
});



// ----------------------------------- //

interface ChatItemProps {
    content: string,
    avatar_url?: string,
    ai: boolean,
    created: number
}


const ChatItem: React.FC<ChatItemProps> = ({content, avatar_url, ai, created}) => {

    // attach a created date
    const classType = ai ? "ai" : "user";

    return (
        // add a conditional rendering to the
        <div className={`${classType}-chat`}>
        {/* // <div className={"ai-chat"}> */}
            <div className={"chat-item"}>
                {/* for icon image */}
                <div className="invisible-data">
                    <p className="created-date">{created}</p>
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
                        content.split("\n").map((line, index) => (
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
        {content: "Hello! I am a chatbot. Ask me anything!", ai: true, created: new Date().getTime()}
    ]);
    
    const [cObject, setCObject] = React.useState<ChatItemProps | null>(null);
    const [inputTextState, setInputTextState] = React.useState<string>("");
    
    const chatBoxRef = useRef<HTMLDivElement>(null);
    
    // -----------------------------------
    // testing purposes
    const [enableSendRequest, setEnableSendRequest] = React.useState<boolean>(true);


    // -----------------------------------
    // text input objects + functions
    const handleInputTextState = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (event.target.value.length > MAX_QUERY_LENGTH)
            // prevents changes
            return;
        setInputTextState(event.target.value);
    };
    
    const handleInputTextSubmit = () => {
        if (!enableSendRequest) return;
        setEnableSendRequest(false);

        console.log(inputTextState);
        setInputTextState("");

        // handle text request -- always a user request
        // handleNewMessage(inputTextState);
        // cohere does its job now
        handleNewResponse(inputTextState);
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
        const newMessage : ChatItemProps = {content: query_string, ai: false, created: new Date().getTime()};
        var cMessages = [...messages, newMessage];
        console.log(query_string);
        setMessages(cMessages);

        // post the data to backend
        const response = await fetch(`${BACKEND_IP}/conversation/messages/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMessage)
        });

        var newResponse : ChatItemProps = {content: "", ai: true, created: new Date().getTime()};
        cMessages = [...cMessages, newResponse];
        setMessages(cMessages);

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
                    ],
                    maxTokens: MAX_RESPONSE_TOKENS
                }
            );

            for await (const chatEvent of stream) {
                if (chatEvent.type === "content-start" || chatEvent.type === "content-delta") {
                    const text = chatEvent.delta?.message?.content?.text || '';
                    
                    // Update newResponse.message with incoming text
                    newResponse.content += text;

                    // Set the state using a functional update to ensure it's up-to-date
                    setMessages((prevMessages) => {
                        // Replace or append to the specific message in your message list
                        const updatedMessages = [...prevMessages];
                        const lastIndex = updatedMessages.length - 1;

                        // If this message is already being streamed, update it
                        if (lastIndex >= 0 && updatedMessages[lastIndex].created === newResponse.created) {
                            updatedMessages[lastIndex].content = newResponse.content;
                        } else {
                            // If it's a new message, push it to the array
                            updatedMessages.push({ created: new Date().getTime(), content: newResponse.message, ai: true });
                        }
                        return updatedMessages;
                    });
                }
            }
        } catch (error){
            console.error(error);
        } finally {
            // finally reset the stuff
            setEnableSendRequest(true);
        }
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
                    <div className={"chatbox-scrollable"} ref={chatBoxRef}>
                        {messages.map((data, index) => (
                            <ChatItem content={data.content} ai={data.ai} created={data.created} key={index}/>
                        ))}

                        {/* <AIChat chatData={currAIText != null ? currAIText?.chat_text : ""} key={currAIText?.index}/> */}

                        <div className="end-extra-space"></div>
                    </div>
                </div>
                <div className="chatbox-text">
                    <textarea value={inputTextState} onChange={handleInputTextState} onKeyDown={handleInputTextKeyDown} placeholder="Type a message..." />
                    {/* <label className="toggle-switch">
                        Enable Test Sending?
                        <input type="checkbox" checked={enableSendRequest} onChange={() => {
                            setEnableSendRequest(!enableSendRequest);
                        }} />
                        <span className="slider"></span>
                    </label> */}
                    <button onClick={handleInputTextSubmit}>
                        <img src={sendIcon} width={32} height={32} alt="sendicon" />
                    </button>
                </div>
            </div>
        </>
    )
};

export default Chatbox;