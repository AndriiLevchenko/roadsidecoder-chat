import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/layout";
import "../index.css";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import { ReactComponent as ArrowLeftIcon } from './../images/arrow-left.svg';
import login from "./Authentication/Login";
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

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };
    const { selectedChat, setSelectedChat, user, notification, setNotification } =
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
                    },
                    config
                );
                socket.emit("new message", data);
                setMessages([...messages, data]);
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

    // useEffect(() => {
    //     const handleMessageRecieved = (newMessageRecieved) => {
    //         console.log("newMessageRecieved = ", newMessageRecieved);
    //         if (
    //             !selectedChatCompare ||
    //             selectedChatCompare._id !== newMessageRecieved.chat._id
    //         ) {
    //             console.log("notification = ", notification);
    //             if (!notification.includes(newMessageRecieved)) {
    //                 setNotification([newMessageRecieved, ...notification]);
    //                 setFetchAgain(!fetchAgain);
    //                 console.log("Notofocation = ", notification);
    //             }
    //         } else {
    //             console.log("  else   newMessageRecieved = ", newMessageRecieved);
    //             setMessages([...messages, newMessageRecieved]);
    //         }
    //     };
    //
    //     socket.on("message recieved", handleMessageRecieved);
    //
    //     return () => {
    //         socket.off("message recieved", handleMessageRecieved);
    //     };
    // }, [socket, messages, notification, selectedChatCompare, setMessages, setNotification, setFetchAgain]);
    useEffect(() => {
        console.log("useEffect works");
        const handleMessageRecieved = (newMessageRecieved) => {
            try {
                console.log("message recieved:", newMessageRecieved);
                console.log("selectedChatCompare:", selectedChatCompare);

                if (
                    !selectedChatCompare ||
                    selectedChatCompare._id !== newMessageRecieved.chat._id
                ) {
                    console.log("selectedChatCompare._id:", selectedChatCompare?._id);
                    console.log("newMessageRecieved.chat._id:", newMessageRecieved.chat._id);
                    console.log("notification before:", notification);
                    console.log("newMessageRecieved:", newMessageRecieved);
                    console.log("notification.includes(newMessageRecieved):", notification.includes(newMessageRecieved));

                    if (!notification.includes(newMessageRecieved)) {
                        console.log("Adding to notification");
                        setNotification([newMessageRecieved, ...notification]);
                        setFetchAgain(!fetchAgain);
                        console.log("notification after:", notification);
                    } else {
                        console.log("Message already in notification");
                    }
                } else {
                    console.log("messages before:", messages);
                    setMessages([...messages, newMessageRecieved]);
                    console.log("messages after:", messages);
                }
            } catch (error) {
                console.error("Error in handleMessageRecieved:", error); // Додано лог помилки
            }
        };

        socket.on("message recieved", handleMessageRecieved);

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


    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <button type='button' className='iconArrow' onClick={() => setSelectedChat("")} >
                            <ArrowLeftIcon className = 'icon chakra-icon' focusable="false" aria-hidden="true" />
                        </button>
                        { messages &&
                            (!selectedChat.isGroupChat ? (
                                <>
                                    {getSender(user, selectedChat.users)}
                                    <ProfileModal
                                        user={getSenderFull(user, selectedChat.users)}
                                    />
                                </>
                            ) : (
                                <>
                                    {selectedChat.chatName.toUpperCase()}
                                    <UpdateGroupChatModal
                                        fetchMessages={fetchMessages}
                                        fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                    />
                                </>
                            ))}
                    </Text>
                    <Box
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#E8E8E8"
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
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

                        <FormControl
                            onKeyDown={sendMessage}
                            id="first-name"
                            isRequired
                            mt={3}
                        >
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
                            <Input
                                variant="filled"
                                bg="#E0E0E0"
                                placeholder="Enter a message.."
                                value={newMessage}
                                onChange={typingHandler}
                            />
                        </FormControl>
                    </Box>
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