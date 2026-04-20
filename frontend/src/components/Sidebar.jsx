import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { ZingleeeLogo } from '../pages/LandingPage'
import assets from '../assets/assets'

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext)
  const { logout, onlineUsers, authUser } = useContext(AuthContext)
  const { theme, setTheme, THEMES } = useTheme()
  const [searchInput, setSearchInput] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [showThemes, setShowThemes] = useState(false)
  const navigate = useNavigate()

  const filteredUsers = searchInput
    ? users.filter(u => u.fullName.toLowerCase().includes(searchInput.toLowerCase()))
    : users

  useEffect(() => { getUsers() }, [onlineUsers])

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        display: 'flex', flexDirection: 'column',
        height: '100%', overflow: 'hidden',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(0,0,0,0.15)',
      }}
    >
      {/* Header */}
      <div style={{ padding: '20px 16px 12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ filter: 'drop-shadow(0 0 10px var(--glow))' }}>
              <ZingleeeLogo size={34} />
            </div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em' }}>
              Zingle<span style={{ color: 'var(--accent)' }}>ee</span>
            </span>
          </div>

          {/* Menu */}
          <div style={{ position: 'relative' }}>
            <button className="icon-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ fontSize: 16 }}>
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
            onChange={e => setSearchInput(e.target.value)}
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

      {/* User List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 12px' }}>
        <AnimatePresence>
          {filteredUsers.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
              {searchInput ? 'No users found' : 'No conversations yet'}
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
                {/* Avatar with online indicator */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img
                    src={user?.profilePic || assets.avatar_icon}
                    alt=""
                    style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }}
                  />
                  {onlineUsers.includes(user._id) && (
                    <span style={{
                      position: 'absolute', bottom: 1, right: 1,
                      width: 10, height: 10, borderRadius: '50%',
                      background: '#4ade80', border: '2px solid rgba(0,0,0,0.5)',
                      boxShadow: '0 0 6px #4ade80',
                    }} />
                  )}
                </div>

                {/* Name & status */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 500, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.fullName}
                  </p>
                  <p style={{ fontSize: 12, color: onlineUsers.includes(user._id) ? '#4ade80' : 'rgba(255,255,255,0.35)' }}>
                    {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                  </p>
                </div>

                {/* Unseen badge */}
                {unseenMessages[user._id] > 0 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="unseen-badge">
                    {unseenMessages[user._id]}
                  </motion.div>
                )}
              </motion.div>
            ))
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