import React from 'react'
import {useEffect, useRef} from 'react'

import './Chatbox.css'

import sendIcon from '../assets/send.png'

import {BACKEND_IP, MAX_MESSAGE_LENGTH} from '../constants'

import { CohereClientV2 } from 'cohere-ai'


const COHERE = new CohereClientV2({
  token: '9HktGAxtxhvzTGcEb7UmVl1Px8M9SYv5Z9z5fpsp',
});


interface ChatItemProps {
    chat_text: string;
    avatar_url?: string;
};
interface UserChatProps {
    chat_text: string;
};
interface AIChatProps {
    chatData: string;
};
interface MessageProps {
    chat_text: string;
    isAI: boolean;
    index: number;
};
interface AIChatState {
    responding: boolean;
}
interface ChatRequest {
    message: string;
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

const AIChat: React.FC<AIChatProps> = ({chatData}) => {
    return [
        (
            <div className="ai-chat">
                <ChatItem chat_text={chatData} avatar_url={"https://upload.wikimedia.org/wikipedia/en/a/a6/Pok%C3%A9mon_Pikachu_art.png"}/>
            </div>
        )
    ]

};


const Chatbox = () => {
    // for all chat messages
    const [messages, setMessagesState] = React.useState<MessageProps[]>([]);

    // for current ai state - check if responding or not
    const [aiState, setAIState] = React.useState<AIChatState>({responding: false});
    // for current message text
    const [currAIText, setCurrAIText] = React.useState<MessageProps | null>(null);

    const chatboxRef = useRef(null);
    const [text, setText] = React.useState("");


    const handleTextChange  = (event: any) => {
        if (event.target.value.length > MAX_MESSAGE_LENGTH) {
            return;
        }
        // update text
        setText(event.target.value);
    }
    const handleTextSubmit = (event: any) => {
        var data = text;
        // check if has text even
        if (data.trim() === "") {
            console.log("there was no text");
            return;
        }
        // check if ai is responding
        if (aiState.responding) {
            // cannot send
            console.log("ai is responding");
            return;
        }
        
        // reset text input box data
        setText("");
        console.log(data);
        
        // create new ai chat
        const newAIChat = {chat_text: "", isAI: true, index: messages.length+2};
        setCurrAIText(newAIChat);
        // update necessary states -- chatResponse now contains current aichat data
        // add a user text object to the chat log
        const newMessage = {chat_text: data, isAI: false, index: messages.length+1};
        setMessagesState([...messages, newMessage, newAIChat]);


        // set ai state
        aiState.responding = true;
        setAIState(aiState);

        // send a request to the server
        sendChatQuery(data);
        
    }
    const handleTextKeyDown = (event: any) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleTextSubmit(event);
        }
    }
    const sendChatQuery = async (message: string) => {
        console.log("sending request: " + message);

        const stream = await COHERE.chatStream({
            model: 'command-r',
            messages: [
            {
                role: 'user',
                content: message,
            },
            ],
        });
        
        for await (const chatEvent of stream) {
            if (chatEvent === undefined){
                continue;
            }
            if (chatEvent.type === 'content-delta') {
                // chat event is defined
                const cText = currAIText;
                if (cText != null){
                    cText.chat_text = cText.chat_text + chatEvent.delta?.message?.content?.text;
                    console.log(currAIText);
                    setCurrAIText(cText);
                }
            }else if(chatEvent.type === 'content-end'){
                break;
            }
        }

        // when done, update ai state
        const state = aiState;
        state.responding = false;
        setAIState(state);
    }

    // testing


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
                        <AIChat chatData={"Hello! I am a chatbot. How can I help you today?"}/>
                        {messages.map((message, _) => (
                            message.isAI ?
                                <AIChat chatData={message.chat_text} key={message.index}/>
                            :
                                <UserChat chat_text={message.chat_text} key={message.index}/>
                        ))}

                        <AIChat chatData={currAIText != null ? currAIText?.chat_text : ""} key={currAIText?.index}/>

                        <div className="end-extra-space"></div>
                    </div>
                </div>
                <div className="chatbox-text">
                    <textarea value={text} onChange={handleTextChange} onKeyDown={handleTextKeyDown} placeholder="Type a message..." />
                    <button onClick={handleTextSubmit}>
                        <img src={sendIcon} width={32} height={32} alt="sendicon" />
                    </button>
                </div>
            </div>
        </>
    )
};

export default Chatbox;