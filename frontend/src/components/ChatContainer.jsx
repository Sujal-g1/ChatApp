import React, { useEffect, useRef, useContext, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import { formatMsgTime } from '../lib/utils'
import assets from '../assets/assets'
import toast from 'react-hot-toast'

const CallToast = ({ type }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    background: 'rgba(15,12,40,0.95)', border: '1px solid var(--border-color)',
    borderRadius: 14, padding: '12px 16px', color: 'white', fontSize: 14,
  }}>
    <span style={{ fontSize: 20 }}>{type === 'audio' ? '📞' : '🎥'}</span>
    <span>{type === 'audio' ? 'Audio' : 'Video'} calls — coming soon!</span>
  </div>
)

const ChatContainer = () => {
  const { authUser, onlineUsers } = useContext(AuthContext)
  const { selectedUser, setSelectedUser, getMessages, messages, sendMessage } = useContext(ChatContext)
  const scrollEnd = useRef()
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const typingTimer = useRef()

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (input.trim() === '') return
    await sendMessage({ text: input.trim() })
    setInput('')
  }

  const handleSendImage = async (e) => {
    const file = e.target.files[0]
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Select an image file')
      return
    }
    const reader = new FileReader()
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result })
      e.target.value = ''
    }
    reader.readAsDataURL(file)
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
    setIsTyping(true)
    clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => setIsTyping(false), 1000)
  }

  const handleCall = (type) => {
    toast.custom(() => <CallToast type={type} />, { duration: 3000 })
  }

  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id)
  }, [selectedUser])

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  if (!selectedUser) {
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          height: '100%', gap: 16,
          background: 'rgba(0,0,0,0.05)',
        }}
        className="max-md:hidden"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 80, height: 80, borderRadius: '24px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, boxShadow: '0 20px 40px var(--glow)',
          }}
        >
            <img src={assets.logo} alt="logo" style={{ width: 40 }} />
        
        </motion.div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
            {/* Chat Anytime, Anywhere */}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
            Select a conversation to start messaging
          </p>
        </div>
        {/* floating dots */}
        {[...Array(5)].map((_, i) => (
          <motion.div key={i}
            style={{
              position: 'absolute',
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--accent)', opacity: 0.3,
              left: `${20 + i * 15}%`, top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{ y: [0, -12, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}
    >
      {/* Chat Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(0,0,0,0.2)',
        backdropFilter: 'blur(20px)',
        flexShrink: 0,
      }}>
        {/* Back (mobile) */}
        <button className="icon-btn" onClick={() => setSelectedUser(null)}
          style={{ display: 'none' }} /* show on mobile via media query — className="md:hidden" */>
          ←
        </button>

        {/* Avatar */}
        <div style={{ position: 'relative' }}>
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt=""
            style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }}
          />
          {onlineUsers.includes(selectedUser._id) && (
            <span className="online-dot" style={{
              position: 'absolute', bottom: 1, right: 1,
              border: '2px solid rgba(0,0,0,0.5)',
            }} />
          )}
        </div>

        {/* Name + status */}
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 600, fontSize: 15 }}>{selectedUser.fullName}</p>
          <p style={{ fontSize: 12, color: onlineUsers.includes(selectedUser._id) ? '#4ade80' : 'rgba(255,255,255,0.4)' }}>
            {onlineUsers.includes(selectedUser._id) ? '● Online' : '○ Offline'}
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="call-btn call-btn-audio" onClick={() => handleCall('audio')} title="Audio Call">
            📞
          </button>
          <button className="call-btn call-btn-video" onClick={() => handleCall('video')} title="Video Call">
            🎥
          </button>
          <button className="icon-btn" title="Search in chat" style={{ fontSize: 14 }}>🔍</button>
          <button className="icon-btn" title="More options" style={{ fontSize: 16 }}>⋮</button>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '16px 16px 8px',
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => {
            const isMine = msg.senderId === authUser?._id
            return (
              <motion.div
                key={msg._id || idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  display: 'flex',
                  justifyContent: isMine ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-end', gap: 8, marginBottom: 6,
                }}
              >
                {!isMine && (
                  <img
                    src={selectedUser?.profilePic || assets.avatar_icon}
                    alt=""
                    style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, marginBottom: 16 }}
                  />
                )}

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                  {msg.image ? (
                    <img
                      src={msg.image} alt=""
                      onClick={() => window.open(msg.image)}
                      style={{
                        maxWidth: 240, borderRadius: 16,
                        border: '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer', marginBottom: 4,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      }}
                    />
                  ) : (
                    <div className={isMine ? 'bubble-sent' : 'bubble-received'}>
                      {msg.text}
                    </div>
                  )}
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 3, paddingX: 4 }}>
                    {formatMsgTime(msg.createdAt)}
                    {isMine && (
                      <span style={{ marginLeft: 4, color: msg.seen ? 'var(--accent)' : 'rgba(255,255,255,0.3)' }}>
                        {msg.seen ? '✓✓' : '✓'}
                      </span>
                    )}
                  </p>
                </div>

                {isMine && (
                  <img
                    src={authUser?.profilePic || assets.avatar_icon}
                    alt=""
                    style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, marginBottom: 16 }}
                  />
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {false && ( // replace with real typing state from socket
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src={selectedUser?.profilePic || assets.avatar_icon} alt=""
                style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
              <div className="bubble-received" style={{ padding: '10px 14px' }}>
                <div className="typing-dots"><span /><span /><span /></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={scrollEnd} />
      </div>

      {/* Send Bar */}
      <div className="send-bar">
        {/* Emoji (future) */}
        <button className="icon-btn" title="Emoji" style={{ fontSize: 18, flexShrink: 0 }}>😊</button>

        {/* Input */}
        <div className="send-input-wrap">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendMessage(e)}
          />

          {/* Image upload */}
          <input onChange={handleSendImage} type="file" id="chat-image" accept="image/png,image/jpeg" hidden />
          <label htmlFor="chat-image" style={{ cursor: 'pointer', opacity: 0.6, fontSize: 18, display: 'flex', alignItems: 'center' }}
            title="Send image">
            🖼️
          </label>
        </div>

        {/* Voice note (future) */}
        <button className="icon-btn" title="Voice message (coming soon)" style={{ fontSize: 16 }}>🎙️</button>

        {/* Send */}
        <motion.button
          className="send-btn"
          onClick={handleSendMessage}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.92 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  )
}

export default ChatContainer