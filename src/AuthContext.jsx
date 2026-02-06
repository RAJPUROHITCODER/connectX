import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()
const AuthProvider = ({children}) => {
    const [user, setUser] = useState()
    

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/user/me`, { credentials: "include" })
            .then(res => res.json())
            .then(result => setUser(result))
            .catch(() => setUser("UnAuthorized"))
        
    }, [])

    return (
        <AuthContext.Provider value={{user,setUser}}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthProvider

export {AuthContext}