
// import { useToast } from "@chakra-ui/toast";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { getSender } from "../config/ChatLogics";
// import ChatLoading from "./ChatLoading";
// import GroupChatModal from "./miscellaneous/GroupChatModal";
// import { Button } from "@chakra-ui/react";
// import { ChatState } from "../Context/ChatProvider";
// import { ReactComponent as AddIcon } from './../images/plus-large.svg';
//
// const MyChats = ({ fetchAgain }) => {
//     const [loggedUser, setLoggedUser] = useState();
//     const { selectedChat, setSelectedChat, user, chats, setChats, setOpenProfileModal } = ChatState();
//     const toast = useToast();
//
//     const fetchChats = async () => {
//         try {
//             const config = {
//                 headers: { Authorization: `Bearer ${user.token}`}
//             };
//             const { data } = await axios.get("http://localhost:5000/api/chat", config);
//             console.log("data  = ", data );
//             setChats(data);
//         } catch (error) {
//             toast({
//                 title: "Error Occured!",
//                 description: "Failed to Load the chats",
//                 status: "error",
//                 duration: 5000,
//                 isClosable: true,
//                 position: "bottom-left",
//             });
//         }
//     };
//
//     useEffect(() => {
//         setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
//         fetchChats();
//         // eslint-disable-next-line
//     }, [fetchAgain]);
//     console.log("chats  = ", chats );
//     return (
//         <Box
//             display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
//             flexDir="column"
//             alignItems="center"
//             p={3}
//             bg="white"
//             w={{ base: "100%", md: "31%" }}
//             borderRadius="lg"
//             borderWidth="1px"
//         >
//             <Box
//                 style={{background: "yellow"}}
//                 pb={3}
//                 px={3}
//                 fontSize={{ base: "26px", md: "28px" }}
//                 fontFamily="Work sans"
//                 display="flex"
//                 w="100%"
//                 justifyContent="space-between"
//                 alignItems="center"
//             >
//                 My Chats
//                 <GroupChatModal>
//                     <button className='newChat  neeTime' type='button' onClick={()=>setOpenProfileModal(true)} >
//                         <span>New group chat</span>
//                         <AddIcon className = 'icon' focusable="false" aria-hidden="true" />
//                     </button>
//                 </GroupChatModal>
//             </Box>
//             <Box
//                 style={{background: "pink"}}
//                 display="flex"
//                 flexDir="column"
//                 p={3}
//                 bg="#F8F8F8"
//                 w="100%"
//                 h="100%"
//                 borderRadius="lg"
//                 overflowY="hidden"
//             >
//                 {chats ? (
//                     <Stack overflowY="scroll">
//                         {chats.map((chat) => (
//                             <div className='chat_item-name' onClick={() => setSelectedChat(chat)}
//                                  style={{backgroundColor: `${selectedChat === chat ? '#38B2AC' : '#E8E8E8'}`,
//                                         color: `${selectedChat === chat ? 'white' : 'black'}` }}
//
//                                 key={chat._id}
//                             >
//                                 <p className='text'>
//                                     {!chat.isGroupChat
//                                         ? getSender(loggedUser, chat.users)
//                                         : chat.chatName}
//                                 </p>
//                                 {chat.latestMessage && (
//                                     <p className='lastMessage'>
//                                         <b>{chat.latestMessage.sender.name} : </b>
//                                         {chat.latestMessage.content.length > 50
//                                             ? chat.latestMessage.content.substring(0, 51) + "..."
//                                             : chat.latestMessage.content}
//                                     </p>
//                                 )}
//                             </div>
//                         ))}
//                     </Stack>
//                 ) : (
//                     <ChatLoading />
//                 )}
//             </Box>
//         </Box>
//     );
// };
//
// export default MyChats;
// //equal
