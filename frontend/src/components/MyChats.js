import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import Addicon from "../images/Addicon";
import {extractTime, extractTimeOderDate} from "../utils/functions";
import ButtonConfirm from "./utils/ButtonConfirm/ButtonConfirm";
import ConfirmModal from "./Modals/ConfirmModal/ConfirmModal";

const MyChats = ({ fetchAgain }) => {
    const [loggedUser, setLoggedUser] = useState();
    const { selectedChat, setSelectedChat, user, chats, setChats, setOpenCreateGroupChat, showToast } = ChatState();
    const [isOpen, setIsOpen] = useState(false);
    const [i, setI] = useState(null);

    const fetchChats = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}`},
                withCredentials: true
            };
            const { data } = await axios.get("http://localhost:5000/api/chat", config);
            setChats(data);
        } catch (error) {
            showToast (
                'failedloadchats'
            );
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
        // eslint-disable-next-line
    }, [fetchAgain]);
    console.log("chats  = ", chats );
    const onClickSpanFunction =(e, i)=> {
        setI(i);
        setIsOpen(true);
        e.preventDefault();
        alert("i = " + i);
        // setModal({ ...modal, view: "query"});
    }
    // const onConfirmDel=(type, param, id)=>
    // {
    //     console.log(type + param + id);
    // }
    const onClose =()=> {
        setIsOpen(false);
    }
    return (
        <div className='box31'  style={{display: `${!!selectedChat  ? 'none' : 'flex'}` }} >
            <div className=' myChats_header'>
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
                <ConfirmModal onClose={onClose} isOpen={isOpen} content = {"Реально треба видалити чат?"}  />
            </div>
            <div className='myChats'>
                {chats ? (
                    <div className='myChats-scroll'>
                        {chats.map((chat) => {    var shift = 0;
                            return <div className={`${selectedChat === chat ? "chat_item active" : "chat_item"}`}
                                 onClick={() => setSelectedChat(chat)}
                                 key={chat._id} onContextMenu={(e) => onClickSpanFunction(e, i)}>
                                <div className= {`chat_item-image ${chat.isGroupChat ? '' : 'noGroup'}`}>
                                    {/*<img src={`${chat.users[0].name == user.name ? chat.users[1].pic : chat.users[0].pic}`}  alt='' />*/}
                                    <img
                                        src={chat.isGroupChat ? chat.groupAdmin.pic : chat.users[0].name == user.name ? chat.users[1].pic : chat.users[0].pic}
                                        alt=''/>
                                    <div className='chat_item-image-images'>
                                        {chat.isGroupChat && chat.users.map((user, i) => {
                                            if (user.name === chat.groupAdmin.name) {
                                                shift = shift + 1;
                                                return
                                            }
                                            return <img style={{left: `${(-i + shift + '0px')}`}} key={i}
                                                        className='chat_item-image-images-image' src={user.pic}/>
                                        })}
                                    </div>
                                </div>
                                <div className='chat_item-text'>
                                    <div className='chat_item-name_date'>
                                        <p className='chat_item-name'>
                                            {!chat.isGroupChat
                                                ? getSender(loggedUser, chat.users)
                                                : chat.chatName}
                                        </p>
                                        <div className='chat_item-date_time'>
                                            <span>{extractTimeOderDate(chat.updatedAt)}</span></div>
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
                        })}
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
