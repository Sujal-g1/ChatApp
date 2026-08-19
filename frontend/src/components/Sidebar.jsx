import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { ZingleeeLogo } from '../pages/LandingPage'
import axios from "axios";
import toast from "react-hot-toast";
import {Signpost ,UserRound, BellRing,Settings,LogOut,Palette, Share2, Pen, Megaphone, FileText, ShieldCheck, Search, X } from 'lucide-react'; 
import RainFireflyAnim from './ChatElements/RainFireflyAnim'
import Menu from './SidebarElements/Menu'
import SearchUser from './SidebarElements/SearchUser'
import RequestContainer from './SidebarElements/RequestContainer'
import FriendsContainer from './SidebarElements/FriendsContainer'
import CommunityContainer from './SidebarElements/CommunityContainer'
import SidebarUserProgile from './SidebarElements/SidebarUserProgile'

const Sidebar = () => {
   const { getUsers, users, setUsers, getRequests, requests, getBlockedUsers } = useContext(ChatContext)

   const { logout, onlineUsers, socket } = useContext(AuthContext)

  const { theme, setTheme, THEMES } = useTheme()
  const [searchInput, setSearchInput] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("friends");
  const [showThemes, setShowThemes] = useState(false)
  const [searchResults, setSearchResults] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [requestTab, setRequestTab] = useState("incoming");
  const [friendTab, setFriendTab] = useState("friends");

  const sentMap = new Set(sentRequests.map(r => r.receiver._id));
  const friendMap = new Set(users.map(u => u._id));
  const incomingMap = new Set(requests.map(r => r.sender._id));

  const navigate = useNavigate()


// send req
const sendRequest = async (receiverId) => {
  try {
    await axios.post("/api/friends/request", { receiverId });

    await getSentRequests(); 
    await getRequests();     

    toast.success("Request sent");
  } catch (error) {
    console.log(error.response.data);
    toast.error(error.response?.data?.message || error.message);
  }
};

// outgoing
const getSentRequests = async () => {
  try {
    const { data } = await axios.get("/api/friends/sent-req");
    if (data.success) {
      setSentRequests(data.requests);
    }
  } catch (err) {
    toast.error(err.message);
  }
};

useEffect(() => {
  getUsers();
  getRequests();
  getSentRequests();
  getBlockedUsers();
}, []);

// friend req accepted, rejected etc
 useEffect(() => {
  if (!socket) return;
  const onAccepted = (data) => {
    setSentRequests(prev =>
      prev.filter(
        req =>
          req._id !== data.requestId
      )
    );

    setUsers(prev => {
      const exists =
        prev.some(
          u =>
            u._id ===
            data.friend._id
        );

      if (exists) return prev;

      return [
        data.friend,
        ...prev
      ];
    });
  };

  const onRejected = (data) => {

    setSentRequests(prev =>
      prev.filter(
        req =>
          req._id !== data.requestId
      )
    );
  };

  socket.on(
    "friendRequestAccepted",
    onAccepted
  );

  socket.on(
    "friendRequestRejected",
    onRejected
  );

  return () => {

    socket.off(
      "friendRequestAccepted",
      onAccepted
    );

    socket.off(
      "friendRequestRejected",
      onRejected
    );
  };

}, [socket]);


  return (
    <motion.div
    initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.4 }}
    style={{
      display: 'flex', flexDirection: 'column',
      height: '100%', overflow: 'hidden',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(0,0,0,0.15)',
      width: '320px',         
      flexShrink: 0,
      position: 'relative', // ─── CRITICAL: Anchors absolute animations inside the sidebar bounds
    }}
  >
    
    <RainFireflyAnim />

      {/* Header-> Logo | menu | theme picker | search */}
      <div style={{ padding: '20px 16px 12px', flexShrink: 0 }}>

        <div style={{ 
          display: 'flex', 
         alignItems: 'center', 
         justifyContent: 'space-between', 
         marginBottom: 16,
         gap: '10px' // Ensures they never physically touch
       }}>

          {/* Logo */}
          <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 6, 
      flexShrink: 1, // Allows the text to shrink if the screen is tiny
      minWidth: 0    // Critical for text-overflow to work
    }}>
      <div style={{ filter: 'drop-shadow(0 0 8px var(--glow))', flexShrink: 0 }}>
        <ZingleeeLogo size={28} /> {/* Reduced from 34 for better mobile fit */}
      </div>
      <span style={{ 
        fontFamily: 'Syne, sans-serif', 
        fontWeight: 800, 
        fontSize: 18, // Reduced from 20
        letterSpacing: '-0.02em',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis' // Gracefully cuts text if there's no room
      }}>
        Zingle<span style={{ color: 'var(--accent)' }}>ee</span>
      </span>
          </div>

          {/* Menu */}
        <Menu 
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        showThemes={showThemes} 
        setShowThemes={setShowThemes}
        />


        </div>

        {/* Theme picker (inline) */}
        <AnimatePresence>
          {showThemes && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', marginBottom: 12 }}
            >
              <div style={{
                background: 'rgba(255,255,255,0.04)', borderRadius: 12,
                padding: '12px', display: 'flex', flexWrap: 'wrap', gap: 8,
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <p style={{ width: '100%', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Theme</p>
                {THEMES.map(t => (
                  <button key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`theme-dot ${theme === t.id ? 'active' : ''}`}
                    style={{ background: t.color }}
                    title={t.label}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

       {/* search */}
       <SearchUser 
       searchInput={searchInput}
        setSearchInput={setSearchInput}
        activeTab={activeTab}
        setSearchResults={setSearchResults}
       />

  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 12, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.08em', paddingLeft: 4 }}>
          Messages
   </p>
      </div>

      {/* change tab -> friends , req , comm */}
      <div style={{ display: 'flex', gap: 8, padding: '0 12px 8px' }}>
  {["friends", "requests", "communities"].map(tab => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      style={{
        flex: 1,
        padding: "6px",
        borderRadius: 8,
        background: activeTab === tab ? "var(--accent)" : "rgba(255,255,255,0.05)",
        color: "white",
        fontSize: 12,
        cursor: "pointer"
      }}
    >
      {tab}
    </button>
  ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 12px' }}>
        <AnimatePresence>
          {searchInput ? (
        searchResults.length === 0 ? (
          <div style={{ textAlign: "center", padding: 20 }}>
            No users found
          </div>
        ) : (
          searchResults.map((user) => {
            const isFriend = friendMap.has(user._id);
            const isSent = sentMap.has(user._id);
            const isIncoming = incomingMap.has(user._id);

            return (
              <div key={user._id} className="user-item" style={{ justifyContent: "space-between" }}>
                <div>
                  <p>{user.fullName}</p>
                  <p style={{ fontSize: 12, opacity: 0.6 }}>
                    {user.zingleeId}
                  </p>
                </div>

                <button
                  disabled={isFriend || isSent}
                  onClick={() => {
                    if (isIncoming) {
                      setActiveTab("requests");
                      setRequestTab("incoming");
                    } else {
                      sendRequest(user._id);
                    }
                  }}
                  style={{
                    background: isFriend
                      ? "rgba(34,197,94,0.2)"
                      : isSent
                      ? "gray"
                      : "var(--accent)",
                    border: "none",
                    padding: "4px 10px",
                    borderRadius: 6,
                    cursor: isFriend || isSent ? "not-allowed" : "pointer",
                    color: "white"
                  }}
                >
                  {isFriend
                    ? "Friends"
                    : isSent
                    ? "Requested"
                    : isIncoming
                    ? "Respond"
                    : "Add"}
                </button>
              </div>
            );
          })
        )
      )  : (
            <>
              {/* 👥 FRIENDS TAB */}
              {activeTab === "friends" && (
                <>
               <FriendsContainer 
                friendTab={friendTab}
                setFriendTab={setFriendTab}
                searchInput ={searchInput}
               />
          </>
              )}


              {/* <📩 REQUESTS TAB */}
         {activeTab === "requests" && (
                  <RequestContainer 
                   requestTab={requestTab}
                   setRequestTab={setRequestTab} 
                   sentRequests={sentRequests}
                   setSentRequests={setSentRequests}
                  />
      )}
   
              {/* 🌐 COMMUNITIES TAB */}
              {activeTab === "communities" && (
                <CommunityContainer />
              )}
            </>
          )}

        </AnimatePresence>
      </div>

      {/* Bottom — auth user */}
      <SidebarUserProgile />
      
    </motion.div>
  )
}

export default Sidebar