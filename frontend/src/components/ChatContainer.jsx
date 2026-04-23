import React, { useEffect, useRef, useContext, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import RightSidebar from '../components/RightSidebar'
import { formatMsgTime } from '../lib/utils'
import assets from '../assets/assets'
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom"
import { ArrowDownFromLine,ArrowLeft, ArrowUpFromLine, CookingPot, Images, Mic, Pause, Phone, Search, Video,Forward, MoreVertical} from 'lucide-react'; 

const CallToast = ({ type }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    background: 'rgba(15,12,40,0.95)', border: '1px solid var(--border-color)',
    borderRadius: 14, padding: '12px 16px', color: 'white', fontSize: 14,
  }}>
    <span style={{ fontSize: 20 }}>{type === 'audio' ? '📞' : '🎥'}</span>
    <span>{type === 'audio' ? 'Audio' : 'Video'} calls — coming soon!</span>
  </div>
)

const ChatContainer = () => {
  const { authUser, onlineUsers } = useContext(AuthContext)
  const { selectedUser, setSelectedUser, getMessages, messages, sendMessage } = useContext(ChatContext)
  const scrollEnd = useRef()
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [recordTime, setRecordTime] = useState(0)
  const [playingId, setPlayingId] = useState(null)
  const [showRightSidebar, setShowRightSidebar] = useState(false)
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
  const currentAudioRef = useRef(null)

const mediaRecorderRef = useRef(null)
const chunksRef = useRef([])
const streamRef = useRef(null)
const typingTimer = useRef()

  const navigate = useNavigate()

  const iconBtn = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  borderRadius: '50%',
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: 'white',
  cursor: 'pointer',
}

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (input.trim() === '') return
    await sendMessage({ text: input.trim() })
    setInput('')
  }

  const handleSendImage = async (e) => {
    const file = e.target.files[0]
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Select an image file')
      return
    }
    const reader = new FileReader()
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result })
      e.target.value = ''
    }
    reader.readAsDataURL(file)
  }

  // recording
const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  streamRef.current = stream

  const mediaRecorder = new MediaRecorder(stream)
  mediaRecorderRef.current = mediaRecorder

  mediaRecorder.ondataavailable = (e) => {
    chunksRef.current.push(e.data)
  }

  mediaRecorder.onstop = () => {
    const blob = new Blob(chunksRef.current, { type: "audio/webm" })
    setRecordTime(0)
    setAudioBlob(blob)
    chunksRef.current = []
  }
  mediaRecorder.start()
  setIsRecording(true)
}

const stopRecording = () => {
  if (!mediaRecorderRef.current) return

  mediaRecorderRef.current.stop()   // 🔥 VERY IMPORTANT
  setIsRecording(false)

  streamRef.current.getTracks().forEach(track => track.stop())
}
useEffect(() => {
  let interval

  if (isRecording) {
    interval = setInterval(() => {
      setRecordTime(prev => prev + 1)
    }, 1000)
  }

  return () => clearInterval(interval)
}, [isRecording])

const sendAudio = () => {
  if (!audioBlob) {
    return;
  }
  const reader = new FileReader();

  reader.readAsDataURL(audioBlob);

  reader.onloadend = async () => {
    if (!reader.result) {
      return;
    }
    await sendMessage({ audio: reader.result });

    setAudioBlob(null);
    setRecordTime(0);
  };
};

