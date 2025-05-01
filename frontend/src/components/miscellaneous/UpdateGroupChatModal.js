// import { useToast,} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import ConfirmModal from "../Modals/ConfirmModal/ConfirmModal";
import Closeicon from "../../images/Closeicon";
import SpinnerCustom from "../SpinnerCustom";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    // const toast = useToast();

    const { selectedChat, setSelectedChat, user, openProfileModal, setOpenProfileModal, showToast } = ChatState();
    const [isOpenModal, setIsOpenModal] = useState(false); //modal Window Skynix
    const [isConfirmModal, setIsConfirmModal] = useState(false); //modal Window Confirm Skynix
    const onConfirmModal =()=> {
        setIsConfirmModal(true);
        setIsOpenModal(false);
    }
    const onCloseModal =()=> {
        setIsOpenModal(false);
    }

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }

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
                'errorsearchresults'       //checked
            );
            setLoading(false);
        }
    };

    const handleRename = async () => {
        if (!groupChatName) return;
        if (selectedChat.groupAdmin._id !== user._id) {
            showToast (
                'onlyadmin'       //checked
            );
            return;
        }
        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `http://localhost:5000/api/chat/rename`,
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                },
                config
            );
            showToast (
                'changesuccess'       //checked
            );
            console.log(data._id);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            showToast (
                'errorgroup'       //checked
            );
            console.log("Error Occured!", error.response.data.message);
            setRenameLoading(false);
        }
        setGroupChatName("");
    };

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            showToast (
                'useralreadyadded'       //checked
            );
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            showToast (
                'onlyadmin'       //checked
            );
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `http://localhost:5000/api/chat/groupadd`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );
            console.log("data = ", data);
            showToast (
                'newusercreated'       //checked
            );
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            console.log("Error Occured! ", error.response.data.message);
            showToast (
                'erroradduser'       //checked
            );
            setLoading(false);
        }
        setGroupChatName("");
    };
    let shift = 0;
//delete 1 group-participant
    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            showToast (
                'onlyadmin'       //checked
            );
            return;
        }
        if (selectedChat.groupAdmin._id === user1._id) {
            setIsOpenModal(true);
            // if(isOpenModal === true && isConfirmModal === true) {
            //     console.log("isOpenModal, isConfirmModal = ", isOpenModal, isConfirmModal);
            //     setIsOpenModal(true);
            //     setIsConfirmModal(false);
            // } else {
            //     setIsOpenModal(false);
            //     return;
            // }
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `http://localhost:5000/api/chat/groupremove`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );
alert("group removed !!!!!!")
            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            console.log("Error Occured!", error.response.data.message);
            showToast (
                'errorgroup'       //checked
            );
            setLoading(false);
        }
        setGroupChatName("");
        setIsOpenModal(false);
        setIsConfirmModal(false);
    };

    return (
        <>
            <button type='button' className='group_icon_button' onClick={()=>setOpenProfileModal(true)} >
                <div className='group_avatar'>
                    <img className='imgAvatar'  src={selectedChat.groupAdmin.pic} alt='imgAvatar'/>
                    <div className='chat_item-image-images carousel'>
                         {selectedChat.users.map((user, i) => {
                             if(user.name === selectedChat.groupAdmin.name) { shift = shift + 1; return}
                             return <img style={{left: `${(-i*2 + shift*2 + '0px')}`}} key={i}  className='chat_item-image-images-image' src={user.pic} alt='groupMember'/>
                         })}
                    </div>
                </div>
            </button>
            < ConfirmModal isOpen={isOpenModal} onClose={onCloseModal} onConfirm={onConfirmModal} />
            { openProfileModal && <div className='modalContent' >
                <div className='modalOverlay'></div>
                <div className='modalContentTime' role='dialog' tabIndex='-1' aria-modal='true'>
                    <div className='modal_header'>
                        {selectedChat.chatName}
                    </div>
                    <button className='close_button' onClick={()=>setOpenProfileModal(false)}><Closeicon /></button>
                    <div className='modal_body'>
                        <div className='badgeBlock' >
                            {selectedChat.users.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    admin={selectedChat.groupAdmin}
                                    handleFunction={() => handleRemove(u)}
                                />
                            ))}
                        </div>
                        <div className='updateBlock'>
                            <input
                                placeholder="Chat Name"
                                className='updateInput'
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <button
                                className='update_button button'
                                isLoading={renameloading}
                                onClick={handleRename}
                            >
                                Update
                            </button>
                        </div>
                        <div className='updateBlock'>
                            <input
                                placeholder="Add User to group"
                                className='updateInput'
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>

                        {loading ? (
                            <SpinnerCustom />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleAddUser(user)}
                                />
                            ))
                        )}
                    </div>
                    <div className='update_footer'>
                        <button className=' button update_button' onClick={() => handleRemove(user)} >
                            Leave Group
                        </button>
                    </div>
                </div>
            </div> }
        </>
    );
};

export default UpdateGroupChatModal;
