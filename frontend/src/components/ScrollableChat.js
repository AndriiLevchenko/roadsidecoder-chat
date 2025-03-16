import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser,} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import {extractDate, extractTime} from "../utils/functions";

const ScrollableChat = ({ messages }) => {
  const { user, selectedChat } = ChatState();
  console.log("selectedChat = ", selectedChat);
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && selectedChat.isGroupChat && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
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
              }}
            >
              {/*<span className='chatMessageText'>*/}
                {m.sender._id !== user._id && selectedChat.isGroupChat ? <span className='chatMessageName'>{m.sender.name}</span> : null }
                <span>{m.content}</span>
              {/*</span>*/}
              <span className='chatMessageTime'>
                {extractTime(m.updatedAt)}
                <span className='chatMessageDate'> {extractDate(m.updatedAt)}</span>
              </span>
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
