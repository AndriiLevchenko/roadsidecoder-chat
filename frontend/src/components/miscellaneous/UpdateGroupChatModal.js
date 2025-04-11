import {
    // Modal,
    // ModalOverlay,
    // ModalContent,
    // ModalHeader,
    // ModalFooter,
    // ModalBody,
    // ModalCloseButton,
    // Button,
    // FormControl,
    // Input,
    useToast,
    // Box,
    // IconButton,
    Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
// import login from "../Authentication/Login";
import ConfirmModal from "../Modals/ConfirmModal/ConfirmModal";
import {ReactComponent as EyeIcon} from "../../images/eye-svgrepo.svg";
import Closeicon from "../../images/Closeicon";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const toast = useToast();

    const { selectedChat, setSelectedChat, user, openProfileModal, setOpenProfileModal } = ChatState();
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
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            setLoading(false);
        }
    };

    const handleRename = async () => {
        if (!groupChatName) return;

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

            console.log(data._id);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setRenameLoading(false);
        }
        setGroupChatName("");
    };

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: "User Already in group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
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
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
        setGroupChatName("");
    };
    let shift = 0;
//delete 1 group-participant
    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: "Only admins can remove someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
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

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
        setGroupChatName("");
        setIsOpenModal(false);
        setIsConfirmModal(false);
    };
    console.log("selectedChat = ", selectedChat);
    return (
        <>
            <button type='button' className='group_icon_button' onClick={()=>setOpenProfileModal(true)} >
                {/*<EyeIcon className = 'icon chakra-icon' focusable="false" aria-hidden="true" />*/}
                <div className='group_avatar'>
                    <img className='imgAvatar'  src={selectedChat.groupAdmin.pic} alt='imgAvatar'/>
                    <div className='chat_item-image-images'>
                         {selectedChat.users.map((user, i) => {
                             if(user.name === selectedChat.groupAdmin.name) { shift = shift + 1; return}
                             return <img style={{left: `${(-i*2 + shift*2 + '0px')}`}} key={i}  className='chat_item-image-images-image' src={user.pic} alt='groupMember'/>
                         })}
                    </div>
                </div>
            </button>
            < ConfirmModal isOpen={isOpenModal} onClose={onCloseModal} onConfirm={onConfirmModal} />
            { openProfileModal && <div className='modalContent chakra-modal__content-container css-wl0d9u' >
                {/*<ModalOverlay />*/}
                <div className='modalOverlay'></div>
                <div className='modalContentTime' role='dialog' tabIndex='-1' aria-modal='true'>
                    <div className='modal_header'>
                        {selectedChat.chatName}
                    </div>
                    {/*<ModalCloseButton />*/}
                    <button className='close_button' onClick={()=>setOpenProfileModal(false)}><Closeicon /></button>
                    {/*<div id='chakra-modal--body' className='modal_body' display="flex" flexDir="column" alignItems="center">*/}
                    <div id='chakra-modal--body' className='modal_body'>
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
                            <Spinner size="lg" />
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
