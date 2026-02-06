import { useContext, useEffect } from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Message from "./Messages/message"
import { AuthContext } from "../AuthContext"
import { useSocket } from "./Messages/useSocket"
import MyAccount from "./conversations/myAccount"
import WelcomeScreen from "./conversations/welcomeScreen"


const Conversations = () => {
    const [chatList, setChatlist] = useState()
    const [conversation, setConversation] = useState(null)
    const [mode, setMode] = useState("empty")
    const { user, setUser } = useContext(AuthContext)
    const navigate = useNavigate()
    const { socketRef } = useSocket()


    useEffect(() => {
        async function getChatList(params) {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/conversations`,
                {
                    credentials: "include"
                }
            )
            if (!res.ok) {
                return navigate("/user/login")
            }
            const result = await res.json()
            setChatlist(result)
        }
        getChatList()
    }, [])


    const updateChatList = (conversationId, message, lastMessageAt, from, to) => {
        setChatlist(prev => {

            let sortChatlist = [...(prev?.data || [])]
            const hasConversation = sortChatlist.find(x => x._id == conversationId)
            if (hasConversation) {
                sortChatlist = sortChatlist.map(x => {
                    if (x._id == conversationId) {
                        x.lastMessage = message
                        x.lastMessageAt = lastMessageAt
                        x.sender = from
                    }
                    return x
                })
                sortChatlist.sort((x, y) => Date.parse(y.lastMessageAt) - Date.parse(x.lastMessageAt))
            }
            else {
                sortChatlist = [{ _id: conversationId, lastMessage: message, lastMessageAt: lastMessageAt, sender: from, members: [to, from] }, ...(prev?.data || [])]
            }
            return ({ ...prev, data: sortChatlist })
        })
    }

    async function addNewUser(params) {
        setMode("newUser")
        setConversation({ email: undefined })
    }

    useEffect(() => {
        socketRef.current.on("receivedMessage", ({ to, from, message, createdAt, conversationId }) => {
            console.log({ to, from, message, createdAt, conversationId })
            updateChatList(conversationId, message, createdAt, from, to)
        })
    }, [])


    useEffect(() => {
        socketRef.current.on("messageDeleted", ({ _id, to, from, isLastMessage, lastMessage, createdAt }) => {
            if (isLastMessage) {
                updateChatList(_id, lastMessage, createdAt, from, to)
            }
        })
    }, [])

    return (

        <div className="grid sm:grid-cols-[1fr_2fr] ">
            {chatList &&
                <div className="bg-gray-800 min-w-0">
                    <div className=" flex justify-between items-center">
                        <h1 className="text-2xl font-bold m-2">connect~X</h1>
                        <img src={"https://res.cloudinary.com/dfbsq6jtv/image/upload/v1769852786/" + user?.profile} alt="Me" className="h-10 w-10 mr-2 mt-3 rounded-full" onClick={() => setMode("myAccount")}></img>
                    </div>
                    <div className="border-r-1 p-2 border-stone-500 relative overflow-auto h-[90dvh] custom-scrollbar ">
                        {chatList && chatList["data"] &&
                            chatList["data"].map((item, index) => {
                                const peerEmail = user?.email != item.members[0] ? item.members[0] : item.members[1]
                                let peerProfile = chatList.users.filter(x => x.email == peerEmail)
                                peerProfile = peerProfile[0] ? peerProfile[0].profile : "chat-app/profile/file_bc2k2q.png"
                                return <div onClick={() => {
                                    setConversation({ email: user.email != item.members[0] ? item.members[0] : item.members[1], chatId: item._id, peerProfile: peerProfile })
                                    setMode("chat")
                                }} key={index} className="bg-gray-700 h-16 flex rounded-xl my-2">
                                    {/* <Link to={`/message/${chatList.user.email != item.members[0] ?item.members[0]:item.members[1]}`}> */}
                                    <div className="flex gap-4 m-3 items-center min-w-0 w-full">
                                        <img src={"https://res.cloudinary.com/dfbsq6jtv/image/upload/v1769852786/" + peerProfile} className="h-13 w-13 rounded-full"></img>
                                        <div className="min-w-0 flex-1">
                                            <div className="font-medium">
                                                {user?.email != item.members[0] ? <p>{item.members[0].slice(0, item.members[0].indexOf("@"))}</p> : <p>{item.members[1].slice(0, item.members[1].indexOf("@"))}</p>}
                                            </div>
                                            <div className="flex items-center gap-2 min-w-0">
                                                <p className="text-[14px] text-gray-300 truncate">
                                                    {item.lastMessage}
                                                </p>
                                            </div>

                                        </div>
                                    </div>
                                    {/* </Link> */}
                                </div>
                            })
                        }
                        <button className="bg-green-500 sticky h-10 w-10 mr-2 rounded-full font-bold text-xl bottom-2  left-[99%]" onClick={addNewUser}>+</button>

                    </div>
                </div>
            }
            {mode == "chat" && <Message updateChatList={updateChatList} conversation={conversation} setConversation={setConversation} mode={"chat"} ></Message>}
            {mode == "newUser" && <Message updateChatList={updateChatList} conversation={conversation} setConversation={setConversation} mode={"newUser"} setMode={setMode} ></Message>}
            {mode == "myAccount" && <MyAccount></MyAccount>}
            {mode == "empty" && <WelcomeScreen></WelcomeScreen>}

        </div>

    )
}
export default Conversations
