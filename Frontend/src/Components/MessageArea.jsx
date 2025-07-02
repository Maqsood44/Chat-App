import React, { useState, useEffect, useRef } from "react";
import { FaPhone, FaVideo } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { IoIosSend } from "react-icons/io";
import { socket } from "../socket";
import { useSelector } from "react-redux";
import axios from "axios";

export default function ChatComponent({
  selectUser,
  conversation,
  setConversation,
}) {
  const user = useSelector((state) => state.login.user);
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState("");

  // ✅ Scroll to bottom when conversation updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, selectUser]);

  // ✅ Socket connection
  useEffect(() => {
    if (!user?._id) return;

    // Register user to socket
    socket.emit("register", user._id);

    // Handle incoming private messages
    const messageHandler = ({ from, message }) => {
      setConversation((prev) => [
        ...prev,
        { senderId: from, message, timestamp: new Date() },
      ]);
    };

    socket.on("private-message", messageHandler);

    return () => {
      socket.off("private-message", messageHandler);
    };
  }, [user?._id, setConversation]);

  // ✅ Handle Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      await axios.post(`/api/v1/chat/sendmessege/${selectUser._id}`, {
        senderId: user._id,
        reciverId: selectUser._id,
        message,
      });

      setConversation((prev) => [
        ...prev,
        { senderId: user._id, message, createdAt: new Date() },
      ]);
      setMessage("");
    } catch (error) {
      console.error("❌ Failed to send message:", error);
    }
  };

  return (
    <div className="w-screen lg:w-10/10 sm:w-3/4 bg-gray-800 flex flex-col text-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-800 shadow-md z-20">
        {/* <div className="flex items-center md:text-amber-300">
          <div className="w-10 h-10 border-b-blue-800 border-2 rounded-full mr-3">
            <img src={selectUser?.profileImage} className="w-full h-full rounded-full" alt="" />
          </div>
          <span className="font-semibold text-lg">
            {selectUser?.fullName || "User"}
          </span>
        </div> */}
        <div className="flex-1 flex items-center justify-center sm:justify-start">
          <div className="w-10 h-10 border-b-blue-800 border-2 rounded-full mr-3">
            <img
              src={selectUser?.profileImage}
              className="w-full h-full rounded-full"
              alt=""
            />
          </div>
          <span className="font-semibold text-lg truncate">
            {selectUser?.fullName || "User"}
          </span>
        </div>

        <div className="flex gap-4 text-gray-400">
          <FaVideo className="cursor-pointer hover:text-violet-700 transition" />
          <FaPhone className="cursor-pointer hover:text-violet-700 transition" />
          <BsThreeDots className="cursor-pointer hover:text-violet-700transition" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 flex flex-col space-y space-y-4">
        {[...conversation].map((msg) => {
          const isSentByUser = msg.senderId === user._id;
          return (
            <div
              key={msg._id}
              className={`flex flex-col ${
                isSentByUser ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs text-sm ${
                  isSentByUser
                    ? "bg-violet-600 text-white rounded-br-none"
                    : "bg-gray-700 text-gray-100 rounded-bl-none"
                }`}
              >
                {msg.message}
              </div>
              <span className="text-xs text-gray-400 mt-1">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-800 flex items-center">
        <form onSubmit={handleSendMessage} className="flex w-full items-end">
          <textarea
            placeholder="Write a message..."
            rows={1}
            className="w-full resize-none overflow-y-hidden custom-scrollbar p-2 px-4 bg-gray-800 border border-gray-700 rounded-3xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 max-h-[6rem]" // ~4 rows
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);

              // auto-resize logic
              const target = e.target;
              target.style.height = "auto";
              target.style.height = target.scrollHeight + "px";
            }}
          />

          <button
            type="submit"
            className="ml-3 bg-violet-600 hover:bg-violet-700 text-white p-2 w-10 h-10 flex items-center justify-center rounded-full transition cursor-pointer"
          >
            <IoIosSend size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
