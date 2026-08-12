import  { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatContext } from "../../../context/ChatContext";
import { AuthContext } from "../../../context/AuthContext";
import assets from "../../assets/assets";
import { formatMsgTime } from '../../lib/utils'
import { Pause, Mic } from "lucide-react";

const ChatMessages = ({
    scrollEnd,
    playingId,
    setPlayingId,
}) => {


    const { selectedUser, messages } = useContext(ChatContext)
    const { authUser } = useContext(AuthContext)

    const iconBtn = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "white",
    cursor: "pointer",
    };

  return (

        <div style={{
        flex: 1, overflowY: 'auto', padding: '16px 16px 8px',
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>

         {/* text messges, audio and sent ticks */}
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => {
            const senderId = msg.senderId?._id || msg.senderId;
            
            const isMine = senderId === authUser?._id;

        // text messages ----------
            return (
              <motion.div
                key={msg._id || idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  display: 'flex',
                  justifyContent: isMine ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-end', gap: 8, marginBottom: 6,
                }}
              >
                {!isMine && (
                  <img
                    src={selectedUser?.profilePic || assets.avatar_icon}
                    alt=""
                    style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, marginBottom: 16 }}
                  />
                )}

         <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                  {msg.image ? (
                    <img
                      src={msg.image} alt=""
                      onClick={() => window.open(msg.image)}
                      style={{
                        maxWidth: 240, borderRadius: 16,
                        border: '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer', marginBottom: 4,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      }}
                    />

        // audio messages ----------
        ) : msg.audio ? (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 14px',
      borderRadius: 16,
      background: isMine
        ? 'linear-gradient(135deg, var(--accent), var(--accent2))'
        : 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      maxWidth: '100%'
    }}
  >
    {/* Play Button */}
<audio id={`audio-${msg._id}`}
  src={msg.audio}
  onEnded={() => setPlayingId(null)}
/>

<button
  onClick={() => {
    const audio = document.getElementById(`audio-${msg._id}`)
    if (!audio) return

    if (playingId === msg._id) {
      audio.pause()
      setPlayingId(null)
    } else {
      audio.play()
      setPlayingId(msg._id)
    }
  }}
  style={iconBtn}
>
  {playingId === msg._id ? <Pause size={14} /> : <Mic size={14} />}
</button>

    {/* Fake Waveform */}
    <div style={{ display: 'flex', gap: 2 }}>
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          style={{
            width: 2,
            height: `${8 + Math.random() * 12}px`,
            background: isMine ? 'white' : 'rgba(255,255,255,0.6)',
            borderRadius: 2,
          }}
        />
      ))}
    </div>

    {/* Time */}
    <span style={{ fontSize: 11, opacity: 0.7 }}>
      {formatMsgTime(msg.createdAt)}
    </span>
  </div>
)
// audio messages ends ----

// message tick
      : (
      <div className={isMine ? 'bubble-sent' : 'bubble-received'}>
          {msg.text}
        </div>
        )}


    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 3, paddingX: 4 }}>
        {formatMsgTime(msg.createdAt)}
                    {isMine && (
                      <span style={{ marginLeft: 4, color: msg.seen ? 'var(--accent)' : 'rgba(255,255,255,0.3)' }}>
                        {msg.seen ? '✓✓' : '✓'}
                      </span>
                    )}
       </p>
  </div>

                {isMine && (
                  <img
                    src={authUser?.profilePic || assets.avatar_icon}
                    alt=""
                    style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, marginBottom: 16 }}
                  />
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {false && ( // replace with real typing state from socket
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src={selectedUser?.profilePic || assets.avatar_icon} alt=""
                style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
              <div className="bubble-received" style={{ padding: '10px 14px' }}>
                <div className="typing-dots"><span /><span /><span /></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={scrollEnd} />

      </div>

  )
}

export default ChatMessages


