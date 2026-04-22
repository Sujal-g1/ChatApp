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

  const navigate = useNavigate()

  const filteredUsers = searchInput
    ? users.filter(u => u.fullName.toLowerCase().includes(searchInput.toLowerCase()))
    : users

  useEffect(() => {
  getUsers();
  getRequests();
}, [onlineUsers]);

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

    setSentRequests(prev => [...prev, receiverId]);

    toast.success("Request sent");
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
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

      {/* ... keep your AnimatePresence and menu items here ... */}
  
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
                    { icon: '👤', label: 'Edit Profile', action: () => { navigate('/profile'); setMenuOpen(false) } },
                    { icon: '🎨', label: 'Themes', action: () => { setShowThemes(!showThemes); setMenuOpen(false) } },
                    { icon: '🔔', label: 'Notifications', action: () => setMenuOpen(false) },
                    { icon: '⚙️', label: 'Settings', action: () => setMenuOpen(false) },
                    { icon: '🚪', label: 'Logout', action: () => { logout(); setMenuOpen(false) }, danger: true },
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

        {/* switch tab */}
        {/* <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
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
</div> */}

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
        searchResults.map((user) => (
          <div key={user._id} className="user-item" style={{ justifyContent: "space-between" }}>
            <div>
              <p>{user.fullName}</p>
              <p style={{ fontSize: 12, opacity: 0.6 }}>
                {user.zingleeId}
              </p>
            </div>

              <button
             disabled={sentRequests.includes(user._id)}
            onClick={() => sendRequest(user._id)}
           style={{
            background: sentRequests.includes(user._id) ? "gray" : "var(--accent)",
           border: "none",
           padding: "4px 10px",
            borderRadius: 6,
             cursor: "pointer",
           color: "white"
             }}
            >
         {sentRequests.includes(user._id) ? "Requested" : "Add"}
        </button>
          </div>
        ))
      )
    ) : (
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

        {/* 📩 REQUESTS TAB
        {activeTab === "requests" && (
          requests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 20 }}>
              No pending requests
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

                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => respondRequest(req._id, "accept")} style={{ background: "#22c55e" }}>✓</button>
                  <button onClick={() => respondRequest(req._id, "reject")} style={{ background: "#ef4444" }}>✕</button>
                </div>
              </div>
            ))
          )
        )} */}

        {/* 📩 REQUESTS TAB */}
{activeTab === "requests" && (
  requests.length === 0 ? (
    <div style={{ textAlign: 'center', padding: 20 }}>
      No pending requests
    </div>
  ) : (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {requests.map((req) => (
        <div
          key={req._id}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            padding: '12px 14px',
            borderRadius: 14,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* TOP: USER INFO */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src={req.sender.profilePic || assets.avatar_icon}
              alt=""
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--border-color)',
              }}
            />

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: 14,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {req.sender.fullName}
              </p>

              <p style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.5)'
              }}>
                {req.sender.zingleeId}
              </p>
            </div>
          </div>

          {/* BOTTOM: ACTIONS */}
          <div style={{
            display: 'flex',
            gap: 8,
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={() => respondRequest(req._id, "reject")}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.4)',
                color: '#f87171',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Decline
            </button>

            <button
              onClick={() => respondRequest(req._id, "accept")}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(34,197,94,0.3)'
              }}
            >
              Accept
            </button>
          </div>
        </div>
      ))}
    </div>
  )
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