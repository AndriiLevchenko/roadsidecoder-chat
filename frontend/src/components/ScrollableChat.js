import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser,} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import {extractDate, extractTime} from "../utils/functions";
//import ButtonConfirm from "./utils/ButtonConfirm/ButtonConfirm";
import ButtonConfirmNew from "./utils/ButtonConfirm/ButtonConfirmNew";
import {useState} from "react";
import ConfirmModal from "./Modals/ConfirmModal/ConfirmModal";

const ScrollableChat = ({ messages, deleteMessageHandler }) => {
  const { user, selectedChat, modal, setModal } = ChatState();
  const [i, setI] = useState(null);
  console.log("selectedChat = ", selectedChat);
  // console.log("isSameSender(messages, m, i, user._id) = ", isSameSender(messages, m, i, user._id);
  // console.log("isLastMessage(messages, i, user._id)) = ", isLastMessage(messages, i, user._id);
  // console.log("selectedChat.isGroupChat = ", selectedChat.isGroupChat);
  const [isOpen, setIsOpen] = useState(false);
  const onContextMenuFunction =()=> {
    // if (e.which === 3 || e.button === 2)
    {
      //console.log('"Right" at ', e.clientX, ' x ', e.clientY);
      console.log(' delete i =  ', i);
      setModal({ ...modal, view: "button"});
      deleteMessageHandler(i);
      setI(null);
    }
  }
  const onClickSpanFunction =(e, m)=> {
    //setI(i);
    setIsOpen(true);
    console.log(' delete e.target =  ', e.target, "m = ", m._id);
    e.preventDefault();
    deleteMessageHandler(m._id);
    // setModal({ ...modal, view: "query"});
  }
  const onClose =()=> {
    setIsOpen(false);
  }
  return (
    <div className='scrollable'>
      {/*<ButtonConfirmNew  onConfirm={onContextMenuFunction}  title="" query="Do you really want to delete Message '.....'?"/>*/}
      <ConfirmModal onConfirm={onContextMenuFunction} onClose={onClose} isOpen={isOpen} content = {"Ревльно хочеш видалити месседж?"} />
      {messages &&
        messages.map((m, i) => {
          //console.log("isSameSender(messages, m, i, user._id) = ", isSameSender(messages, m, i, user._id));
          //console.log("isLastMessage(messages, i, user._id) = ", isLastMessage(messages, i, user._id));
          //console.log("selectedChat.isGroupChat = ", selectedChat.isGroupChat);
          return (<div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && selectedChat.isGroupChat && (
              // <span className='chat_message_avatar' label={m.sender.name} placement="bottom-start" hasArrow>
              <span className='chat_message_avatar' label={m.sender.name} placement="bottom-start" >
                    <img alt='avatar' className='chat_message_avatar_image' src={m.sender.pic} />

              </span>
            )}
            <span className='chatMessage'
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
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
                  // onMouseUp = {()=> {setI(i); setModal({ ...modal, view: "query"})}}  onContextMenu={(e)=> e.preventDefault()}
                  // onContextMenu={(e)=>onClickSpanFunction(e, i)}
                  onClick={(e)=>onClickSpanFunction(e, m)}
            >
              {/*<span className='chatMessageText'>*/}
                {m.sender._id !== user._id && selectedChat.isGroupChat ? <span className='chatMessageName'>{m.sender.name}</span> : null }
                <span className={` ${m.pic ?  'picture_content' : '' }`}>{m.content}</span>
              {/*</span>*/}
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
