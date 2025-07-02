import React from "react"
import { Outlet } from "react-router-dom"
import ChatBox from "./Pages/User1";
import { useSelector } from "react-redux";
function App() {
  const user = useSelector((state) => state.login.user);

  return (

    
    <>
    <ChatBox/>
    <Outlet />
    </>
  )
}

export default App