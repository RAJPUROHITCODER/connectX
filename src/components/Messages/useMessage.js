import { useContext, useEffect, useRef } from "react"
import { useState } from "react"
import { useSocket } from "./useSocket"
import { AuthContext } from "../../AuthContext"

export const useMessage = (conversation, setConversation, mode, updateChatList) => {


    const [messages, setMessages] = useState([])
    const [inputMessage, setInputMessage] = useState()
    const [selectedMessageIds, setSelectedMessageIds] = useState([])
    const [file, setFile] = useState([])
    const [type, setType] = useState("text")
    const [image, setImage] = useState([])
    const { socketRef } = useSocket()
    const { user, setUser } = useContext(AuthContext)
    const conversationRef = useRef(conversation)
    const messagesRef = useRef(null)

    useEffect(() => {
        conversationRef.current = conversation
    }, [conversation])

    useEffect(() => {
        messagesRef.current = messages
    }, [messages])

    useEffect(() => {
        socketRef.current.on("receivedMessage", ({ _id, to, from, message, createdAt, url, type,status }) => {
            if (conversationRef.current.email == from) {

                setMessages(prev => ([...prev, { _id: _id, sender: from, message: message, receiver: to, createdAt: createdAt, url: url, type: type ,status:status}]))

            }
        })
    }, [])


    useEffect(() => {
        async function getMessages(params) {
            const res = await fetch(`http://localhost:8000/message/${conversation?.email}`, {
                credentials: "include"
            })
            const result = await res.json()
            setMessages(result.messages)
        }
        getMessages()
    }, [conversation?.email])

    function sendFile(e) {
        const fileArray = e.target.files
        setImage(fileArray)
        let url = []
        Object.values(fileArray).map((item) => {
            url.push(URL.createObjectURL(item))
        })
        if(image.length==0) setType("text")
        setType("image")
        setFile(url)
    }

    async function sendMessage() {
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(conversation.email)) return
        let result;
        if(mode == "newUser"){
            const res =await fetch(`http://localhost:8000/user/by-email/?email=${conversation.email}`)
            if(!res.ok){
                return 
            }
        }
        if (type == "text" && inputMessage) {
            const res = await fetch(`http://localhost:8000/message/${conversation.email}`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: inputMessage })
            })
            result = await res.json()
            setMessages(prev => ([...prev, { sender: user?.["email"], _id: result.newMessage[0]._id, message: inputMessage, receiver: conversation.email, updatedAt: Date.now(), createdAt: result.newMessage[0].createdAt }]))
            socketRef.current.emit("sendMessage", {
                _id: result.newMessage[0]._id,
                from: user["email"],
                to: conversation.email,
                message: inputMessage,
                createdAt: result.newMessage[0].createdAt,
                conversationId: result.conversationDetail._id
            })
            if (mode == "newUser") {
                setConversation(prev => ({ ...prev, chatId: result.conversationDetail._id }))
            }
            updateChatList(result.conversationDetail._id, inputMessage, result.newMessage[0].createdAt, user?.["email"], conversation.email)
            setInputMessage("")



        }
        else {
            if (image.length != 0) {
                const messagePayload = []
                Object.values(image).map((x, index) => {
                    messagePayload.push({
                        message: index === 0 ? inputMessage : "",
                        type: x.type.startsWith("image/") ? "image" : x.type.startsWith("video/") ? "video" : x.type == "application/pdf" ? "pdf" : "text",
                    })
                })
                const res = await fetch(`http://localhost:8000/message/${conversation.email}`,
                    {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ messages: messagePayload })
                    }
                )
                const messageIds = await res.json()
                
                if (mode == "newUser") {
                    conversationRef.current.chatId=messageIds.conversationDetail._id 
                    setConversation(prev => ({ ...prev, chatId: messageIds.conversationDetail._id }))
                }
                const formattedMessages = []
                messageIds.newMessage.map((item, index) => {
                    const type = image[index].type
                    formattedMessages.push({
                        sender: user?.["email"],
                        _id: item._id,
                        message: item.message,
                        receiver: item.receiver,
                        updatedAt: Date.now(),
                        createdAt: item.createdAt,
                        type: type.startsWith("image/") ? "image" : type.startsWith("video/") ? "video" : type == "application/pdf" ? "pdf" : "text",
                        url: file[index],
                        status: "uploading"
                    })
                })
                setMessages(prev => ([...prev, ...formattedMessages]))
                socketRef.current.on("messageSent", ({ _id, status,url }) => {
                    setMessages(prev =>
                        prev.map(item => item._id === _id ? { ...item, status,url } : item))
                })
                const messageLength = messageIds.newMessage.length
                const lastMessage = formattedMessages[messageLength - 1].message ? formattedMessages[messageLength - 1].message : formattedMessages[messageLength - 1].type
                updateChatList(conversationRef.current.chatId, lastMessage, messageIds.newMessage[messageLength - 1].createdAt, user?.["email"], conversation.email)
                setFile([])
                setImage([])
                setInputMessage("")
                setType("text")
                const formData = new FormData()
                Object.values(image).forEach((x) => {
                    formData.append("image", x)
                })

                // formData.append("receiver", conversation.email)
                formData.append('messageIds', JSON.stringify(messageIds.newMessage))
                formData.append("conversationId", messageIds.conversationDetail._id)
                const data = await fetch(`${import.meta.env.VITE_API_URL}/upload/image`, {
                    credentials: "include",
                    method: "POST",
                    body: formData
                })
                result = await data.json()
            }
        }
    }

    async function del() {
        const res = await fetch(`http://localhost:8000/message/`, {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: selectedMessageIds })
        })

        const remainingMessage = messages.filter(x => !selectedMessageIds.includes(x._id))
        if (selectedMessageIds.includes(messages[messages.length - 1]["_id"])) {
            let len = remainingMessage.length - 1
            let setLastMessage = len >= 0 ? { lastMessage: remainingMessage[len].message, sender: remainingMessage[len].sender, lastMessageAt: remainingMessage[len].createdAt } : undefined
            if (!setLastMessage) setLastMessage = { lastMessage: "", sender: "", lastMessageAt: 0 }

            socketRef.current.emit("deleteMessage", ({
                _id: conversationRef.current.chatId,
                to: conversationRef.current.email,
                from: conversationRef.current.email,
                selectedMessageIds: selectedMessageIds,
                isLastMessage: true,
                createdAt: setLastMessage.lastMessageAt,
                lastMessage: setLastMessage.lastMessage
            }))

            const res = await fetch(`http://localhost:8000/conversations/${conversation.chatId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ lastMessage: setLastMessage.lastMessage, sender: setLastMessage.sender, lastMessageAt: setLastMessage.lastMessageAt })
            })
            const result = await res.json()
            updateChatList(conversation.chatId, setLastMessage.lastMessage, setLastMessage.lastMessageAt, setLastMessage.sender)
        }
        else {
            socketRef.current.emit("deleteMessage", ({
                _id: conversationRef.current.chatId,
                to: conversationRef.current.email,
                from: conversationRef.current.email,
                selectedMessageIds: selectedMessageIds,
                isLastMessage: false,
                lastMessage: ""
            }))
        }
        setMessages(remainingMessage)
        setSelectedMessageIds([])
    }
    useEffect(() => {
        socketRef.current.on("messageDeleted", ({ selectedMessageIds, to }) => {
            const remainingMessage = messagesRef.current.filter(x => !selectedMessageIds.includes(x._id))
            if (selectedMessageIds.includes(messagesRef.current[messagesRef.current.length - 1]["_id"])) {
                let len = remainingMessage.length - 1
                let setLastMessage = len >= 0 ? { lastMessage: remainingMessage[len].message, sender: remainingMessage[len].sender, lastMessageAt: remainingMessage[len].createdAt } : undefined
                if (!setLastMessage) setLastMessage = { lastMessage: "", sender: "", lastMessageAt: 0 }
            }
            setMessages(remainingMessage)
            setSelectedMessageIds([])
        })
    }, [])
    return { messages, setMessages, user, file, sendFile, sendMessage, inputMessage, setInputMessage, del, selectedMessageIds, setSelectedMessageIds, updateChatList }
}