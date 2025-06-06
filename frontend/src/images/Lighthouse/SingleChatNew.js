
// import "../index.css";
// import { IconButton, useToast } from "@chakra-ui/react";
// import { getSender, getSenderFull } from "../config/ChatLogics";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import ProfileModal from "./miscellaneous/ProfileModal";
// import ScrollableChat from "./ScrollableChat";
// import Lottie from "react-lottie";
// import animationData from "../animations/typing.json";
// import io from "socket.io-client";
// import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
// import { ChatState } from "../Context/ChatProvider";
// import { ReactComponent as ArrowLeftIcon } from './../images/arrow-left.svg';
// const ENDPOINT = "http://localhost:5000"; // "https://МОЄВЛАСНЕІМ'Я.herokuapp.com"; -> After deployment
// var socket, selectedChatCompare;
//
// const SingleChat = ({ fetchAgain, setFetchAgain }) => {
//     const [messages, setMessages] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [newMessage, setNewMessage] = useState("");
//     const [socketConnected, setSocketConnected] = useState(false);
//     const [typing, setTyping] = useState(false);
//     const [istyping, setIsTyping] = useState(false);
//     const toast = useToast();
//
//     const defaultOptions = {
//         loop: true,
//         autoplay: true,
//         animationData: animationData,
//         rendererSettings: {
//             preserveAspectRatio: "xMidYMid slice",
//         },
//     };
//     const { selectedChat, setSelectedChat, user, notification, setNotification } =
//         ChatState();
//
//     const fetchMessages = async () => {
//         if (!selectedChat) return;
//
//         try {
//             const config = {
//                 headers: { Authorization: `Bearer ${user.token}` }
//             };
//
//             setLoading(true);
//             const { data } = await axios.get(
//                 `http://localhost:5000/api/message/${selectedChat._id}`,
//                 config
//             );
//             console.log("messages = ", messages);
//             setMessages(data);
//             setLoading(false);
//
//             socket.emit("join chat", selectedChat._id);
//         } catch (error) {
//             toast({
//                 title: "Error Occured!",
//                 description: "Failed to Load the Messages",
//                 status: "error",
//                 duration: 5000,
//                 isClosable: true,
//                 position: "bottom",
//             });
//         }
//     };
//
//     const sendMessage = async (event) => {
//         if (event.key === "Enter" && newMessage) {
//             socket.emit("stop typing", selectedChat._id);
//             try {
//                 const config = {
//                     headers: { "Content-type": "application/json", Authorization: `Bearer ${user.token}` }
//                 };
//                 setNewMessage("");
//                 const { data } = await axios.post(
//                     "http://localhost:5000/api/message",
//                     {
//                         content: newMessage,
//                         chatId: selectedChat,
//                     },
//                     config
//                 );
//                 console.log("data = ", data);
//
//                 socket.emit("new message", data);
//                 setMessages([...messages, data]);
//             } catch (error) {
//                 toast({
//                     title: "Error Occured!",
//                     description: "Failed to send the Message",
//                     status: "error",
//                     duration: 5000,
//                     isClosable: true,
//                     position: "bottom",
//                 });
//             }
//         }
//     };
//
//     useEffect(() => {
//         socket = io(ENDPOINT);
//         socket.emit("setup", user);
//         socket.on("connected", () => setSocketConnected(true));
//         socket.on("typing", () => setIsTyping(true));
//         socket.on("stop typing", () => setIsTyping(false));
//
//         // eslint-disable-next-line
//     }, []);
//
//     useEffect(() => {
//         fetchMessages();
//
//         selectedChatCompare = selectedChat;
//         // eslint-disable-next-line
//     }, [selectedChat]);
//
//     useEffect(() => {
//         socket.on("message recieved", (newMessageRecieved) => {
//             if (
//                 !selectedChatCompare || // if chat is not selected or doesn't match current chat
//                 selectedChatCompare._id !== newMessageRecieved.chat._id
//             ) {
//                 if (!notification.includes(newMessageRecieved)) {
//                     setNotification([newMessageRecieved, ...notification]);
//                     setFetchAgain(!fetchAgain);
//                 }
//             } else {
//                 setMessages([...messages, newMessageRecieved]);
//             }
//         });
//     });
//
//     const typingHandler = (e) => {
//         setNewMessage(e.target.value);
//
//         if (!socketConnected) return;
//
//         if (!typing) {
//             setTyping(true);
//             socket.emit("typing", selectedChat._id);
//         }
//         let lastTypingTime = new Date().getTime();
//         var timerLength = 3000;
//         setTimeout(() => {
//             var timeNow = new Date().getTime();
//             var timeDiff = timeNow - lastTypingTime;
//             if (timeDiff >= timerLength && typing) {
//                 socket.emit("stop typing", selectedChat._id);
//                 setTyping(false);
//             }
//         }, timerLength);
//     };
//
//     console.log("user in SingleChatNew  = ", user);
//     return (
//         <>
//             {selectedChat ? (
//                 <>
//                     <Text
//                         fontSize={{ base: "28px", md: "30px" }}
//                         pb={3}
//                         px={2}
//                         w="100%"
//                         fontFamily="Work sans"
//                         display="flex"
//                         justifyContent={{ base: "space-between" }}
//                         alignItems="center"
//                     >
//                         <button type='button' className='icon_arrow' onClick={() => setSelectedChat("")} >
//                             <ArrowLeftIcon className = 'icon' focusable="false" aria-hidden="true" />
//                         </button>
//                         { messages &&
//                             (!selectedChat.isGroupChat ? (
//                                 <>
//                                     {getSender(user, selectedChat.users)}
//                                     <ProfileModal
//                                         user={getSenderFull(user, selectedChat.users)}
//                                     />
//                                 </>
//                             ) : (
//                                 <>
//                                     {selectedChat.chatName.toUpperCase()}
//                                     <UpdateGroupChatModal
//                                         fetchMessages={fetchMessages}
//                                         fetchAgain={fetchAgain}
//                                         setFetchAgain={setFetchAgain}
//                                     />
//                                 </>
//                             ))}
//                     </Text>
//                     <Box
//                         display="flex"
//                         flexDir="column"
//                         justifyContent="flex-end"
//                         p={3}
//                         bg="#E8E8E8"
//                         w="100%"
//                         h="100%"
//                         borderRadius="lg"
//                         overflowY="hidden"
//                     >
//                         {loading ? (
//                             <SpinnerCustom />
//                         ) : (
//                             <div className="messages">
//                                 <ScrollableChat messages={messages} />
//                             </div>
//                         )}
//
//                         <FormControl
//                             onKeyDown={sendMessage}
//                             id="first-name"
//                             isRequired
//                             mt={3}
//                         >
//                             {istyping ? (
//                                 <div>
//                                     <Lottie
//                                         options={defaultOptions}
//                                         // height={50}
//                                         width={70}
//                                         style={{ marginBottom: 15, marginLeft: 0 }}
//                                     />
//                                 </div>
//                             ) : (
//                                 <></>
//                             )}
//                             <Input
//                                 variant="filled"
//                                 bg="#E0E0E0"
//                                 placeholder="Enter a message.."
//                                 value={newMessage}
//                                 onChange={typingHandler}
//                             />
//                         </FormControl>
//                     </Box>
//                 </>
//             ): (
//                 // to get socket.io on same page
//                 <div className='box'>
//                     <p className='text' >
//                         Click on a user to start chatting
//                     </p>
//                 </div>
//             )}
//         </>
//     )
// }
// export default SingleChat
// //equal