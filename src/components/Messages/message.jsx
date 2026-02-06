import { useEffect, useRef } from "react"
import io from "socket.io-client"
import { useMessage } from "./useMessage"
import MessageHeader from "./messageHeader"
import MessageList from "./messageList"
import MessageInput from "./messageInput"
// import { useSocket } from "./useSocket"

const ENDPOINT = "http://localhost:8000"

const Message = ({conversation, setConversation, mode ,updateChatList}) => {
    
    const {messages,user,sendFile,file,sendMessage,inputMessage,setInputMessage,del,selectedMessageIds,setSelectedMessageIds}=useMessage(conversation,setConversation,mode,updateChatList)
    
    return (
        <div className="relative h-[99dvh] flex flex-col">
            <MessageHeader conversation={conversation} setConversation={setConversation} mode={mode} selectedMessageIds={selectedMessageIds} del={del}></MessageHeader>
            <MessageList messages={messages} selectedMessageIds={selectedMessageIds} setSelectedMessageIds={setSelectedMessageIds} user={user}></MessageList>
            <MessageInput inputMessage={inputMessage} setInputMessage={setInputMessage} sendMessage={sendMessage} sendFile={sendFile} file={file}></MessageInput>
        </div>
    )
}
export default Message


