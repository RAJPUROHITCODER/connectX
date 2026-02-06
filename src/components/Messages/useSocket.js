import { useContext, useEffect, useRef } from "react"
import { io } from "socket.io-client"
import { AuthContext } from "../../AuthContext"

const SOCKET_URL=import.meta.env.VITE_API_URL
export const useSocket=()=>{
    const socketRef=useRef()
    const {user,setUser}=useContext(AuthContext)
    useEffect(() => {
        socketRef.current = io(SOCKET_URL)
        return () => {
            socketRef.current.disconnect( )
        }
    }, [])
    
    useEffect(()=>{
        
        if(user?.email){
            socketRef.current.emit("join",user.email)
        }
    },[user])

    return {socketRef}

}
