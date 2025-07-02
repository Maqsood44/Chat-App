import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import MessageArea from "../Components/MessageArea";
import axios from "axios";
import NoChat from "../Components/NoChat";

const ChatApp = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [selectUser, setSelectUser] = useState(null);
  const [conversation, setConversation] = useState([]);

  // 🟩 Get all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/v1/user/getalluser");
        setAllUsers(res.data?.data || []);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUsers();
  }, [conversation]);

  // 🟨 When user selected, fetch conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectUser?._id) return;

      try {
        const res = await axios.get(
          `/api/v1/chat/fetchmessages/${selectUser._id}`
        );
        setConversation(res.data?.data || []);
      } catch (error) {
        console.error("❌ Error fetching messages:", error.message);
      }
    };

    fetchMessages();
  }, [selectUser]);

  return (
      <div className="flex h-screen sm:h-screen">
        <Sidebar
          allUsers={allUsers}
          setSelectUser={setSelectUser}
          selectUser={selectUser}
        />
        {
          !selectUser ?
          <NoChat />
          :
      <MessageArea
        selectUser={selectUser}
        conversation={conversation}
        setConversation={setConversation}
      />
        }
    </div>
  );
};

export default ChatApp;
