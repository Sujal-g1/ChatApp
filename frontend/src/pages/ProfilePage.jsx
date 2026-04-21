import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AuthContext } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { ZingleeeLogo } from './LandingPage'
import assets from '../assets/assets'

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext)
  const { theme, setTheme, THEMES } = useTheme()
  const [selectedImg, setSelectedImg] = useState(null)
  const [name, setName] = useState(authUser?.fullName || "")
  const [bio, setBio]   = useState(authUser?.bio || "")
  const navigate = useNavigate()

  useEffect(() => {
  if (authUser) {
    setName(authUser.fullName || "");
    setBio(authUser.bio || "");
  }
}, [authUser]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedImg) {
      await updateProfile({ fullName: name, bio })
      navigate('/')
      return
    }
    const reader = new FileReader()
    reader.readAsDataURL(selectedImg)
    reader.onload = async () => {
      await updateProfile({ profilePic: reader.result, fullName: name, bio })
      navigate('/')
    }
  }
  if (!authUser) {
  return <div style={{ color: "white", padding: 50 }}>Loading...</div>;
}

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '24px',
    }}>

      
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: '100%', maxWidth: 700,
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 28,
          overflow: 'hidden',
          boxShadow: '0 40px 80px rgba(0,0,0,0.4), 0 0 60px var(--glow)',
          display: 'flex', flexWrap: 'wrap',
        }}
      >
        {/* Left: Form */}
        <div style={{ flex: '1 1 300px', padding: '40px 36px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
              cursor: 'pointer', fontSize: 13, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6,
            }}
          >← Back to chats</button>

          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 26, marginBottom: 6 }}>
            Your Profile
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 32 }}>
            Make it uniquely you
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Avatar upload */}
            <label htmlFor="avatar" style={{ cursor: 'pointer' }}>
              <input onChange={e => setSelectedImg(e.target.files[0])} type="file" id="avatar" accept=".png,.jpg,.jpeg" hidden />
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={selectedImg ? URL.createObjectURL(selectedImg) : (authUser?.profilePic || assets.avatar_icon)}
                    alt=""
                    style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }}
                  />
                  <div style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: 24, height: 24, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, border: '2px solid rgba(0,0,0,0.5)',
                  }}>📷</div>
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>Change Photo</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>PNG, JPG up to 5MB</p>
                </div>
              </div>
            </label>

            <div>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6, display: 'block' }}>Display Name</label>
              <input
                className="input-glass"
                type="text" placeholder="Your name"
                value={name} onChange={e => setName(e.target.value)} required
              />
            </div>

            <div>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6, display: 'block' }}>Bio</label>
              <textarea
                className="input-glass"
                rows={4} placeholder="Tell people about yourself..."
                value={bio} onChange={e => setBio(e.target.value)} required
                style={{ resize: 'none', borderRadius: 14 }}
              />
            </div>

            {/* Theme picker */}
            <div>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 10, display: 'block' }}>App Theme</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {THEMES.map(t => (
                  <button key={t.id} type="button"
                    onClick={() => setTheme(t.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '6px 12px', borderRadius: 50,
                      background: theme === t.id ? 'var(--glass-hover)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${theme === t.id ? t.color : 'rgba(255,255,255,0.08)'}`,
                      cursor: 'pointer', transition: 'all 0.2s ease',
                      boxShadow: theme === t.id ? `0 0 12px ${t.color}40` : 'none',
                    }}
                  >
                    <span style={{ width: 12, height: 12, borderRadius: '50%', background: t.color, display: 'inline-block' }} />
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <motion.button type="submit"
              className="btn-primary"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              style={{ width: '100%', fontSize: 15, padding: '13px 0', borderRadius: 50, marginTop: 4 }}
            >
              Save Changes ✓
            </motion.button>
          </form>
        </div>

        {/* Right: Preview */}
        <div style={{
          flex: '0 0 220px',
          background: 'rgba(255,255,255,0.02)',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: 32, gap: 16,
        }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Preview</p>
          
          <div style={{ position: 'relative' }}>
            {/* Spinning gradient ring */}
            <svg width={120} height={120} style={{ position: 'absolute', inset: -6, animation: 'spin-slow 8s linear infinite' }}>
              <defs>
                <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="var(--accent2)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <circle cx={60} cy={60} r={55} fill="none" stroke="url(#ring-grad)" strokeWidth={2} strokeDasharray="6 4" />
            </svg>
            <img
              src={selectedImg ? URL.createObjectURL(selectedImg) : (authUser?.profilePic || assets.avatar_icon)}
              alt=""
              style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--border-color)', display: 'block' }}
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontWeight: 600, fontSize: 16 }}>{name || 'Your Name'}</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 4, maxWidth: 160, lineHeight: 1.5 }}>
              {bio || 'Your bio will appear here'}
            </p>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)',
            borderRadius: 50, padding: '5px 12px', fontSize: 12, color: '#4ade80',
          }}>
            <span className="online-dot" style={{ width: 6, height: 6 }} />
            Online
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ProfilePage