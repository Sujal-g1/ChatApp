
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDownFromLine,ArrowLeft, ArrowUpFromLine, Images, Mic, Pause, Phone, Search, Video,Forward, MoreVertical, Camera, CameraOff, MicOff, PhoneOff, RefreshCw} from 'lucide-react'; 
import RightSidebar from '../RightSidebar'

const VideoCallOverlay = ({

  showRightSidebar,
  setShowRightSidebar,
  incomingCall,
  showVideoCall,
  localVideoRef,
  remoteVideoRef,
  selectedUser,
  callStatus,
  isMuted,
  isCameraOff,
  assets,
  acceptCall,
  rejectCall,
  endCall,
  toggleMute,
  toggleCamera,
  switchCamera,
}) => {

   
 

  return (
    <div>

     <AnimatePresence>
  {showRightSidebar && (
    <>
      {/* 1. The Backdrop (Tap anywhere here to close) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowRightSidebar(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 40,
        }}
      />

      {/* 2. The Right Sidebar "Flap" Container */}
<motion.div
  initial={{ x: '100%' }}
  animate={{ x: 0 }}
  exit={{ x: '100%' }}
  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
  style={{
    position: 'fixed',
    top: 0,
    right: 0,
    height: '100%',
    width: '85%',
    maxWidth: '380px',
    // 1. Lower the opacity significantly (0.4 - 0.6)
    // 2. Add backdropFilter for the "frosted" look
    background: 'rgba(255, 255, 255, 0.03)', 
    backdropFilter: 'blur(25px) saturate(180%)', 
    WebkitBackdropFilter: 'blur(25px) saturate(180%)', // For Safari support
    zIndex: 50,
    boxShadow: '-10px 0 30px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '1px solid rgba(255,255,255,0.1)',
  }}
>
  <RightSidebar onClose={() => setShowRightSidebar(false)} />
</motion.div>
    </>
  )}
</AnimatePresence>
      
      {/* vc  ----------------------------- before accepting call*/}
  <AnimatePresence>
  {incomingCall && (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 360,
          padding: 30,
          borderRadius: 24,
          background: "rgba(20,20,40,0.96)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          textAlign: "center",
          color: "white",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)"
        }}
      >
        <img
          src={
            incomingCall?.callerInfo?.profilePic ||
            assets.avatar_icon
          }
          alt="caller"
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: 16,
            border: "2px solid rgba(255,255,255,0.08)"
          }}
        />
    <h2
      style={{
        fontSize: 22,
        fontWeight: 700,
        marginBottom: 8
      }}
    >
      {incomingCall?.callerInfo?.name || "Incoming Call"}
    </h2>

    <p
      style={{
        opacity: 0.7,
        marginBottom: 24,
        fontSize: 14
      }}
    >
      is calling you...
    </p>

    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 16
      }}
    >
      <button
        onClick={acceptCall}
        style={{
          padding: "12px 20px",
          borderRadius: 999,
          border: "none",
          cursor: "pointer",
          fontWeight: 600
        }}
      >
        Accept
      </button>

      <button
        onClick={rejectCall}
        style={{
          padding: "12px 20px",
          borderRadius: 999,
          border: "none",
          cursor: "pointer",
          fontWeight: 600
        }}
      >
        Reject
      </button>
    </div>
  </div>
</motion.div>
)} </AnimatePresence>

{/* full screen vc after accepting call */}
  <AnimatePresence>
  {showVideoCall && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        zIndex: 10000,
        overflow: "hidden"
      }}
    >
      {/* Remote Video Full Screen */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }}
      />

  {/* Top Gradient Header */}
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      padding: "24px 20px",
      background:
        "linear-gradient(to bottom, rgba(0,0,0,0.65), transparent)",
      zIndex: 5
    }}
  >
    <h2
      style={{
        color: "white",
        fontSize: 22,
        fontWeight: 700,
        marginBottom: 4
      }}
    >
      {selectedUser?.fullName || "Video Call"}
    </h2>

    <p
      style={{
        color: "rgba(255,255,255,0.75)",
        fontSize: 14
      }}
    >
      {callStatus}
    </p>
  </div>

  {/* Local Video Floating Card */}
  <video
    ref={localVideoRef}
    autoPlay
    muted
    playsInline
    style={{
      position: "absolute",
      top: 90,
      right: 20,
      width: 220,
      height: 160,
      borderRadius: 22,
      objectFit: "cover",
      border: "2px solid rgba(255,255,255,0.18)",
      background: "#111",
      boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
      zIndex: 6
    }}
  />



{/* Bottom Controls in vc */}
<div
  style={{
    position: "absolute",
    bottom: 40,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    gap: 16,
    zIndex: 7,

    padding: "12px 18px",
    borderRadius: 999,

    background: "rgba(0,0,0,0.25)",
    backdropFilter: "blur(20px)",
    border: "1px solid var(--border-color)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)"

}}

>
{/* toggle camera */}
<motion.button
whileHover={{ scale: 1.08 }}
whileTap={{ scale: 0.94 }}
onClick={toggleCamera}
style={{
width: 58,
height: 58,
borderRadius: "50%",
border: "1px solid var(--border-color)",
background: "var(--glass)",
color: "white",
cursor: "pointer",
display: "flex",
alignItems: "center",
justifyContent: "center"
}}

>
<RefreshCw />
</motion.button>


{/* Mute Button */}
<motion.button
whileHover={{ scale: 1.08, y: -2 }}
whileTap={{ scale: 0.94 }}
onClick={toggleMute}
style={{
width: 58,
height: 58,
borderRadius: "50%",
border: "1px solid var(--border-color)",

  background: isMuted
    ? "rgba(239,68,68,0.15)"
    : "var(--glass)",

  color: "white",
  cursor: "pointer",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  backdropFilter: "blur(16px)",
  boxShadow: isMuted
    ? "0 0 20px rgba(239,68,68,0.2)"
    : "0 0 15px var(--glow)",

  transition: "all 0.25s ease"
}}

>
{isMuted ? <MicOff size={22} /> : <Mic size={22} />}

</motion.button>

{/* Camera Button */}
<motion.button
whileHover={{ scale: 1.08, y: -2 }}
whileTap={{ scale: 0.94 }}
onClick={switchCamera}
style={{
width: 58,
height: 58,
borderRadius: "50%",
border: "1px solid var(--border-color)",
  background: isCameraOff
    ? "rgba(239,68,68,0.15)"
    : "var(--glass)",

  color: "white",
  cursor: "pointer",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  backdropFilter: "blur(16px)",
  boxShadow: isCameraOff
    ? "0 0 20px rgba(239,68,68,0.2)"
    : "0 0 15px var(--glow)",

  transition: "all 0.25s ease"
}}

>
{isCameraOff ? <CameraOff size={22} /> : <Camera size={22} />}

</motion.button>

{/* End Call Button */}
<motion.button
whileHover={{ scale: 1.1, y: -2 }}
whileTap={{ scale: 0.92 }}
onClick={endCall}
style={{
width: 70,
height: 70,
borderRadius: "50%",
border: "none",

  background:
    "linear-gradient(135deg, #ef4444, #dc2626)",

  color: "white",
  cursor: "pointer",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  boxShadow:
    "0 10px 30px rgba(239,68,68,0.35)",

  transition: "all 0.25s ease"
}}

>
<PhoneOff size={24} />
</motion.button>

</div>

</motion.div>

)} </AnimatePresence>

    
    </div>
  )
}

export default VideoCallOverlay



