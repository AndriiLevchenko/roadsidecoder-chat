import React, { useState} from 'react'
import axios from "axios";
// import {useToast} from "@chakra-ui/react";
import ProfileModal from "./ProfileModal";
import {useHistory} from "react-router-dom";
import ChatLoading from "../ChatLoading";
import { getSender } from "../../config/ChatLogics";
import UserListItem from "../userAvatar/UserListItem";
import {ChatState} from "../../Context/ChatProvider";
import Bellicon from "./../../images/Bellicon";
import Tooltip from "../../utils/Tooltip/Tooltip";
import Closeicon from "../../images/Closeicon";
import SpinnerCustom from "../SpinnerCustom";

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const [openNotifications, setOpenNotifications] = useState(false);
    const {openAvatar, setOpenAvatar, user, setSelectedChat, chats, setChats, notification, setNotification, openProfileModal, setOpenProfileModal, encryption, setEncryption, showToast, sounds, setSounds } = ChatState();
    const [drawerOpenClose, setDrawerOpenClose] = useState("close");
    const [settings, setSettings] = useState(true);
    // const toast = useToast();
    const history = useHistory();
    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    };
    const handleSearch = async () => {
        if (!search) {
            showToast (
                'searchabsent'      //checked
            )
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
            console.log("data search  = ", data);
        } catch (error) {
            console.log("data search  = ", error);
            showToast (
                'errorsearchresults'    //checked
            )
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
            //onClose();
            setDrawerOpenClose("close");
        } catch (error) {
            console.log("Error fetching the chat. Request failed with status code 404  = ", error);
            showToast (
                'failedloadchat'    //checked
            )
        }
    }

    let timer;
    const toggleNotifications = () => {
        setOpenNotifications(!openNotifications);
        setOpenAvatar(false); // Закриваємо аватар при відкритті нотифікацій

        // Якщо відкриваємо нотифікації, встановлюємо таймер на закриття
        if (!openNotifications) {
            timer = setTimeout(() => {
                setOpenNotifications(false);
            }, 8000);
        } else {
            // Якщо закриваємо нотифікації вручну, скасовуємо таймер
            clearTimeout(timer);
        }
    };

        return (
        <>
            <div  className='chats_header'>
                <Tooltip content="Search Users to chat" direction="bottom">
                    <button className='search_button' variant="ghost" onClick={()=>setDrawerOpenClose("open")} >
                        <i className="fas fa-search"></i>
                        <p className = 'searchUser'>
                            Search User
                        </p>
                    </button>
                </Tooltip>
                <h2 fontSize="2xl" fontFamily="Work sans">
                    MainName
                </h2>
                <div className='rightMenu'>
                    <div className = 'notification_menu'  >
                        <button className='notification icon_button' onClick={()=>{toggleNotifications(); setOpenAvatar(false);}}>
                            <Bellicon className = '' focusable="false" aria-hidden="true" />
                            {notification.length === 0 ? null : <span className='icon_button_notification'>{notification.length}</span>}
                        </button>
                        {openNotifications &&
                            <ul className='list_menu'>
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
                    <div className='avatar_block'>
                        <button className='avatar_button' onClick={()=>{setOpenAvatar(!openAvatar); setOpenNotifications(false)}}>
                            <span className='span_avatar'>
                                <img className='imgAvatar' name={user.name} src={user.pic} />
                            </span>
                        </button>
                        { openAvatar && <>
                            <div className='modalOverlay' onClick={()=>setOpenAvatar(false)}></div>
                            <ul className='list_menu'>
                            <li className='listElement'>
                                <ProfileModal user={user} setOpenProfileModal={setOpenProfileModal} setOpenAvatar={setOpenAvatar} >
                                    <button onClick={()=>setOpenProfileModal(true)}   className='myProfile' >My Profile</button>
                                </ProfileModal>
                            </li>
                            <li className='listElement'>
                                <button  className='myProfile' onClick={()=>setSettings(!settings)} >Settings</button>
                                <div className={`myProfile_settings ${settings ? 'active' : '' }`}>
                                    <span className='settings_item'>
                                        {/*<span onClick={()=>setEncryption(!encryption)}>Encryption</span>*/}
                                        <span >Encryption</span>
                                        <label className='switch'>
                                            <input type = 'checkbox' className='switch-input' checked={encryption} onClick = {()=>setEncryption(!encryption)}/>
                                            <span className='switch-slider'></span>
                                        </label>
                                    </span>
                                    <span className='settings_item'>
                                        <span >Sounds</span>
                                        <label className='switch'>
                                            <input type = 'checkbox' className='switch-input' checked={sounds} onClick = {()=>setSounds(!sounds)}/>
                                            <span className='switch-slider'></span>
                                        </label>
                                    </span>
                                </div>
                            </li>
                            <li className='listElement'>
                                <button  className='myProfile' onClick={logoutHandler} >Logout</button>
                            </li>
                        </ul>
                            </>}
                    </div>
                </div>
            </div>
            {/*<Drawer placement="left" onClose={onClose} isOpen={isOpen}>*/}
            <div className={`drawer_block  ${drawerOpenClose}`} >
                {/*<DrawerOverlay />*/}
                <div className='modalOverlay' onClick={()=>setDrawerOpenClose("close")}></div>
                <div className={`drawer_content  ${drawerOpenClose}`}>
                    <div className='search_block_Header' >
                        <span onClick={()=>setDrawerOpenClose("close")} className=' close_button'>
                            <Closeicon />
                        </span>
                        <h2>Search Users</h2>
                    </div>
                    <div className='search_block_Gross'>
                        <div className='search_block'>
                            <input
                                className='updateInput'
                                placeholder="Search by name or email"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button className='button' onClick={handleSearch}>Go</button>
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
                        {loadingChat &&  <SpinnerCustom />}
                        {loadingChat && <ChatLoading />}
                    </div>
                </div>
            </div>
        </>
    )
}
export default SideDrawer
