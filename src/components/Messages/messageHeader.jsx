const MessageHeader=({conversation,setConversation,mode,selectedMessageIds,del})=>{
    return(
        <div>
            <div className="flex items-center gap-3 h-20 border-b border-gray-700  bg-gray-800 p-2 relative z-20 truncate">
                <img src={"https://res.cloudinary.com/dfbsq6jtv/image/upload/v1769852786/"+conversation.peerProfile} className="h-13 w-13 rounded-full"></img>
                {mode == "chat" && <p className="text-xl font-medium">{conversation.email}</p>}
                {mode == "newUser" && <input className="outline-none border-b-2" onChange={(e) => {
                    setConversation(prev=>({...prev,email:e.target.value}))
                }} type="email" placeholder="Enter New User Email" ></input>}

                {selectedMessageIds.length > 0 && <p className=" flex flex-1 justify-end mr-5" onClick={del}>Delete</p>}
            </div>
        </div>
    )
}
export default MessageHeader