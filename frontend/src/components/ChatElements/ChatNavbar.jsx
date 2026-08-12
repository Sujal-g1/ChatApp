import React, { useContext } from "react";
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
    
      const fireflies = Array.from({ length: 12 }, (_, i) => ({
        top: `${Math.random() * 100}%`,
        delay: Math.random() * 10,
        duration: 8 + Math.random() * 8,
      }));
    

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

  

 {/* --- ELEGANT HORIZONTAL FIREFLIES --- */}
 {fireflies.map((firefly, index) => (
  <motion.div
    key={index}
    animate={{
      x: ["-10vw", "110vw"],
      opacity: [0, 1, 1, 0],
    }}
    transition={{
      duration: firefly.duration,
      repeat: Infinity,
      delay: firefly.delay,
      ease: "linear",
    }}
    style={{
      position: "absolute",
      top: firefly.top,
      left: 0,
      width: 4,
      height: 4,
      borderRadius: "50%",
      background: "white",
      boxShadow: "0 0 10px rgba(255,255,255,0.8)",
      pointerEvents: "none",
      zIndex: 1,
    }}
  />
))}
  {/* --- END OF ANIMATION LAYER --- */}
    


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