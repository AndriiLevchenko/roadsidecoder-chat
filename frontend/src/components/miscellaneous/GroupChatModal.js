import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import Closeicon from "../../images/Closeicon";
import ButtonConfirm from "../utils/ButtonConfirm/ButtonConfirm";
import ConfirmModal from "../Modals/ConfirmModal/ConfirmModal";


const GroupChatModal = ({children}) => {
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]); //це юзери які плануються в нову групу. Локально.
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    //const toast = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenCreateDelete, setIsOpenCreateDelete] = useState(false);
    const [userForDelete, setUserForDelete] = useState(null);

    const { user, chats, setChats, openCreateGroupChat, setOpenCreateGroupChat, showToast } = ChatState();

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            showToast (
                'useralreadyadded'  //Checked      Юзер вже в групі яка лише створюється
            );
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    };
    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) { return }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);
            console.log(data);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            showToast (
                'errorsearchresults'  //checked
            );
        }
    };

    // const handleDelete = (delUser) => {
    //     setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    // };
    const handleDelete = () => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== userForDelete._id));
    };
    const setIsOpenCreateDeleteFunction =(u)=> {
        setUserForDelete(u);
        setIsOpenCreateDelete(true)
    }
    console.log("chats = ", chats);
    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            showToast (
                'fields'
            );
            return;
        }
        if (selectedUsers.length < 2) {
            showToast (
                'grouptoosmall'
            );
            return;
        }
        const chatNameExist = chats.find(chatName => chatName.chatName === groupChatName);
        if (chatNameExist) {
            showToast (
                'alreadyexists'
            );
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(
                `http://localhost:5000/api/chat/group`,
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id)),
                },
                config
            );
            setChats([data, ...chats]);
            //onClose();
            //setOpenCreateGroupChat(false);
            showToast (
                'groupchatcreated'
            );
            setGroupChatName("");
            setSelectedUsers([]);
            setSearchResult([]);
            setSearch("");
        } catch (error)  {
            // error.response.data тепер безпосередньо об'єкт з бекенду
            const errorMessage = error.response?.data?.message || 'Failed to create group';
            console.error('Error creating group:', errorMessage);
            showToast (
                'errorcreategroup'
            );
        }
    };
//const openProfileModal = true;
    const onConfirmDel=(type, param, id)=>
    {
        console.log("type + param + id = ", type, " ",  param, " ",  id);
        if(type === "yes") {
            handleSubmit();
        } else if(type === "no") {
            setGroupChatName("");
            setSelectedUsers([]);
            setSearchResult([]);
            setSearch("");
            return
        }
        return
    }
    return (
        <>
            <span className='modal_group_chat'>{children}</span>
            {/*<Modal  style={{background: "#35abc2"}} className='groupChatModal' onClose={onClose} isOpen={isOpen} >*/}
                { openCreateGroupChat && <div className=' create_group_chat' >
                <div className='modalOverlay'></div>
                <div className='dialog_alert modal_section'>
                    <p className='modal_header'>
                        Create Group Chat
                    </p>
                    <button className='close_button' onClick={()=>setOpenCreateGroupChat(false)} ><Closeicon /></button>
                    <div className='modal_body' >
                        <div className='form_control'>
                            <input
                                className='updateInput'
                                placeholder="Chat Name"
                                onChange={(e) => setGroupChatName(e.target.value)}
                                value={groupChatName}
                            />
                        </div>
                        <div className='form_control'>
                            <input
                                className='updateInput'
                                placeholder="Add Users: John, Salman, Jane"
                                onChange={(e) => handleSearch(e.target.value)}
                                value={search}
                            />
                        </div>
                        <div  className='badges_box' >
                            {selectedUsers.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={()=>setIsOpenCreateDeleteFunction(u)}
                                    // handleFunction={() => handleDelete(u)}

                                />
                            ))}
                            <ConfirmModal isOpen={isOpenCreateDelete} onConfirm={handleDelete} content="Do you really want to remove the user from the list?" onClose={()=>setIsOpenCreateDelete(false)}/>
                        </div>
                        <div className='items_box'>
                            {loading ? (
                                // <ChatLoading />
                                <div>Loading...</div>
                            ) : (
                                searchResult
                                    ?.slice(0, 4)
                                    .map((user) => (
                                        <UserListItem    //Юзери для додавання в групу
                                            key={user._id}
                                            user={user}
                                            handleFunction={() => handleGroup(user)}
                                        />
                                    ))
                            )}
                        </div>
                    </div>
                    <div className='modal_footer'>
                        {/*<button className='enter_button' onClick={handleSubmit} colorScheme="blue">*/}
                        {/*    Create Chat*/}
                        {/*</button>*/}
                        {/*<ButtonConfirm  className='button' onConfirm={()=>{ setIsOpen(true); onConfirmDel.bind(this); } } title="Create Chat" query={"Are you sure you want to create group" + groupChatName + "?"}  />*/}
                        <button className="button" onClick={()=>setIsOpen(true)}>Create Chat</button>
                        <ConfirmModal isOpen={isOpen} onConfirm={handleSubmit} content="Do you really want to create a new chat?" onClose={()=>setIsOpen(false)}/>
                    </div>
                </div>
             </div>  }
            {/*</Modal>*/}
        </>
    )
}
export default GroupChatModal
