import React, { useContext, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, FileText, ArrowRight, ArrowLeft } from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { ZingleeeLogo } from './LandingPage'

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("Sign up")
  const [fullName, setFullName]         = useState("")
  const [email, setEmail]               = useState("")
  const [password, setPassword]         = useState("")
  const [bio, setBio]                   = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)
  const [showPwd, setShowPwd]           = useState(false)

  const { login } = useContext(AuthContext)
  const { theme, setTheme, THEMES } = useTheme()

  const onSubmitHandler = (e) => {
    e.preventDefault()
    if (currentState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return
    }
    login(currentState === "Sign up" ? "signup" : "login", { fullName, email, password, bio })
  }

  const switchState = (state) => {
    setCurrentState(state)
    setIsDataSubmitted(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        style={{ width: '100%', maxWidth: 420 }}
      >
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 28,
          padding: '36px 32px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.45), 0 0 0 1px var(--border-color)',
        }}>

          {/* ── Logo + brand ── */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
            <motion.div
              whileHover={{ scale: 1.06, rotate: 4 }}
              transition={{ type: 'spring', stiffness: 300 }}
              style={{ marginBottom: 14, filter: 'drop-shadow(0 0 20px var(--glow))' }}
            >
              <ZingleeeLogo size={60} />
            </motion.div>

            <h1 style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: 26, letterSpacing: '-0.02em', color: 'white', margin: 0,
            }}>
              Zingle<span style={{ color: 'var(--accent)' }}>ee</span>
            </h1>

            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', marginTop: 6 }}>
              {currentState === "Sign up" ? "Create your account" : "Welcome back"}
            </p>
          </div>

          {/* ── Tab switcher ── */}
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 50, padding: 4, marginBottom: 28,
          }}>
            {["Sign up", "Login"].map(tab => (
              <button key={tab}
                onClick={() => switchState(tab)}
                style={{
                  flex: 1, padding: '9px 0', borderRadius: 50, border: 'none',
                  cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                  fontSize: 14, fontWeight: 600,
                  transition: 'all 0.25s ease',
                  background: currentState === tab
                    ? 'linear-gradient(135deg, var(--accent), var(--accent2))'
                    : 'transparent',
                  color: currentState === tab ? 'white' : 'rgba(255,255,255,0.45)',
                  boxShadow: currentState === tab ? '0 4px 15px var(--glow)' : 'none',
                }}
              >{tab}</button>
            ))}
          </div>

          {/* ── Form ── */}
          <form onSubmit={onSubmitHandler}>
            <AnimatePresence mode="wait">
              {!isDataSubmitted ? (
                <motion.div key="step1"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.25 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
                >
                  {currentState === "Sign up" && (
                    <div style={{ position: 'relative' }}>
                      <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                      <input className="input-glass" type="text" placeholder="Full name"
                        value={fullName} onChange={e => setFullName(e.target.value)}
                        required style={{ paddingLeft: 42 }} />
                    </div>
                  )}

                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                    <input className="input-glass" type="email" placeholder="Email address"
                      value={email} onChange={e => setEmail(e.target.value)}
                      required style={{ paddingLeft: 42 }} />
                  </div>

                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                    <input className="input-glass"
                      type={showPwd ? "text" : "password"}
                      placeholder="Password"
                      value={password} onChange={e => setPassword(e.target.value)}
                      required style={{ paddingLeft: 42, paddingRight: 42 }} />
                    <button type="button" onClick={() => setShowPwd(!showPwd)}
                      style={{
                        position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'rgba(255,255,255,0.35)', fontSize: 13, padding: 0,
                      }}>
                      {showPwd ? 'hide' : 'show'}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="step2"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
                >
                  <button type="button" onClick={() => setIsDataSubmitted(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--accent)', fontSize: 13, padding: 0,
                    }}>
                    <ArrowLeft size={14} /> Back
                  </button>
                  <div style={{ position: 'relative' }}>
                    <FileText size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'rgba(255,255,255,0.3)' }} />
                    <textarea className="input-glass" rows={4}
                      placeholder="Tell us a bit about yourself..."
                      value={bio} onChange={e => setBio(e.target.value)}
                      required style={{ paddingLeft: 42, resize: 'none', borderRadius: 14 }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* terms */}
            {!isDataSubmitted && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
                <input type="checkbox" required style={{ accentColor: 'var(--accent)', width: 14, height: 14, flexShrink: 0 }} />
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>
                  I agree to the <span style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'underline', cursor: 'pointer' }}>Terms</span> and <span style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>
                </label>
              </div>
            )}

            <motion.button type="submit"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              style={{
                width: '100%', marginTop: 20,
                padding: '13px 0', borderRadius: 50, border: 'none',
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                color: 'white', fontFamily: 'Outfit, sans-serif',
                fontSize: 15, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 6px 24px var(--glow)',
              }}
            >
              {currentState === "Sign up"
                ? (isDataSubmitted ? "Create Account" : "Continue")
                : "Sign In"}
              <ArrowRight size={16} />
            </motion.button>
          </form>

          {/* divider */}
          <div className="divider" style={{ margin: '22px 0' }}>or</div>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            {currentState === "Sign up" ? (
              <>Already have an account?{' '}
                <span onClick={() => switchState("Login")}
                  style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>
                  Sign In
                </span></>
            ) : (
              <>New to Zingleee?{' '}
                <span onClick={() => switchState("Sign up")}
                  style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>
                  Create Account
                </span></>
            )}
          </p>
        </div>

        {/* Theme picker */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 20 }}
        >
          {THEMES.map(t => (
            <button key={t.id}
              className={`theme-dot ${theme === t.id ? 'active' : ''}`}
              style={{ background: t.color }}
              onClick={() => setTheme(t.id)}
              title={t.label}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LoginPage