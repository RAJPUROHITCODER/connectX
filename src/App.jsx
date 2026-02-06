import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Login from './components/Login'
import Conversations from './components/conversations'
import AuthProvider from './AuthContext'
import SignUp from './components/signUp'
import Message from './components/Messages/message'

function App() {
  const router = createBrowserRouter([
    {
      path: "/user/login",
      element: <Login></Login>
    },
    {
      path:"/user/signup",
      element:<SignUp></SignUp>
    }, 
    {
      path: '/',
      element:
        <AuthProvider>
          <Conversations></Conversations>
        </AuthProvider>
    },
    {
      path: 'message/:id',
      element:<Message></Message>
    }
  ])
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
