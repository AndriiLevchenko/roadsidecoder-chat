import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button,
        useDisclosure, Input, useToast, Box } from "@chakra-ui/react";
import { FormControl } from "@chakra-ui/form-control"
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import Closeicon from "../../images/Closeicon";


const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const { user, chats, setChats, openCreateGroupChat, setOpenCreateGroupChat } = ChatState();

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
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
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please fill all the feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
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
            setOpenCreateGroupChat(false);
            toast({
                title: "New Group Chat Created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        } catch (error) {
            toast({
                title: "Failed to Create the Chat!",
                description: error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };
//const openProfileModal = true;

    return (
        <>
            <span >{children}</span>

            {/*<Modal  style={{background: "#35abc2"}} className='groupChatModal' onClose={onClose} isOpen={isOpen} >*/}
                { openCreateGroupChat && <div className=' create_group_chat' >
                {/*<ModalOverlay />*/}
                <div className='modalOverlay'></div>
                <div className='modal_section'>
                    <p className='modalHeader'>
                        Create Group Chat
                    </p>
                    {/*<ModalCloseButton />*/}
                    <button className='close_button' onClick={()=>setOpenCreateGroupChat(false)} ><Closeicon /></button>
                    <div className='modal_body' >
                        <div className='form_control'>
                            <input
                                className='updateInput'
                                placeholder="Chat Name"
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </div>
                        <div className='form_control'>
                            <input
                                className='updateInput'
                                placeholder="Add Users eg: John, Piyush, Jane"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        <div  className='badges_box' >
                            {selectedUsers.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleDelete(u)}
                                />
                            ))}
                        </div>
                        <div className='items_box'>
                            {loading ? (
                                // <ChatLoading />
                                <div>Loading...</div>
                            ) : (
                                searchResult
                                    ?.slice(0, 4)
                                    .map((user) => (
                                        <UserListItem
                                            key={user._id}
                                            user={user}
                                            handleFunction={() => handleGroup(user)}
                                        />
                                    ))
                            )}
                        </div>
                    </div>
                    <div className='modal_footer'>
                        <button className='enter_button' onClick={handleSubmit} colorScheme="blue">
                            Create Chat
                        </button>
                    </div>
                </div>
             </div>  }
            {/*</Modal>*/}
        </>
    )
}
export default GroupChatModal
