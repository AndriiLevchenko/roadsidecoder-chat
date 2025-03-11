import React, { useState} from 'react'
import {
    Avatar,
    Box,
    Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input,
    // Menu,
    // MenuButton,
    // MenuDivider,
    // MenuItem,
    // MenuList,
    Spinner,
    Text,
    Tooltip,
} from "@chakra-ui/react";
import {
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
} from "@chakra-ui/menu";
import { useDisclosure} from "@chakra-ui/hooks";
import axios from "axios";
import {useToast} from "@chakra-ui/toast";
import ProfileModal from "./ProfileModal";
import {useHistory} from "react-router-dom";
import ChatLoading from "../ChatLoading";
import { getSender } from "../../config/ChatLogics";
import UserListItem from "../userAvatar/UserListItem";
import {ChatState} from "../../Context/ChatProvider";
import Bellicon from "./../../images/Bellicon";

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    // const [openProfileModal, setOpenProfileModal] = useState(false);
    const [openNotifications, setOpenNotifications] = useState(false);
    // const [openAvatar, setOpenAvatar] = useState(false)
    const {openAvatar, setOpenAvatar, user, setSelectedChat, chats, setChats, notification, setNotification, openProfileModal, setOpenProfileModal } = ChatState();
    //console.log("notification in Drawer = ", notification);
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const history = useHistory();
    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    };
    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }
        try {
            setLoading(true);
            //console.log("user.token = ", user.token);
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);
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
    }

    const accessChat = async (userId) => {
        //console.log(userId);
        try {
            setLoadingChat(true);
            const config = {
                headers: { "Content-type": "application/json", Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.post(`http://localhost:5000/api/chat`, { userId }, config);

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }
    const setModalCloseMenu =()=> {
        setOpenProfileModal(true);
        setOpenAvatar(false);
    }
    console.log("user in SideDrawer  = ", user);
        return (
        <>
            <Box   display="flex" justifyContent="space-around" alignItems="center" bg="white"  w="100%" p="5px 10px 5px 10px" borderWidth="5px">
                <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
                    <Button variant="ghost" onClick={onOpen} >
                        <i className="fas fa-search"></i>
                        <p className = 'searchUser'>
                            Search User
                        </p>
                    </Button>
                </Tooltip>
                <h2 fontSize="2xl" fontFamily="Work sans">
                    Talk-A-Tive
                </h2>
                <div className='rightMenu'>
                    <div className = 'notificationMenu'  >
                        <button className='notification' onClick={()=>setOpenNotifications(!openNotifications)}>
                            <Bellicon className = '' focusable="false" aria-hidden="true" />
                            <span className='icon-button'>{notification.length}</span>
                        </button>
                        {openNotifications &&
                            <ul className='listMenu'>
                                {!notification.length && "No New Messages"}
                                {notification.map((notif) => (
                                    <li className='listElement'>
                                    <button className='myProfile'
                                        key={notif._id}
                                            tabindex="-1"
                                        onClick={() => {
                                            setSelectedChat(notif.chat);
                                            setNotification(notification.filter((n) => n !== notif));
                                        }}
                                    >
                                        {notif.chat.isGroupChat
                                            ? `New Message in ${notif.chat.chatName}`
                                            : `New Message from ${getSender(user, notif.chat.users)}`}
                                    </button>
                                    </li>
                                ))}
                            </ul>
                        }
                    </div>
                    <Menu>
                        <button className='buttonAvatar' onClick={()=>setOpenAvatar(!openAvatar)}>
                            <span className='spanAvatar'>
                                <img className='imgAvatar' name={user.name} src={user.pic} />
                            </span>
                        </button>
                        { openAvatar && <ul className='listMenu'>
                            <li className='listElement'>
                                <ProfileModal user={user}  >
                                    <button onClick={()=>setOpenProfileModal(true)}   className='myProfile' >My Profile</button>{" "}
                                </ProfileModal>
                            </li>
                                <hr />
                            <li className='listElement'>
                                <button  className='myProfile' onClick={logoutHandler} >Logout</button>
                            </li>
                        </ul> }
                    </Menu>
                </div>
            </Box>
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent className='drawer_content'>
                    <div className='blockSearchHeader' borderBottomWidth="1px">Search Users</div>
                    <div className='blockSearchGross'>
                        <div className='blockSearch'>
                            <input
                                className='inputSearch'
                                placeholder="Search by name or email"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button onClick={handleSearch}>Gooo</button>
                        </div>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )}
                        {loadingChat && <Spinner ml="auto" d="flex" />}
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    )
}
export default SideDrawer
