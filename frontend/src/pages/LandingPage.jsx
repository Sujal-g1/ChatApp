import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export const ZingleeeLogo = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lg-zingle" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="var(--accent)" />
        <stop offset="100%" stopColor="var(--accent2)" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="18" fill="url(#lg-zingle)" />
    <path
      d="M18 20h28L26 44h20"
      stroke="white"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle cx="46" cy="44" r="4" fill="white" opacity="0.9" />
  </svg>
)

const LandingPage = () => {
  const navigate = useNavigate()
  const [phase, setPhase] = useState('logo')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('name'),    600)
    const t2 = setTimeout(() => setPhase('tagline'), 1300)
    const t3 = setTimeout(() => setPhase('done'),    2400)
    const t4 = setTimeout(() => navigate('/login'),  3000)
    return () => [t1, t2, t3, t4].forEach(clearTimeout)
  }, [navigate])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
    }}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ filter: 'drop-shadow(0 0 30px var(--glow))' }}
      >
        <ZingleeeLogo size={80} />
      </motion.div>

      <AnimatePresence>
        {phase !== 'logo' && (
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(36px, 8vw, 56px)',
              letterSpacing: '-0.03em',
              color: 'white',
              margin: 0,
            }}
          >
            Zingle<span style={{ color: 'var(--accent)' }}>ee</span>
          </motion.h1>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(phase === 'tagline' || phase === 'done') && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', margin: 0, letterSpacing: '0.02em' }}
          >
          Meet. Match. Message.
          </motion.p>
        )}
      </AnimatePresence>

      <div style={{ marginTop: 12, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          {phase !== 'done' ? (
            <motion.div key="bar"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ width: 120, height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.2, ease: 'easeInOut' }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
                  borderRadius: 99,
                  boxShadow: '0 0 8px var(--glow)',
                }}
              />
            </motion.div>
          ) : (
            <motion.div key="check"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px var(--glow)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default LandingPage