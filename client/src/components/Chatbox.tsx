import React from 'react'
import {useEffect, useRef} from 'react'

import './Chatbox.css'

import sendIcon from '../assets/send.png'



interface ChatItemProps {
    chat_text: string;
    avatar_url?: string;
};
interface UserChatProps {
    chat_text: string;
};
interface AIChatProps {
    chat_text: string;
};
interface MessageProps {
    chat_text: string;
    isAI: boolean;
};

interface AIChatState {
    responding: boolean;
    response: string;
    response_time: number;
}


const ChatItem: React.FC<ChatItemProps> = ({chat_text, avatar_url}) => {
    return (
        // add a conditional rendering to the
        <div className={"chat-item"}>
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
                    chat_text.split("\n").map((line, index) => (
                        <p key={index}>{line}</p>
                    ))
                }
            </div>
        </div>
    )
}

const UserChat: React.FC<UserChatProps> = ({chat_text}) => {

    // remove the div of class chat-item-header
    // from the UserChat component

    return (
        <span className="user-chat">
            <ChatItem chat_text={chat_text}/>
        </span>
    )
}

const AIChat: React.FC<AIChatProps> = ({chat_text}) => {

    return (
        <span className="ai-chat">
            <ChatItem chat_text={chat_text} avatar_url={"https://upload.wikimedia.org/wikipedia/en/a/a6/Pok%C3%A9mon_Pikachu_art.png"}/>
        </span>
    )

};


const Chatbox = () => {
    const [messages, setMessagesState] = React.useState<MessageProps[]>([]);

    const chatboxRef = useRef(null);
    const [text, setText] = React.useState("");

    const handleTextChange  = (event) => {
        setText(event.target.value);
    }
    const handleTextSubmit = (event) => {
        var data = text;
        // check if has text even
        if (data.trim() === "") {
            console.log("there was no text");
            return;
        }

        // add a user text object to the
        // chat log
        const newMessage = {chat_text: data, isAI: false};
        setMessagesState([...messages, newMessage]);

        setText("");
        console.log(data);
        
    }
    const handleTextKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleTextSubmit(event);
        }
    }

    // scroll to bottom of chatbox
    useEffect(() => {
        if (chatboxRef.current)
            chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }, [messages]);
    return (
        <>
            <div className={"chatbox-container"}>
                <div className="chatbox-chatbox">
                    <div className={"chatbox-header"}>
                        <h1>Chatbox</h1>
                    </div>
                    <div className={"chatbox-scrollable"} ref={chatboxRef}>
                        <AIChat chat_text={"Hello! I am a chatbot. How can I help you today?"}/>
                        {messages.map((message, index) => (
                            message.isAI ?
                                <AIChat chat_text={message.chat_text} key={index}/>
                            :
                                <UserChat chat_text={message.chat_text} key={index}/>
                        ))}

                        <div className="end-extra-space"></div>
                    </div>
                </div>
                <div className="chatbox-text">
                    <textarea value={text} onChange={handleTextChange} onKeyDown={handleTextKeyDown} placeholder="Type a message..." />
                    {/* <button onClick={handleTextSubmit}>
                        <img src={sendIcon} width={32} height={32} alt="sendicon" />
                    </button> */}
                </div>
            </div>
        </>
    )
};

export default Chatbox;