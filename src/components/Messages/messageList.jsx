import { useEffect, useRef } from "react"

const MessageList = ({ messages, selectedMessageIds, setSelectedMessageIds, user }) => {
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "auto"
        })
    }
    useEffect(() => {
        scrollToBottom()
    }, [messages])

    return (
        <div className="px-1 overflow-auto flex-1 scrollbar-hide bg-gradient-to-b from-gray-900 to-gray-800">
            {messages && messages.length != 0 &&
                messages.map((item, index) => {

                    return <div key={index} className={`m-2 ${selectedMessageIds.includes(item._id) ? "bg-gray-600" : ""}`} onClick={() => {
                        if (user["email"] == item["sender"]) {
                            if (!selectedMessageIds.includes(item._id)) {
                                setSelectedMessageIds(prev => [...prev, item._id])
                                return
                            }
                            let unselectId = [...selectedMessageIds]
                            unselectId.splice(unselectId.indexOf(item._id), 1)
                            setSelectedMessageIds(unselectId)
                        }
                    }

                    }>

                        <div className="">

                            {user["email"] != item["sender"] && item.type == "image" && item.status == "sent" &&
                                <a href={`https://res.cloudinary.com/dfbsq6jtv/image/upload/fl_attachment/${item.url}`}>
                                    <img src={`https://res.cloudinary.com/dfbsq6jtv/image/upload/v1770186455/${item.url}`} className="rounded-xl border-2 border-gray-600 h-60 inline m-1 w-80  flex-shrink " />
                                </a>
                            }

                            <div className="flex justify-start ">
                                {user["email"] != item["sender"] && item.message && <p className="bg-gray-700 rounded-2xl rounded-bl-none   inline m-1 max-w-80 flex-shrink wrap-anywhere p-3 ">{item.message}</p>}
                            </div>
                            {user["email"] != item["sender"] && item.status == "failed" && <div className="h-10 bg-stone-800 rounded-[5px] text-stone-400 text-sm"> <span>failed to send</span>  </div>}
                        </div>

                        <div>
                            <div className="flex justify-end">
                                {user["email"] != item["receiver"] && item.type == "image" && item.status == "sent" &&
                                    <a href={`https://res.cloudinary.com/dfbsq6jtv/image/upload/fl_attachment/${item.url}`} onClick={e => e.stopPropagation()}>
                                        <img src={item.url.startsWith("chat-app") ? `https://res.cloudinary.com/dfbsq6jtv/image/upload/v1770186455/${item.url}` : item.url} alt="Retry" className=" rounded-xl border-2 border-gray-600 h-60  inline m-1 w-80  flex-shrink   "></img>
                                    </a>
                                }
                                {user["email"] != item["receiver"] && item.type == "image" && item.status == "uploading" &&
                                    <div className="relative inline-block m-1">
                                        <img src={item.url.startsWith("chat-app") ? `https://res.cloudinary.com/dfbsq6jtv/image/upload/v1770186455/${item.url}` : item.url} alt="Uploading" className="rounded-xl border-2 border-gray-600 h-60  w-80  flex-shrink  wrap-anywhere" />
                                        <div className="absolute inset-0 flex items-center justify-center "><div className="w-6 h-6 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" /></div>
                                    </div>

                                }
                                {user["email"] != item["receiver"] && item.status == "failed" && <div className="h-10 bg-stone-800 rounded-[5px] text-stone-400 text-sm"> <span>failed to send</span>  </div>}
                                {user["email"] != item["receiver"] && item.message && <p className="bg-indigo-600 p-3 rounded-2xl rounded-br-none   inline m-1 max-w-80  flex-shrinkt  wrap-anywhere">{item.message}</p>}

                            </div>
                            <div className="flex justify-end">
                            </div>
                        </div>

                    </div>
                })
            }
            <div ref={messagesEndRef}></div>
        </div>

    )
}
export default MessageList