import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { ZingleeeLogo } from '../pages/LandingPage'
import assets from '../assets/assets'
import axios from "axios";
import toast from "react-hot-toast";
import {Signpost ,UserRound, BellRing,Settings,LogOut,Palette, Share2 } from 'lucide-react'; 

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages, getRequests, requests, respondRequest  } = useContext(ChatContext)
  const { logout, onlineUsers, authUser } = useContext(AuthContext)
  const { theme, setTheme, THEMES } = useTheme()
  const [searchInput, setSearchInput] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("friends");
  const [showThemes, setShowThemes] = useState(false)
  const [searchResults, setSearchResults] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [requestTab, setRequestTab] = useState("incoming");

  const sentMap = new Set(sentRequests.map(r => r.receiver._id));
const friendMap = new Set(users.map(u => u._id));
const incomingMap = new Set(requests.map(r => r.sender._id));
  

  const navigate = useNavigate()

  const filteredUsers = searchInput
    ? users.filter(u => u.fullName.toLowerCase().includes(searchInput.toLowerCase()))
    : users


// search users 
const searchUsers = async (query) => {
  if (!query) {
    setSearchResults([]);
    return;
  }

  try {
    const { data } = await axios.get(`/api/auth/search?q=${query}`);
    if (data.success) { 
      setSearchResults(data.users);
    }
  } catch (error) {
    toast.error(error.message);
  }
};

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
}, []);


