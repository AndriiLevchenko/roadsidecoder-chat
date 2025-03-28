import {createContext, useContext, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";


const ChatContext = createContext();

const ChatProvider = ({children}) => {
    const [selectedChat, setSelectedChat] = useState();
    const [user, setUser] = useState();
    const [notification, setNotification] = useState([]);
    const [chats, setChats] = useState();
    const [openProfileModal, setOpenProfileModal] = useState(false);
    const history = useHistory();
    const [openAvatar, setOpenAvatar] = useState(false);
    const [openCreateGroupChat, setOpenCreateGroupChat] = useState(false);
    const [encryption, setEncryption] = useState(false);
    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        if(!userInfo) history.push("/");
    }, [history]);
    console.log("user = ", user);
    return (
        <ChatContext.Provider value={{ openAvatar, setOpenAvatar, selectedChat, setSelectedChat, user, setUser,  notification, setNotification, chats, setChats, openProfileModal, setOpenProfileModal, openCreateGroupChat, setOpenCreateGroupChat, encryption, setEncryption }}>
            {children}
        </ChatContext.Provider>
    )
}

export const ChatState = () =>{
    return useContext(ChatContext);
}


export default ChatProvider;
//equal