import React from 'react'
import { RiChatSmile3Line } from "react-icons/ri";

export default function NoChat() {
  return (
    <>
    <div className="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-800 text-white">
  {/* Icon illustration (replace with your SVG or image) */}
  <div className="relative w-50 h-40 mb-4">
    <div className="absolute inset-0 bg-gray-900 rounded-lg border-4 mx-4 border-violet-700 flex items-center justify-center text-4xl text-gray-500">
      <RiChatSmile3Line className='text-violet-700 text-9xl'/> 
    </div>
    <div className="absolute -left-5 top-5 w-4 h-4 bg-gray-400 rounded-full animate-ping"></div>
    <div className="absolute -right-5 top-5 w-4 h-4 bg-gray-400 rounded-full animate-ping"></div>
  </div>


  {/* Subtitle */}
  <p className="text-sm text-gray-500 mt-2">No chats yet! Time to make some noise.</p>
</div>

    </>
  )
}
