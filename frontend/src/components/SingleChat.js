import "../index.css";
import { Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
// import login from "./Authentication/Login";
import Arrowlefticon from "../images/Arrowlefticon";
import notificationSound from "../utils/notification.mp3";
const ENDPOINT = "http://localhost:5000"; // "https://МОЄВЛАСНЕІМ'Я.herokuapp.com"; -> After deployment
var socket;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const toast = useToast();
    const [selectedChatCompare, setSelectedChatCompare] = useState();
    const [fileName, setFileName] = useState(' ');
    const [writeRead, toggleWriteRead] = useState(false);


    const [picLoading, setPicLoading ] = useState(false);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };
    const { selectedChat, setSelectedChat, user, notification, setNotification, openAvatar, encryption, setEncryption } =
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
            console.log("messages = ", messages);
            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: { "Content-type": "application/json", Authorization: `Bearer ${user.token}` }
                };
                setNewMessage("");
                const { data } = await axios.post(
                    "http://localhost:5000/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat,
                        pic: fileName
                    },
                    config
                );
                socket.emit("new message", data);
                const sound = new Audio(notificationSound);
                sound.play();
                setMessages([...messages, data]);
                setFileName(' ');
                console.log("data in SingleChat = ", data);
                console.log("messages = ", messages);
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
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
        console.log("useEffect works");
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
                }
            } catch (error) {
                console.error("Error in handleMessageRecieved:", error); // Додано лог помилки
            }
        };

        socket.on("message recieved", handleMessageRecieved);
        console.log("messages in SingleChat = ", messages);
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
            console.log("Joined chat:", selectedChat._id); // Додано лог
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
            toast({
                title: 'Picture is absent.',
                description: "Add a picture.",
                status: 'warning',
                duration: 9000,
                isClosable: true,
            })
            return;
        }
        console.log("pics = ", pics);
        if(pics.type === "image/jpeg" || pics.type === "image/png") {
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
                setPicLoading(false);
            });
        } else {
            toast({
                title: 'Picture is absent.',
                description: "Add a picture.",
                status: 'warning',
                duration: 9000,
                isClosable: true,
            });
            setPicLoading(false);
            return;
        }
    }
    return (
        <>
            {selectedChat ? (
                <>
                    <div className='single_chat'>
                        <div className='single_chat_header1'>
                            <button type='button' className='icon_arrow icon_button' onClick={() => setSelectedChat("")} >
                                <Arrowlefticon className = 'icon chakra-icon' focusable="false" aria-hidden="true" />
                            </button>
                            { encryption ?  <div className='read_write_button'>
                                                <span className={`write_read_span1 ${writeRead ? 'writeActive' : 'writePassive'}`}>WRITE</span>
                                                <label className='switch px-2'>
                                                    <input type = 'checkbox' className='switch-input' onClick = {()=>toggleWriteRead(!writeRead)}/>
                                                    <span className='switch-slider'></span>
                                                </label>
                                                <span className={`write_read_span1 read ${writeRead ? 'writePassive' : 'writeActive'}`}>READ</span>
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
                        {loading ? (
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />

                        ) : (
                            <div className="messages">
                                <ScrollableChat messages={messages} />
                            </div>
                        )}

                        <div className='form-control' onKeyDown={sendMessage}  id="first-name">
                            {istyping ? (
                                <div>
                                    <Lottie
                                        options={defaultOptions}
                                        // height={50}
                                        width={70}
                                        style={{ marginBottom: 15, marginLeft: 0 }}
                                    />
                                </div>
                            ) : (
                                <></>
                            )}
                            <input
                                className='updateInput'
                                placeholder="Enter a message.."
                                value={newMessage}
                                onChange={typingHandler}
                            />
                            <div className=' input_picture'>
                                {/*<span>{fileName}</span>*/}
                                {/*{fileName && <input type='file' onChange={(e) => handleFileChange(e.target.files[0])} ref={fileInput}  />}*/}
                                {picLoading
                                 ?   <Spinner
                                        size="xl"
                                        w={20}
                                        h={20}
                                        alignSelf="center"
                                        margin="auto"
                                    />
                                :  <input type='file' onChange={(e) => handleFileChange(e.target.files[0])} key={messages.length} /> }
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