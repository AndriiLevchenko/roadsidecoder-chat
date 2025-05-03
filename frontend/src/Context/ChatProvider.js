import {createContext, useContext, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {TOAST_PROPERTIES} from "../utils/Toast/toastProperties";


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
    const [writeRead, toggleWriteRead] = useState(true);
    const [encryption, setEncryption] = useState(true);
    const [modal, setModal] = useState({
        title: "",
        classButtonName: 'buttonForm buttonAlert button ',
        classDialogName: ' modal_section',
        query: "",
        param: "del",
        param_id: "-1",
        view: "button"
    });
    const [csrfToken, setCsrfToken] = useState('');
    const [list, setList] = useState([]);
    const showToast = (type) => {
        const toastProperties = TOAST_PROPERTIES.find((toast) => toast.title.toLowerCase() === type);
        // console.log(" TOAST_PROPERTIES = ",  TOAST_PROPERTIES);
        // console.log("toastProperties = ", toastProperties);
        setList([...list, toastProperties]);
    }
    const [sounds, setSounds] = useState(true)
    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        if(!userInfo) history.push("/");
    }, [history]);
    //console.log("user = ", user);
    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem("userInfo", JSON.stringify(userData));
    };

    return (
        <ChatContext.Provider value={{ openAvatar, setOpenAvatar, selectedChat, setSelectedChat, user, setUser,  updateUser, notification, setNotification, chats, setChats, openProfileModal, setOpenProfileModal, openCreateGroupChat, setOpenCreateGroupChat, encryption, setEncryption, writeRead, toggleWriteRead, modal, setModal, csrfToken, setCsrfToken, showToast, list, sounds, setSounds }}>
            {children}
        </ChatContext.Provider>
    )
}

export const ChatState = () =>{
    return useContext(ChatContext);
}


export default ChatProvider;
//equal