const cancelRecording = () => {
  if (isRecording && mediaRecorderRef.current) {
    mediaRecorderRef.current.onstop = null
    mediaRecorderRef.current.stop()
  }

  streamRef.current?.getTracks().forEach(track => track.stop())

  chunksRef.current = []
  setIsRecording(false)
  setAudioBlob(null)
  setRecordTime(0)
}

  const handleInputChange = (e) => {
    setInput(e.target.value)
    setIsTyping(true)
    clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => setIsTyping(false), 1000)
  }

  const handleCall = (type) => {
    toast.custom(() => <CallToast type={type} />, { duration: 3000 })
  }

  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id)
  }, [selectedUser])

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  if (!selectedUser) {
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          height: '100%', gap: 16,
          background: 'rgba(0,0,0,0.05)',
        }}
        className="max-md:hidden"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 80, height: 80, borderRadius: '24px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, boxShadow: '0 20px 40px var(--glow)',
          }}
        >
            <img src={assets.logo} alt="logo" style={{ width: 45 }} />
        
        </motion.div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
           Zingleee
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
            Select a conversation to start messaging
          </p>

           <motion.button
    onClick={() => navigate('/ins')}
    animate={{ y: [0, -8, 0] }}
    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    style={{
      marginTop: 55,
      padding: '15px 20px',
      borderRadius: 999,
      border: '1px solid rgba(255,255,255,0.1)',
      background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
      color: '#fff',
      fontSize: 18,
      fontWeight: 600,
      cursor: 'pointer',
      boxShadow: '0 6px 18px var(--glow)',
      transition: 'all 0.25s ease'
    }}
  >
   Start with Guide
  </motion.button>

        </div>

        {/* floating dots */}
        {[...Array(5)].map((_, i) => (
          <motion.div key={i}
            style={{
              position: 'absolute',
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--accent)', opacity: 0.3,
              left: `${20 + i * 15}%`, top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{ y: [0, -12, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </motion.div>
    )
  }
  // -------------- AFTER SELECTING THE USER ---------------

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
     style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1, minWidth: 0, overflow: 'hidden' }}
    >
      {/* Chat Header */}
      <div style={{
  display: 'flex', 
  alignItems: 'center', 
  gap: 12,
  padding: '14px 16px',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
  background: 'rgba(0,0,0,0.2)',
  backdropFilter: 'blur(20px)',
  flexShrink: 0,
}}>
  {/* 1. Back Button - Added flexShrink: 0 */}
  <button 
    className="icon-btn md:hidden"
    onClick={() => setSelectedUser(null)}
    style={{ 
      display: 'flex',
      alignItems: 'center',    
      justifyContent: 'center', 
      color: 'white',
      cursor: 'pointer',
      zIndex: 10,                
      width: '36px',            
      height: '36px',
      padding: 0,
      flexShrink: 0 // <--- Keep this button's size fixed
    }}
  >
    <ArrowLeft size={22} />
  </button>

  {/* 2. Avatar Container - Added flexShrink: 0 */}
  <div style={{ position: 'relative', flexShrink: 0 }}> 
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

  {/* 3. Name + Status - Added minWidth: 0 and text truncation */}
  <div style={{ flex: 1, minWidth: 0 }}> {/* <--- minWidth: 0 allows the text to truncate */}
    <p style={{ 
      fontWeight: 600, 
      fontSize: 15,
      whiteSpace: 'nowrap',    // <--- Don't wrap to 2nd line
      overflow: 'hidden',      // <--- Hide extra text
      textOverflow: 'ellipsis' // <--- Add "..."
    }}>
      {selectedUser.fullName}
    </p>
    <p style={{ 
      fontSize: 12, 
      color: onlineUsers.includes(selectedUser._id) ? '#4ade80' : 'rgba(255,255,255,0.4)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }}>
      {onlineUsers.includes(selectedUser._id) ? '● Online' : '○ Offline'}
    </p>
  </div>

  {/* 4. Action buttons - Added flexShrink: 0 */}
  <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}> 
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

      {/* ------- */}

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '16px 16px 8px',
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => {
            const isMine = msg.senderId?.toString() === authUser?._id
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
<audio
  id={`audio-${msg._id}`}
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

      {/* Send Bar */}
      <div className="send-bar">
        {/* Emoji (future) */}
        <button className="icon-btn" title="Emoji" style={{ fontSize: 18, flexShrink: 0 }}>😊</button>

        {/* Input */}
        <div className="send-input-wrap">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendMessage(e)}
          />

          {/* Image upload */}
          <input onChange={handleSendImage} type="file" id="chat-image" accept="image/png,image/jpeg" hidden />
          <label htmlFor="chat-image" style={{ cursor: 'pointer', opacity: 0.6, fontSize: 18, display: 'flex', alignItems: 'center' }}
            title="Send image">
            <Images />
          </label>
        </div>

       {/* VOICE MESSAGE */}
{!isRecording && !audioBlob && (
  <button
    onClick={startRecording}
    style={iconBtn}
    title="Record"
  >
    <Mic size={18} />
  </button>
)}

{/* RECORDING UI */}
{isRecording && (
  <div className="flex items-center gap-2 text-red-500">
    ⏺ {recordTime}s

    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-1 h-4 bg-red-400 animate-pulse"></div>
      ))}
    </div>

    <button onClick={stopRecording}> <Pause /> </button>
  </div>
)}

{/* PREVIEW of recording */}
    {audioBlob && (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 14px',
      borderRadius: 16,
      background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      minWidth: 180,
    }}
  >
    {/* hidden audio */}
    <audio
      ref={(el) => (currentAudioRef.current = el)}
      src={URL.createObjectURL(audioBlob)}
      onEnded={() => setIsPreviewPlaying(false)}
    />

    {/* PLAY / PAUSE */}
    <button
      onClick={() => {
        const audio = currentAudioRef.current
        if (!audio) return

        if (audio.paused) {
          audio.play()
          setIsPreviewPlaying(true)
        } else {
          audio.pause()
          setIsPreviewPlaying(false)
        }
      }}
      style={{
        ...iconBtn,
        background: 'white',
        color: 'black',
      }}
    >
      {isPreviewPlaying ? <Pause size={16} /> : <Mic size={16} />}
    </button>

    {/* WAVEFORM */}
    <div style={{ display: 'flex', gap: 2 }}>
      {[10,14,8,16,12,18,9,15,11,17].map((h, i) => (
        <div
          key={i}
          style={{
            width: 2,
            height: h,
            background: 'white',
            borderRadius: 2,
          }}
        />
      ))}
    </div>

    {/* SEND */}
    <button onClick={sendAudio} style={iconBtn}>
      <ArrowUpFromLine size={16} />
    </button>

    {/* CANCEL */}
    <button onClick={cancelRecording} style={iconBtn}>
      <ArrowDownFromLine size={16} />
    </button>
  </div>
)}

        {/* Send audio msg */}
        {!audioBlob && (
        <motion.button
          className="send-btn"
          onClick={handleSendMessage}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.92 }}
          style={{
          display: 'flex',          
          alignItems: 'center',     
          justifyContent: 'center',   
          padding: 0,                
          }}
        >
        <Forward  size={18}/>
        </motion.button>
        )}

      </div>

      
      {/* Right Sidebar with Flap Animation */}
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

      {/* 2. The Sidebar "Flap" Container */}
      {/* 2. The Sidebar "Flap" Container */}
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
      

    </motion.div>
  )
}

export default ChatContainer