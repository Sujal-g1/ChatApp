import React, { useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'

const Homepage = () => {
  const { selectedUser } = useContext(ChatContext)

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [showRightSidebar, setShowRightSidebar] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      padding: 'clamp(0px, 2vw, 20px)',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          height: '100%',
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(40px)',
          borderRadius: 'clamp(0px, 2vw, 24px)',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
        }}
      >

        {isMobile ? (
          /* ─── MOBILE ─── */
          <>
            {/* Show sidebar or chat depending on selected user */}
            {!selectedUser ? (
              <div style={{ flex: 1, minWidth: 0 }}>
                <Sidebar />
              </div>
            ) : (
              <div style={{ flex: 1, minWidth: 0 }}>
                <ChatContainer setShowRightSidebar={setShowRightSidebar} />
              </div>
            )}

            {/* LEFT SIDEBAR OVERLAY */}
            <AnimatePresence>
              {showSidebar && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowSidebar(false)}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.5)',
                      zIndex: 40,
                    }}
                  />
                  <motion.div
                    initial={{ x: -300 }}
                    animate={{ x: 0 }}
                    exit={{ x: -300 }}
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: 280,
                      height: '100%',
                      zIndex: 50,
                      background: 'rgba(0,0,0,0.9)',
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    <Sidebar />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* RIGHT SIDEBAR OVERLAY */}
            <AnimatePresence>
              {showRightSidebar && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowRightSidebar(false)}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.5)',
                      zIndex: 40,
                    }}
                  />
                  <motion.div
                    initial={{ x: 300 }}
                    animate={{ x: 0 }}
                    exit={{ x: 300 }}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      width: '85%',
                      maxWidth: 320,
                      height: '100%',
                      zIndex: 50,
                      background: 'rgba(0,0,0,0.9)',
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    <RightSidebar setShowRightSidebar={setShowRightSidebar} />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </>
        ) : (
          /* ─── DESKTOP ─── */
          <>
            {/* Sidebar — always visible */}
            <div style={{ width: 320, flexShrink: 0 }}>
              <Sidebar />
            </div>

            {/* Chat area — fills remaining space */}
            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <ChatContainer setShowRightSidebar={setShowRightSidebar} />
            </div>

            {/* Right sidebar — only when a user is selected */}
            {/* {selectedUser && (
              <div style={{ width: 260, flexShrink: 0 }}>
                <RightSidebar />
              </div>
            )} */}
          </>
        )}

      </motion.div>
    </div>
  )
}

export default Homepage