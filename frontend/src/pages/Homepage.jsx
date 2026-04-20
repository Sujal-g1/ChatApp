import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'

const Homepage = () => {
  const { selectedUser } = useContext(ChatContext)

  return (
    <div style={{
      width: '100%', height: '100vh',
      display: 'flex', alignItems: 'stretch',
      padding: 'clamp(0px, 2vw, 20px)',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        style={{
          flex: 1,
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 'clamp(0px, 2vw, 24px)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: selectedUser
            ? 'clamp(220px, 25vw, 300px) 1fr clamp(200px, 22vw, 280px)'
            : 'clamp(220px, 28vw, 320px) 1fr',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 60px var(--glow)',
        }}
      >
        <Sidebar />
        <ChatContainer />
        {selectedUser && <RightSidebar />}
      </motion.div>
    </div>
  )
}

export default Homepage