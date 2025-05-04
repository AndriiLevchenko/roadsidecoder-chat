import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser,} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import {extractDate, extractTime} from "../utils/functions";
//import ButtonConfirmNew from "./utils/ButtonConfirm/ButtonConfirmNew";
import {useEffect, useRef, useState} from "react";
import ConfirmModal from "./Modals/ConfirmModal/ConfirmModal";

const ScrollableChat = ({ messages, deleteMessageHandler, onSaveScrollTop, scrollTopBeforeDeleteSingleChat }) => {
  const { user, selectedChat, modal, setModal } = ChatState();
  const [i, setI] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [messageId, setMessageId] = useState("");
  const chatContainerRef = useRef(null);
  const scrollTopBeforeDeleteRef = useRef(0); // Використовуємо useRef
  const handleSaveScrollTop = () => {              //Це для позиціонування повідомлень на місці видаленого повідомлення
    alert("handleSaveScrollTop = " + chatContainerRef.current.scrollTop);
    if (chatContainerRef.current && onSaveScrollTop) {
      onSaveScrollTop(chatContainerRef.current.scrollTop);
      console.log("scrollTop передано до батьківського:", chatContainerRef.current.scrollTop);
    }
  };
  const onClickSpanFunction =(e, userId, messageId)=> {
    setIsOpen(true);
    console.log("e= ", e,  "userId = ", userId, "messageId = ", messageId);
    e.preventDefault();
    setMessageId(messageId);
    setUserId(userId);
    handleSaveScrollTop(); // Викликаємо функцію збереження scrollTop
    // setCurrentScrollTop(chatContainerRef.current?.scrollTop);
    // scrollTopBeforeDelete = chatContainerRef.current?.scrollTop || 0; // Зберігаємо в локальну змінну
    // scrollTopBeforeDeleteRef.current = chatContainerRef.current?.scrollTop || 0;
  }
  const onClose =()=> {
    setIsOpen(false);
  }
  useEffect(()=> {
    //console.log("Прокрутка відновлена на1:", scrollTopBeforeDelete);
    // Відновлюємо прокрутку після оновлення списку повідомлень
    console.log("chatContainerRef.current в useEffect = :", chatContainerRef.current);
    //console.log("scrollTopBeforeDelete в useEffect = ", scrollTopBeforeDelete);
    if (chatContainerRef.current && scrollTopBeforeDeleteSingleChat !== 0) {
      setTimeout(() => {
        chatContainerRef.current.scrollTop = scrollTopBeforeDeleteSingleChat;
        scrollTopBeforeDeleteSingleChat = 0; // Скидаємо локальну змінну
        console.log("Прокрутка відновлена на2:", scrollTopBeforeDeleteSingleChat);
      }, 0);
    }
  }, [messages]);
  console.log("scrollTopBeforeDeleteRef  before render = ", scrollTopBeforeDeleteRef);
  console.log("chatContainerRef before render = ", chatContainerRef);
  return (
    <div className='scrollable' ref={chatContainerRef}>
      <ConfirmModal onConfirm={()=>deleteMessageHandler(userId, messageId)} onClose={onClose} isOpen={isOpen} content = {"Видаляти можна лише власні повідомлення. Видалити?"} />
      {messages &&
        messages.map((m, i) => {
          return (<div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && selectedChat.isGroupChat && (
              <span className='chat_message_avatar' label={m.sender.name} placement="bottom-start" >
                    <img alt='avatar' className='chat_message_avatar_image' src={m.sender.pic} />
              </span>
            )}
            <span className='chatMessage'
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#DBFFDB"
                }`,
                marginLeft:  selectedChat.isGroupChat
                    ? isSameSenderMargin(messages, m, i, user._id)
                    : !selectedChat.isGroupChat &&  m.sender._id === user._id
                      ? isSameSenderMargin(messages, m, i, user._id)
                      : 0,
                marginTop: selectedChat.isGroupChat && isSameUser(messages, m, i, user._id) ? 3 : 10,
                width: m.pic ? '50%' : 'auto',
                minWidth: m.pic ? 'initial' : '50%',
              }}
                  onContextMenu={(e)=>onClickSpanFunction(e, user._id, m._id)}
                  //onClick={(e)=>onClickSpanFunction(e, user._id, m._id)}
            >

              {m.sender._id !== user._id && selectedChat.isGroupChat ? <span className='chatMessageName'>{m.sender.name}</span> : null }
              <span className={` ${m.pic ?  'picture_content' : '' }`}>{m.content}</span>

              {m.pic && <img alt='' src={m.pic} />}
              <span className='chatMessageTime'>
                {extractTime(m.updatedAt)}
                <span className='chatMessageDate'> {extractDate(m.updatedAt)}</span>
              </span>
            </span>
          </div>)
      })}
    </div>
  );
};

export default ScrollableChat;
