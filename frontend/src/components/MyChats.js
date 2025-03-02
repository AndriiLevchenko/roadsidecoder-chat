import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import Addicon from "../images/Addicon";

const MyChats = ({ fetchAgain }) => {
    const [loggedUser, setLoggedUser] = useState();
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
    const toast = useToast();

    const fetchChats = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}`}
            };
            const { data } = await axios.get("http://localhost:5000/api/chat", config);
            console.log("data  = ", data );
            setChats(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
        // eslint-disable-next-line
    }, [fetchAgain]);
    console.log("chats  = ", chats );
    return (
        <div className='box31'
            style={{display: `${!!selectedChat  ? 'none' : 'flex'}` }}
        >
            <div className='myChatsHeader'>
                My Chats
                <GroupChatModal>
                    <button className='newChat' type='button' >
                        <span>New group chat</span>
                        <Addicon className = 'icon chakra-icon' focusable="false" aria-hidden="true" />
                    </button>
                </GroupChatModal>
            </div>
            <div className='myChats'>
                {chats ? (
                    <div className='myChats-scroll'>
                        {chats.map((chat) => (
                            <div className={ `${selectedChat === chat ? "chatItem active" : "chatItem" }` } onClick={() => setSelectedChat(chat)}
                                key={chat._id}
                            >
                                <div className='chatItemImage'>
                                    <img src={`${chat.users[0].name == user.name ? chat.users[1].pic : chat.users[0].pic}`}  alt='' />
                                </div>
                                <div>
                                    <p className='text'>
                                        {!chat.isGroupChat
                                            ? getSender(loggedUser, chat.users)
                                            : chat.chatName}
                                    </p>
                                    {chat.latestMessage && (
                                        <p className=' text lastMessage'>
                                            <b>{chat.latestMessage.sender.name} : </b>
                                            {chat.latestMessage.content.length > 50
                                                ? chat.latestMessage.content.substring(0, 51) + "..."
                                                : chat.latestMessage.content}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <ChatLoading />
                )}
            </div>
        </div>
    );
};

export default MyChats;
//equal
