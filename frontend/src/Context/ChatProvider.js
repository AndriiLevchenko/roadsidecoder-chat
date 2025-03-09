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
    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        if(!userInfo) history.push("/");
    }, [history]);
    console.log("user = ", user);
    return (
        // <ChatContext.Provider value={{ selectedChat, setSelectedChat, user, setUser,  notification, setNotification, chats, setChats, modalProfileOpen, setModalProfileOpen }}>
        <ChatContext.Provider value={{ selectedChat, setSelectedChat, user, setUser,  notification, setNotification, chats, setChats, openProfileModal, setOpenProfileModal }}>
            {children}
        </ChatContext.Provider>
    )
}

export const ChatState = () =>{
    return useContext(ChatContext);
}


export default ChatProvider;
//equal