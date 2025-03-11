import React, {useState} from 'react';
import {ChatState} from "../Context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
//import MyChatsChatBox from "../components/MyChatsChatBox";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";

const ChatPage = () => {
    const [fetchAgain, setFetchAgain] = useState(false);
    const {user} = ChatState();

    return (
        <div className='chatPage'>
            {user && <SideDrawer />}
            <div className='chatPage_myChats-singleChat' >
                {user &&  <MyChats fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /> }
            </div>
        </div>
    )
}

export default ChatPage
