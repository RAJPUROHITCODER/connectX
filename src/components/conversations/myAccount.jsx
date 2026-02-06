import { useContext, useRef, useState } from "react"
import { AuthContext } from "../../AuthContext"

const MyAccount = () => {
    const { user, setUser } = useContext(AuthContext)
    const fileRef = useRef()
    const [prev, setPrev] = useState("https://res.cloudinary.com/dfbsq6jtv/image/upload/v1769852786/"+user?.profile)
    function handleClick() {
        fileRef.current.click()
    }
    async function handleFile(e) {
        const file = e.target.files[0]
        setPrev(URL.createObjectURL(file))
        const profileImage=new FormData()
        profileImage.append("profile",file)
        const data=await fetch(`${import.meta.env.VITE_API_URL}/upload/profile`,{
            method:"POST",
            body:profileImage
        })
        const result=await data.json()
        const res=await fetch(`${import.meta.env.VITE_API_URL}/user/me`,
            {
                method:"PATCH",
                credentials:"include",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({email:user.email,profile:result.public_id})
            }
        )    
        if(!res.ok) return
    }

    return (
        <div className="bg-gray-800">
            <p className="text-2xl font-medium m-2">Profile</p>
            <form>
                <div className="flex justify-center my-10">
                    <img src={prev} alt="Me" className="h-30 w-30 rounded-full" onClick={handleClick}></img>
                    <input ref={fileRef} className="hidden" type="file" onChange={handleFile }></input>
                </div>
                <div className="p-5 ">
                    <p className="font-bold text-gray-300 leading-8 ">Name</p>
                    <input type="text" value={user?.fullName} className=""></input>
                </div>
            </form>
            <div className="p-5 ">
                <p className="font-bold text-gray-300 leading-8">About</p>
                <p className="">Let’s stay connected</p>
            </div>

            <div className="p-5 ">
                <p className="font-bold text-gray-300 leading-8">Email</p>
                <p className="">{user?.email}</p>
            </div>
        </div>
    )
}
export default MyAccount