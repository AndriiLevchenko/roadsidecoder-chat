import "../index.css";
import { getSender, getSenderFull } from "../config/ChatLogics";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import animationData from "../animations/typing.json";
import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import Arrowlefticon from "../images/Arrowlefticon";
//import notificationSound from "../utils/notification.mp3";
import notificationSound2 from "../utils/blow4.wav";
import notificationSound3 from "../utils/blow3.wav";
import MessagesInputs from "./MessagesInputs";
// import {getCsrfToken} from "../utils/functions";
//import login from "./Authentication/Login";
import SpinnerCustom from "./SpinnerCustom";
import ConfirmModal from "./Modals/ConfirmModal/ConfirmModal";
const ENDPOINT = "http://localhost:5000"; // "https://МОЄВЛАСНЕІМ'Я.herokuapp.com"; -> After deployment
var socket;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const [selectedChatCompare, setSelectedChatCompare] = useState();
    const [fileName, setFileName] = useState(' ');
    let [codedMessage, setCodedMessage] = useState(" ");
    let [decodedMessage, setDecodedMessage] = useState(" ");
    const [isOpenCreateDelete, setIsOpenCreateDelete] = useState(false);

    const [picLoading, setPicLoading ] = useState(false);
    const [scrollTopBeforeDeleteSingleChat, setScrollTopBeforeDeleteSingleChat] = useState(0);
    const chatContainerRef = useRef(null); // Реф на контейнер прокрутки ScrollableChat

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };
    const { selectedChat, setSelectedChat, user, notification, setNotification, openAvatar, encryption, setEncryption, writeRead, toggleWriteRead, setModal, modal, csrfToken,  showToast, sounds } =
        ChatState();
    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            setLoading(true);
            const { data } = await axios.get(
                `http://localhost:5000/api/message/${selectedChat._id}`,
                config
            );
            //console.log("messages = ", messages);
            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            showToast (
                'loaderror'
            )
        }
    };

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                if (writeRead === false) {
                    onClickSpanFunction();
                    showToast (
                        'setwrite'
                    )
                    return
                }
                const config = {
                    headers: { "Content-type": "application/json", Authorization: `Bearer ${user.token}`,  'X-CSRF-Token': csrfToken },
                    withCredentials: true     //Це щоб додавались cookies
                };
                setNewMessage("");
                const { data } = await axios.post(
                    "http://localhost:5000/api/message",
                    {
                        content: codedMessage,
                        chatId: selectedChat,
                        pic: fileName
                    },
                    config
                );
                socket.emit("new message", data);
                if(sounds) {
                    const sound = new Audio(notificationSound2);
                    sound.play();
                }
                setMessages([...messages, data]);
                setFileName(' ');
                //console.log("messages = ", messages);
            } catch (error) {
                showToast (
                    'relogin'
                )
            }
        }
    };

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        fetchMessages();

        setSelectedChatCompare(selectedChat); // Оновлюємо стан
        // eslint-disable-next-line
    }, [selectedChat]);

    useEffect(() => {
        //console.log("useEffect works");
        const handleMessageRecieved = (newMessageRecieved) => {
            try {
                if (
                    !selectedChatCompare ||
                    selectedChatCompare._id !== newMessageRecieved.chat._id
                ) {
                    if (!notification.includes(newMessageRecieved)) {
                        setNotification([newMessageRecieved, ...notification]);
                        setFetchAgain(!fetchAgain);
                    } else {
                        console.log("Message already in notification");
                    }
                } else {
                    setMessages([...messages, newMessageRecieved]);
                    if(sounds) {
                        const sound = new Audio(notificationSound3);
                        sound.play();
                    }
                }
            } catch (error) {
                console.error("Error in handleMessageRecieved:", error); // Додано лог помилки
            }
        };

        socket.on("message recieved", handleMessageRecieved);
        //console.log("messages in SingleChat = ", messages);
        return () => {
            socket.off("message recieved", handleMessageRecieved);
        };
    }, [socket, messages, notification, selectedChatCompare, setMessages, setNotification, setFetchAgain]);

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.on("connect", () => {
            console.log("Socket connected"); // Додано лог
            setSocketConnected(true);
            socket.emit("setup", user);
        });
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));

        return () => {
            socket.off("connect");
        };
    }, []);

    useEffect(() => {
        if (selectedChat) {
            socket.emit("join chat", selectedChat._id);
        }
    }, [selectedChat]);

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };
    const fileInput = useRef(null)

    const handleClick = () => {
        fileInput.current.click()
    }

    const handleFileChange = pics => {
        console.log("Make something = ", pics);
        setPicLoading(true);
        if(pics === undefined) {
            showToast (
                'pictureabsent'
            )
            return;
        }
        console.log("pics = ", pics);
        if(pics.type === "image/jpeg" || pics.type === "image/jpg" || pics.type === "image/png") {
            const data = new FormData();
            console.log("data = new Formadta = ", data);
            data.append("file", pics );
            data.append("upload_preset", "chat-app" );
            data.append("cloud_name", "dvxtzwyam" );
            fetch("https://api.cloudinary.com/v1_1/dvxtzwyam/image/upload", {
                method: "post",
                body: data
            }).then((res)=> res.json()).then((data)=> {
                let pic = fileName;
                console.log("newInputs = ", pic);
                console.log("data.url.toString() = ", data.url.toString());
                pic = data.url.toString();
                setFileName( pic);
                console.log("data = ", data, "fileName = ", fileName);
                setPicLoading(false);
            }).catch((err)=>{
                console.log("err = ", err);
                showToast (
                    'pictureerror'
                )
                setPicLoading(false);
            });
        } else {
            showToast (
                'pictureerror'
            )
            setPicLoading(false);
            return;
        }
    }
    const onConfirmModal =(userId, messageId)=> {
        deleteMessageHandler(userId, messageId);
        setIsOpenCreateDelete(false);
    }
    const deleteMessageHandler = async(userId, messageId)=> {
        //const messagesNewArray = messages;
        const config = {
            headers: { Authorization: `Bearer ${user.token}` }
        };

        setLoading(true);
        console.log(" userId, messageId, setSelectedChat = ", userId, messageId, selectedChat._id);
        try {
        const { data } = await axios.post(
            "http://localhost:5000/api/message/deleteMessage",
            {
                  userId: userId,
                  messageId:  messageId,
                  chatId: selectedChat._id
                },
                config
        );
        console.log(" deleteMessageHandler after axios, data = ", data);
        setLoading(false);
        fetchMessages(selectedChat._id); // Запит на оновенні повідомлення
            showToast (
                'deletesuccess'
            );
            // if (chatContainerRef.current && scrollTopBeforeDeleteSingleChat !== undefined) {
            //     chatContainerRef.current.scrollTop = scrollTopBeforeDeleteSingleChat;
            //     console.log("scrollTopBeforeDeleteSingleChat = ", scrollTopBeforeDeleteSingleChat)
            // }
        } catch (error) {
            setLoading(false);
            console.error("Error deleting message:", error);
            // Обробка помилки
            showToast (
                'deleteerror'
            )
        }
    }
    const onClickSpanFunction =()=> {
        setModal({ ...modal, view: "query"});
    }
    console.log(" coded  n Mesegas Input = ", codedMessage);

    const handleSaveScrollTop = (scrollTop) => {      //Це для позиціонування повідомлень на місці видаленого повідомлення
        setScrollTopBeforeDeleteSingleChat(scrollTop);
        console.log("scrollTop збережено в батьківському:", scrollTop);
    };
    return (
        <>
            {selectedChat ? (
                <>
                    <div className='single_chat'>
                        <div className='single_chat_header1'>
                            <button type='button' className='icon_arrow icon_button' onClick={() => setSelectedChat("")} >
                                <Arrowlefticon className = 'icon' focusable="false" aria-hidden="true" />
                            </button>
                            { encryption ?  <div className='read_write_button'>
                                                <span className={`write_read_span1 ${writeRead ? 'writePassive ' : ' writeActive'}`}>READ </span>
                                                <label className='switch'>
                                                    <input type = 'checkbox' className='switch-input' checked={writeRead} onClick = {()=>toggleWriteRead(!writeRead)}/>
                                                    <span className='switch-slider'></span>
                                                </label>
                                                <span className={`write_read_span1 read ${writeRead ? ' writeActive' : 'writePassive '}`}>WRITE</span>
                                            </div>
                                         :  <div className='read_write_button'>
                                                <button onClick={()=>setEncryption(true)}><span className='write_read_span1' >Encryption is disabled </span> </button >
                                            </div> }
                        </div>
                        <div className='single_chat_header2'>
                            { messages && // !openAvatar &&     When Avatar (Redistrierter User) is on - man must not open
                                (!selectedChat.isGroupChat ? (
                                    <>
                                        <span>{getSender(user, selectedChat.users)}</span>
                                        { !openAvatar &&  <ProfileModal className='SingleChat ProfileModal'
                                            user={getSenderFull(user, selectedChat.users)}
                                        />}
                                    </>
                                ) : (
                                    <>
                                        <span>{selectedChat.chatName.toUpperCase()} </span>
                                        { !openAvatar &&  <UpdateGroupChatModal   className='SingleChat UpdateGroupChatModal'
                                            fetchMessages={fetchMessages}
                                            fetchAgain={fetchAgain}
                                            setFetchAgain={setFetchAgain}
                                        />}
                                    </>
                                ))}
                        </div>
                    </div>
                    <div className ='single_chat-field'>
                        {/*<ButtonConfirmNew    title="" query="Включи режим писання! "/>*/}
                        {loading ? (
                            <SpinnerCustom />
                        ) : (
                            <div className="messages">
                                {/*<ConfirmModal onConfirm={onConfirmModal}  onClose={()=>setIsOpenCreateDelete(false)} isOpen={isOpenCreateDelete} content = {"Ревльно хочеш видалити месседж?"} />*/}
                                <ScrollableChat messages={messages} deleteMessageHandler={deleteMessageHandler} onSaveScrollTop={handleSaveScrollTop}   ref={chatContainerRef} scrollTopBeforeDeleteSingleChat={scrollTopBeforeDeleteSingleChat} />
                            </div>
                        )}

                        <div className='form-control' onKeyDown={sendMessage}  id="first-name">
                            <MessagesInputs sendMessage={sendMessage} istyping={istyping} defaultOptions={defaultOptions} newMessage={newMessage} typingHandler={typingHandler} picLoading={picLoading} handleFileChange={handleFileChange} codedMessage={codedMessage} setCodedMessage={setCodedMessage} decodedMessage={decodedMessage} setDecodedMessage={setDecodedMessage} />
                            <div className=' input_picture'>
                                {/*<span>{fileName}</span>*/}
                                {/*{fileName && <input type='file' onChange={(e) => handleFileChange(e.target.files[0])} ref={fileInput}  />}*/}
                                {picLoading
                                 ?
                                    <SpinnerCustom />
                                // :  <input type='file' onChange={(e) => handleFileChange(e.target.files[0])} key={messages.length} /> }
                                    :   <span>
                                            { fileName === ' ' ? <input type='file' onChange={(e) => handleFileChange(e.target.files[0])} key={messages.length} />
                                            : <span>{fileName.split('/').pop()}</span>}
                                        </span> }
                                {/*<button onClick={() => handleClick()} className='icon'><Addicon/></button>*/}
                            </div>

                        </div>
                    </div>
                </>
            ): (
                // to get socket.io on same page
                <div className='box'>
                    <p className='text' >
                        Click on a user to start chatting
                    </p>
                </div>
            )}
        </>
    )
}
export default SingleChat
//equal