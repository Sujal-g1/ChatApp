import React, { useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import assets from '../assets/assets'
import { Mic, Phone, Video, BellOff, Ban,Images,UserRound } from 'lucide-react'; 


const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext)
  const { logout, onlineUsers } = useContext(AuthContext)
  const [msgImages, setMsgImages] = useState([])
  const [activeTab, setActiveTab] = useState('info')


  useEffect(() => {
    setMsgImages(messages.filter(m => m.image).map(m => m.image))
  }, [messages])

  if (!selectedUser) return null

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
      exit={{ x: 20, opacity: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        display: 'flex', flexDirection: 'column',
        height: '100%', overflow: 'hidden',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(0,0,0,0.15)',
      }}
    >
      {/* Profile section */}
      <div style={{
        padding: '32px 20px 20px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 14 }}>
          {/* spinning gradient ring */}
          <svg width={100} height={100}
            style={{ position: 'absolute', top: -8, left: -8, animation: 'spin-slow 8s linear infinite' }}>
            <defs>
              <linearGradient id="rs-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.9" />
                <stop offset="50%" stopColor="var(--accent2)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <circle cx={50} cy={50} r={46} fill="none" stroke="url(#rs-ring)" strokeWidth="2" strokeDasharray="6 4" />
          </svg>

          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt=""
            style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)', display: 'block' }}
          />

          {/* Online dot */}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="online-dot" style={{
              position: 'absolute', bottom: 4, right: 4,
              border: '2px solid rgba(0,0,0,0.5)', width: 12, height: 12,
            }} />
          )}
        </div>

       <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>
  {selectedUser.fullName}
</h3>


{/* Zinglee ID */}
<p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>
  {selectedUser.zingleeId}
</p>

{/* Bio */}
{/* <p style={{
  fontSize: 12,
  color: 'rgba(255,255,255,0.45)',
  lineHeight: 1.5,
  maxWidth: 200,
  margin: '0 auto 12px'
}}>
  {selectedUser.bio || 'No bio yet'}
</p> */}

        {/* <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: onlineUsers.includes(selectedUser._id) ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${onlineUsers.includes(selectedUser._id) ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 50, padding: '4px 12px', fontSize: 12,
          color: onlineUsers.includes(selectedUser._id) ? '#4ade80' : 'rgba(255,255,255,0.4)',
        }}>
          {onlineUsers.includes(selectedUser._id) ? '● Online' : '○ Offline'}
        </div> */}

        {/* Quick actions */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16 }}>
          {[
            { icon: <Phone />, label: 'Call', color: 'rgba(74,222,128,0.15)', border: 'rgba(74,222,128,0.3)', text: '#4ade80' },
            { icon: <Video />, label: 'Video', color: 'rgba(56,189,248,0.15)', border: 'rgba(56,189,248,0.3)', text: '#38bdf8' },
            { icon: <BellOff />, label: 'Mute', color: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.1)', text: 'rgba(255,255,255,0.6)' },
            { icon: <Ban />, label: 'Block', color: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)', text: '#f87171' },
          ].map((btn, i) => (
            <button key={i}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                background: btn.color, border: `1px solid ${btn.border}`,
                borderRadius: 12, padding: '8px 10px', cursor: 'pointer',
                color: btn.text, fontSize: 18, transition: 'all 0.2s ease', minWidth: 44,
              }}
              title={btn.label}
            >
              {btn.icon}
              <span style={{ fontSize: 9, opacity: 0.8 }}>{btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0, padding: '0 8px',
      }}>
        {['info', 'media', 'files'].map(tab => (
          <button key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1, padding: '11px 0', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: 12, fontFamily: 'Outfit, sans-serif',
              color: activeTab === tab ? 'var(--accent)' : 'rgba(255,255,255,0.4)',
              borderBottom: `2px solid ${activeTab === tab ? 'var(--accent)' : 'transparent'}`,
              textTransform: 'capitalize', fontWeight: activeTab === tab ? 600 : 400,
              transition: 'all 0.2s ease',
            }}
          >
            {tab === 'info' ? 'Info' : tab === 'media' ? 'Media' : 'Files'}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'info' && (
            <motion.div key="info"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              {[
                { label: 'Full Name', value: selectedUser.fullName, icon: <UserRound />},
                { label: 'Status', value: onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline', icon: '🟢' },
                { label: 'Shared Media', value: `${msgImages.length} files`, icon: <Images /> },
              ].map((item, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12, padding: '12px 14px',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>{item.label}</p>
                    <p style={{ fontSize: 13, fontWeight: 500 }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'media' && (
            <motion.div key="media"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            >
              {msgImages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}><Images /></div>
                  No shared media yet
                </div>
              ) : (
                <div className="media-grid">
                  {msgImages.map((url, i) => (
                    <motion.div key={i} className="media-item"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => window.open(url)}
                    >
                      <img src={url} alt="" />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'files' && (
            <motion.div key="files"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
              File sharing coming soon
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Logout */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <motion.button
          className="btn-primary"
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={logout}
          style={{
            width: '100%', fontSize: 14, padding: '11px 0',
            background: 'linear-gradient(135deg, rgba(248,113,113,0.7), rgba(239,68,68,0.9))',
            boxShadow: '0 4px 15px rgba(239,68,68,0.3)',
          }}
        >
           Logout
        </motion.button>
      </div>
    </motion.div>
  )
}

export default RightSidebar