// share profile ----------------------
const handleShareInvite = async () => {
  const userId = authUser?.zingleeId || authUser?._id;
  const liveUrl = "https://zingleee.vercel.app";

  const shareText = `Hey! I'm using Zingleee.

Join using my ID: ${userId}

// Try it here: ${liveUrl}
`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Join with me on Zingleee",
        text: shareText,
        url: liveUrl,
      });
    } catch (error) {
      console.log("Share cancelled", error);
    }
  } else {
    await navigator.clipboard.writeText(shareText);
    toast.success("Invite copied to clipboard!");
  }

  setMenuOpen(false);
};

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
      }}
    >
      {/* Header */}
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
        <div style={{ position: 'relative', flexShrink: 0 }}>
      <button 
        className="icon-btn" 
        onClick={() => setMenuOpen(!menuOpen)} 
        style={{ 
          width: 34, 
          height: 34, 
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        ⋮
      </button>
          <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -8 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute', top: '110%', right: 0, zIndex: 50,
                    background: 'rgba(15,12,40,0.95)', backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14,
                    padding: 8, minWidth: 160,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                  }}
                >
                  {[
                    { icon: <UserRound />, label: 'Edit Profile', action: () => { navigate('/profile'); setMenuOpen(false) } },
                    { icon:<Palette />, label: 'Themes', action: () => { setShowThemes(!showThemes); setMenuOpen(false) } },
                    { icon: <BellRing />, label: 'Notifications', action: () => setMenuOpen(false) },
                    { icon: <Settings />, label: 'Settings', action: () => setMenuOpen(false) },
                    {icon: <Share2 />,label: 'Invite Friends',action: () => handleShareInvite(),danger: false,},
                   { icon: <Signpost />, label: 'How to Use', action: () => {  navigate('/ins'); setMenuOpen(false); }, 
                     danger: false},
                    { icon: <LogOut />, label: 'Logout', action: () => { logout(); setMenuOpen(false) }, danger: true },
                  ].map((item, i) => (
                    <button key={i}
                      onClick={item.action}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        width: '100%', padding: '9px 12px', borderRadius: 10,
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: item.danger ? '#f87171' : 'rgba(255,255,255,0.8)',
                        fontSize: 13, fontFamily: 'Outfit, sans-serif',
                        transition: 'background 0.15s ease', textAlign: 'left',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <span>{item.icon}</span> {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 50, padding: '9px 14px',
          transition: 'all 0.3s ease',
        }}
          onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
          onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
        >
          <span style={{ fontSize: 14, opacity: 0.5 }}>🔍</span>
          <input
            type="text"
            placeholder="Search users..."
            value={searchInput}
           onChange={(e) => {
          setSearchInput(e.target.value);
          searchUsers(e.target.value);
          }}
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: 'white', fontFamily: 'Outfit, sans-serif', fontSize: 13,
            }}
          />
          {searchInput && (
            <button onClick={() => setSearchInput('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
              ✕
            </button>
          )}
        </div>

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
          filteredUsers.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
              No friends yet
            </motion.div>
          ) : (
            filteredUsers.map((user, idx) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className={`user-item ${selectedUser?._id === user._id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedUser(user)
                  setUnseenMessages(prev => ({ ...prev, [user._id]: 0 }))
                }}
              >
                <img
                  src={user?.profilePic || assets.avatar_icon}
                  alt=""
                  style={{ width: 42, height: 42, borderRadius: '50%' }}
                />
                <p>{user.fullName}</p>
              </motion.div>
            ))
          )
        )}


        {/* 📩 REQUESTS TAB */}
        {activeTab === "requests" && (
  <div>

    {/* 🔹 SUB TABS */}
    <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
      {["incoming", "sent"].map(tab => (
        <button
          key={tab}
          onClick={() => setRequestTab(tab)}
          style={{
            flex: 1,
            padding: "6px",
            borderRadius: 8,
            background: requestTab === tab ? "var(--accent)" : "rgba(255,255,255,0.05)",
            color: "white",
            fontSize: 12,
            cursor: "pointer"
          }}
        >
          {tab}
        </button>
      ))}
    </div>

    {/* 🔹 INCOMING */}
    {requestTab === "incoming" && (
      requests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 20 }}>
          No incoming requests
        </div>
      ) : (
        requests.map((req) => (
          <div key={req._id} className="user-item" style={{ justifyContent: "space-between" }}>
            <div>
              <p>{req.sender.fullName}</p>
              <p style={{ fontSize: 12, opacity: 0.6 }}>
                {req.sender.zingleeId}
              </p>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
  {/* Accept Button */}
  <button
    onClick={async () => {
      await respondRequest(req._id, "accept");
      await getUsers();
      await getRequests();
      await getSentRequests();
    }}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "6px 12px",
      borderRadius: 8,
      border: "1px solid rgba(34,197,94,0.4)",
      background: "rgba(34,197,94,0.1)",
      color: "#22c55e",
      fontSize: 13,
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.2s ease"
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = "rgba(34,197,94,0.2)";
      e.currentTarget.style.transform = "scale(1.05)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = "rgba(34,197,94,0.1)";
      e.currentTarget.style.transform = "scale(1)";
    }}
  >
    ✓ Accept
  </button>

  {/* Reject Button */}
  <button
    onClick={async () => {
      await respondRequest(req._id, "reject");
      await getUsers();
      await getRequests();
      await getSentRequests();
    }}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "6px 12px",
      borderRadius: 8,
      border: "1px solid rgba(248,113,113,0.4)",
      background: "rgba(248,113,113,0.1)",
      color: "#f87171",
      fontSize: 13,
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.2s ease"
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = "rgba(248,113,113,0.2)";
      e.currentTarget.style.transform = "scale(1.05)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = "rgba(248,113,113,0.1)";
      e.currentTarget.style.transform = "scale(1)";
    }}
  >
    ✕ Reject
  </button>
</div>
          </div>
        ))
      )
    )}

    {/* 🔹 SENT */}
    {requestTab === "sent" && (
      sentRequests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 20 }}>
          No sent requests
        </div>
      ) : (
        sentRequests.map((req) => (
          <div key={req._id} className="user-item" style={{ justifyContent: "space-between" }}>
            <div>
              <p>{req.receiver.fullName}</p>
              <p style={{ fontSize: 12, opacity: 0.6 }}>
                {req.receiver.zingleeId}
              </p>
            </div>

            <button
              onClick={async () => {
                await axios.post("/api/friends/cancel", { requestId: req._id });
                await getSentRequests();
                await getRequests();
                toast.success("Request cancelled");
              }}
              style={{
                background: "rgba(248,113,113,0.1)",
                border: "1px solid rgba(248,113,113,0.3)",
                color: "#f87171",
                padding: "4px 10px",
                borderRadius: 6,
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
          </div>
        ))
      )
    )}

  </div>
)}

        {/* 🌐 COMMUNITIES TAB */}
        {activeTab === "communities" && (
          <div style={{ padding: 12 }}>
            <p style={{ fontSize: 13 }}>Communities coming soon</p>
          </div>
        )}
      </>
    )}

  </AnimatePresence>
</div>

      {/* Bottom — auth user */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: 10,
        flexShrink: 0, background: 'rgba(0,0,0,0.1)',
      }}>
        <img
          src={authUser?.profilePic || assets.avatar_icon}
          alt=""
          onClick={() => navigate('/profile')}
          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)', cursor: 'pointer' }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {authUser?.fullName}
          </p>
          <p style={{ fontSize: 11, color: '#4ade80' }}>● Active</p>
        </div>
        <button className="icon-btn" onClick={() => navigate('/profile')} title="Edit profile" style={{ fontSize: 15 }}>
          ✏️
        </button>
      </div>
    </motion.div>
  )
}

export default Sidebar