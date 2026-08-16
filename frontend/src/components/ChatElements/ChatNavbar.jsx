import React, { useContext, useMemo } from "react";
import { motion, AnimatePresence } from 'framer-motion'
import { ChatContext } from "../../../context/ChatContext";
import { AuthContext } from "../../../context/AuthContext";
import assets from "../../assets/assets";
import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react";


const ChatNavbar = ({
  setShowRightSidebar,
  handleCall
}) => {

    const { onlineUsers } = useContext(AuthContext);
    const { selectedUser, setSelectedUser } = useContext(ChatContext)

    const particles = useMemo(
        () =>
          Array.from({ length: 90 }, () => ({
            left: Math.random() * 100,
            delay: Math.random() * 12,
            duration: 20 + Math.random() * 15,
            size: 0.5 + Math.random() * 2.5,
            opacity: 0.01 + Math.random() * 0.5,
          })),
        []
      );
    
    

  return (
     <div style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 16px",
        flexShrink: 0,
        overflow: "hidden",
      }}>

         {/* BACKGROUND FALLING PARTICLES LAYER */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            initial={{
              top: "-5%",
              opacity: 0,
            }}
            animate={{
              top: "105%",
              opacity: [0, particle.opacity, particle.opacity, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              left: `${particle.left}%`,
              width: particle.size,
              height: particle.size,
              borderRadius: "50%",
              background:
                i % 4 === 0 ? "var(--accent)" : "rgba(255,255,255,.8)",
              boxShadow:
                i % 4 === 0
                  ? "0 0 12px var(--glow)"
                  : "0 0 8px rgba(255,255,255,.5)",
              pointerEvents: "none",
            }}
          />
        ))}
      </div>

    


  {/* ---- 1. Back Button ---- */}
  <button 
    className="icon-btn md:hidden"
    onClick={() => setSelectedUser(null)}
    style={{ 
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      color: 'white', cursor: 'pointer', zIndex: 10,                 
      width: '36px', height: '36px', padding: 0, flexShrink: 0
    }}
  >
    <ArrowLeft size={22} />
  </button>

  {/* ---- 2. Avatar Container ---- */}
  <div style={{ position: 'relative', flexShrink: 0, zIndex: 10 }}> 
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

  {/* ---- 3. Name + Status ---- */}
  <div style={{ flex: 1, minWidth: 0, zIndex: 10 }}>
    <p style={{ 
      fontWeight: 600, fontSize: 15,
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
    }}>
      {selectedUser.fullName}
    </p>
    <p style={{ 
      fontSize: 12, 
      color: onlineUsers.includes(selectedUser._id) ? '#4ade80' : 'rgba(255,255,255,0.4)',
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
    }}>
      {onlineUsers.includes(selectedUser._id) ? '● Online' : '○ Offline'}
    </p>
  </div>

  {/* ---- 4. Action buttons ---- */}
  <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center', zIndex: 10 }}> 
    <button className="icon-btn" onClick={() => handleCall('audio')} title="Audio Call">
      <Phone size={20} />
    </button>

    <button className="icon-btn" onClick={() => handleCall('video')} title="Video Call">
      <Video size={20} />
    </button>

    <button
      className="icon-btn"
      onClick={(e) => {
        e.stopPropagation();
        setShowRightSidebar(true);
      }}
      title="More options"
    > 
      <MoreVertical size={20} /> 
    </button>
  </div>
</div> 
  )
}

export default ChatNavbar