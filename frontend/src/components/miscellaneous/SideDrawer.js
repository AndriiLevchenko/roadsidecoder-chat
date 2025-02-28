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
import { ChevronDownIcon } from "@chakra-ui/icons";
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
    const {user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
    console.log("notification in Drawer = ", notification);
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
            console.log("user.token = ", user.token);
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
        console.log(userId);
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

        return (
        <>
            <Box   display="flex" justifyContent="space-between" alignItems="center" bg="white"  w="100%" p="5px 10px 5px 10px" borderWidth="5px">
                <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
                    <Button variant="ghost" onClick={onOpen} >
                        <i className="fas fa-search"></i>
                        <Text display={{ base: "none", md: "flex" }} px={4}>
                            Search User
                        </Text>
                    </Button>
                </Tooltip>
                <Text fontSize="2xl" fontFamily="Work sans">
                    Talk-A-Tive
                </Text>
                <div>
                    <Menu>
                        <button className='notification '>
                            <Bellicon className = '' focusable="false" aria-hidden="true" />
                            <span className='icon-button'>{notification.length}</span>
                        </button>
                        {/*<MenuList pl={2}>*/}
                        {/*    {!notification.length && "No New Messages"}*/}
                        {/*    {notification.map((notif) => (*/}
                        {/*        <MenuItem*/}
                        {/*            key={notif._id}*/}
                        {/*            onClick={() => {*/}
                        {/*                setSelectedChat(notif.chat);*/}
                        {/*                setNotification(notification.filter((n) => n !== notif));*/}
                        {/*            }}*/}
                        {/*        >*/}
                        {/*            {notif.chat.isGroupChat*/}
                        {/*                ? `New Message in ${notif.chat.chatName}`*/}
                        {/*                : `New Message from ${getSender(user, notif.chat.users)}`}*/}
                        {/*        </MenuItem>*/}
                        {/*    ))}*/}
                        {/*</MenuList>*/}
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} bg="transparent" rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <button className='myProfile'>My Profile</button>{" "}
                            </ProfileModal>
                            <MenuDivider />
                            <button  className='myProfile' onClick={logoutHandler} >Logout</button>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" pb={2}>
                            <Input
                                placeholder="Search by name or email"
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
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
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}
export default SideDrawer
