import React, {useState} from "react";
import { motion } from "framer-motion";
import { HiUserGroup } from "react-icons/hi";
import { FiLogOut, FiSearch, FiMenu, FiX } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { logoutUser } from "../Store/ReducSlice";
import axios from "axios";

export default function Sidebar({ allUsers, setSelectUser, selectUser }) {

  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false);
  const handleLogout = async () => {
    try {
      const res = await axios.get("/api/v1/user/logout");

      dispatch(logoutUser());
    } catch (error) {
      console.log("Logout error: ", error.message);
    }
  };
  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-md text-white shadow-lg"
      >
        {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed sm:static top-0 left-0 h-full z-40 bg-gray-900 text-white w-64 sm:w-72 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        } shadow-[5px_0px_5px_rgba(0,0,0,0.1)]`}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <img src="/logo white.png" alt="Logo" className="w-20 h-16 object-contain" />
          <div className="flex space-x-3">
            <button title="Groups" className="p-1 rounded-full hover:text-violet-700 transition">
              <HiUserGroup size={20} />
            </button>
            <button
              title="Logout"
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-red-600 transition"
            >
              <FiLogOut size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-2 border-b border-gray-700 relative">
          <FiSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-2 py-2 rounded-md bg-gray-800 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {allUsers.map((user) => {
            const isSelected = selectUser?._id === user._id;
            return (
              <motion.div
                key={user._id}
                layout
                transition={{ duration: 0.3 }}
                onClick={() => {
                  setSelectUser(user);
                  setIsOpen(false); // close sidebar on mobile
                }}
                className={`flex items-center px-4 py-3 cursor-pointer transition-all mb-1 mr-1 ${
                  isSelected ? "bg-gray-800" : "hover:bg-gray-800 text-violet-700"
                }`}
              >

                <div className="w-4 h-4 rounded-full bg-indigo-600" >
                  <p></p>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-full mr-3 border-2 border-b-indigo-600">
                  <img src={user?.profileImage} alt="" className="w-full h-full rounded-full object-cover" />
                </div>
                <div className="truncate">
                  <div
                    className={`text-sm truncate ${
                      isSelected ? "font-bold text-violet-700" : "font-medium text-gray-200"
                    }`}
                  >
                    {user.fullName}
                  </div>
                  <div className="text-xs text-gray-400 truncate w-40 sm:w-48">
                    Some sample message preview...
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
}
