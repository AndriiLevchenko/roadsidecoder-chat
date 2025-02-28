import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { ReactComponent as AddIcon } from './../images/plus-large.svg';

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
            // display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            style={{display: `${!!selectedChat  ? 'none' : 'flex'}` }}
        >
            <div className='myChatsHeader'>
                My Chats
                <GroupChatModal>
                    <button className='newChat' type='button' >
                        <span>New group chat</span>
                        <AddIcon className = 'icon chakra-icon' focusable="false" aria-hidden="true" />
                    </button>
                </GroupChatModal>
            </div>
            <div className='myChats'>
                {chats ? (
                    <Stack overflowY="scroll">
                        {chats.map((chat) => (
                            <div className='chatItem' onClick={() => setSelectedChat(chat)}
                                 style={{backgroundColor: `${selectedChat === chat ? '#38B2AC' : '#E8E8E8'}`,
                                        color: `${selectedChat === chat ? 'white' : 'black'}` }}

                                key={chat._id}
                            >
                                <p className='text'>
                                    {!chat.isGroupChat
                                        ? getSender(loggedUser, chat.users)
                                        : chat.chatName}
                                </p>
                                {chat.latestMessage && (
                                    <p className='lastMessage'>
                                        <b>{chat.latestMessage.sender.name} : </b>
                                        {chat.latestMessage.content.length > 50
                                            ? chat.latestMessage.content.substring(0, 51) + "..."
                                            : chat.latestMessage.content}
                                    </p>
                                )}
                            </div>
                        ))}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </div>
        </div>
    );
};

export default MyChats;
//equal
