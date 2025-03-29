import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import Addicon from "../images/Addicon";
import {extractTime, extractTimeOderDate} from "../utils/functions";
import ButtonConfirm from "./utils/ButtonConfirm/ButtonConfirm";

const MyChats = ({ fetchAgain }) => {
    const [loggedUser, setLoggedUser] = useState();
    const { selectedChat, setSelectedChat, user, chats, setChats, setOpenCreateGroupChat } = ChatState();
    const toast = useToast();

    const fetchChats = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}`}
            };
            const { data } = await axios.get("http://localhost:5000/api/chat", config);
            //console.log("data  = ", data );
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
    const onConfirmDel=(type, param, id)=>
    {
        console.log(type + param + id);
    }
    return (
        <div className='box31'
            style={{display: `${!!selectedChat  ? 'none' : 'flex'}` }}
        >
            <div className='myChats_header'>
                <span>My Chats</span>
                <GroupChatModal>
                    <button className='newChat ' type='button'  onClick={()=>setOpenCreateGroupChat(true)} >
                        <span className=' new_group_button'>New group chat</span>
                        <span className=' close_button'>
                            <Addicon className = '' focusable="false" aria-hidden="true" />
                        </span>
                    </button>
                    {/*<ButtonConfirm  onConfirm={onConfirmDel.bind(this) }  title="Delete" query="Are you sure...?"  />*/}
                </GroupChatModal>
            </div>
            <div className='myChats'>
                {chats ? (
                    <div className='myChats-scroll'>
                        {chats.map((chat) => (
                            <div className={ `${selectedChat === chat ? "chat_item active" : "chat_item" }` } onClick={() => setSelectedChat(chat)}
                                 key={chat._id} >
                                <div className='chat_item-image'>
                                    <img src={`${chat.users[0].name == user.name ? chat.users[1].pic : chat.users[0].pic}`}  alt='' />
                                </div>
                                <div className='chat_item-text'>
                                    <div className='chat_item-name_date'>
                                        <p className='chat_item-name'>
                                            {!chat.isGroupChat
                                                ? getSender(loggedUser, chat.users)
                                                : chat.chatName}
                                        </p>
                                        <div className='chat_item-date_time'> <span>{extractTimeOderDate(chat.updatedAt)}</span></div>
                                    </div>
                                    <div className='chat_item-lastMessage'>
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

//equal
export default MyChats;
