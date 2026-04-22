import React, { useContext } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Homepage from "./pages/Homepage"
import LoginPage from "./pages/LoginPage"
import ProfilePage from "./pages/ProfilePage"
import LandingPage from "./pages/LandingPage"
import InstructionsPage from "./pages/InstructionsPage"
import { Toaster } from "react-hot-toast"
import { AuthContext } from '../context/AuthContext'
import { ThemeProvider } from '../context/ThemeContext'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

const BgOrbs = () => (
  <div className="bg-orbs">
    <div className="orb orb-1" />
    <div className="orb orb-2" />
    <div className="orb orb-3" />
  </div>
)

const AppRoutes = () => {
  const { authUser } = useContext(AuthContext)
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div {...pageVariants} style={{ height: '100%' }}>
            {authUser ? <Homepage /> : <Navigate to="/welcome" />}
          </motion.div>
        } />
        <Route path="/login" element={
          <motion.div {...pageVariants} style={{ minHeight: '100vh' }}>
            {!authUser ? <LoginPage /> : <Navigate to="/" />}
          </motion.div>
        } />
        <Route path="/profile" element={
          <motion.div {...pageVariants} style={{ minHeight: '100vh' }}>
            {authUser ? <ProfilePage /> : <Navigate to="/login" />}
          </motion.div>
        } />
        <Route path="/welcome" element={
          <motion.div {...pageVariants} style={{ minHeight: '100vh' }}>
            <LandingPage />
          </motion.div>
        } />
        <Route path="/ins" element={
          <motion.div {...pageVariants} style={{ minHeight: '100vh' }}>
            <InstructionsPage />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  )
}

const App = () => {
  return (
    <ThemeProvider>
      <div className="noise" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <BgOrbs />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(20,20,40,0.9)',
                backdropFilter: 'blur(20px)',
                color: '#fff',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#4ade80', secondary: 'transparent' } },
              error:   { iconTheme: { primary: '#f87171', secondary: 'transparent' } },
            }}
          />
          <AppRoutes />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App