import React, { useEffect, useRef, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatContext } from "../../../context/ChatContext";
import { AuthContext } from "../../../context/AuthContext";
import { formatMsgTime } from "../../lib/utils";
import assets from "../../assets/assets";
import toast from "react-hot-toast";

const UserChat = () => {
  const { authUser, onlineUsers } = useContext(AuthContext);
  const { selectedUser, setSelectedUser, getMessages, messages, sendMessage } =
    useContext(ChatContext);

  const scrollEnd = useRef();
  const [input, setInput] = useState("");

  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id);
  }, [selectedUser]);

  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">

      {/* HEADER */}
      <div className="flex items-center gap-3 p-3 border-b">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold">{selectedUser.fullName}</p>
          <p className="text-xs text-gray-400">
            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => {
          const isMine = msg.senderId === authUser._id;

          return (
            <div
              key={msg._id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-3 py-2 rounded-xl max-w-xs ${
                  isMine
                    ? "bg-indigo-500 text-white"
                    : "bg-white/10 text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={scrollEnd} />
      </div>

      {/* INPUT */}
      <form
        onSubmit={handleSendMessage}
        className="flex gap-2 p-3 border-t"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-3 py-2 rounded bg-white/10"
          placeholder="Type message..."
        />
        <button className="bg-indigo-500 px-4 rounded">Send</button>
      </form>
    </div>
  );
};

export default UserChat;