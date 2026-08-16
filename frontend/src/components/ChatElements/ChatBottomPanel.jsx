import React from 'react'
import { motion, AnimatePresence } from "framer-motion";

import {
  ArrowDownFromLine,
  ArrowUpFromLine,
  Images,
  Mic,
  Pause,
  Forward,
} from "lucide-react";

const ChatBottomPanel = ({
    input,
  handleInputChange,
  handleSendMessage,
  handleSendImage,

  showEmoji,
  setShowEmoji,
  emojiRef,
  emojiCategories,
  activeEmojiTab,
  setActiveEmojiTab,
  handleEmojiClick,

  isRecording,
  recordTime,
  startRecording,
  stopRecording,

  audioBlob,
  currentAudioRef,
  isPreviewPlaying,
  setIsPreviewPlaying,
  sendAudio,
  cancelRecording,
}) => {


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
     <div className="send-bar"
     className="send-bar"
    style={{
      height: '64px',
      boxSizing: 'border-box',
      padding: '0 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexShrink: 0,
    }}>


        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
  {/* Emoji Button */}
  <button
    className="icon-btn"
    title="Emoji"
    style={{ fontSize: 18, flexShrink: 0 }}
    onClick={() => setShowEmoji(prev => !prev)}
  >
    😊
  </button>

  {/* EMOJI PANEL  */}
 {showEmoji && (
  <div
    ref={emojiRef}
    style={{
      position: "absolute",
      bottom: "55px",
      left: 0,
      background: "rgba(20,20,40,0.95)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 12,
      width: "min(320px, 90vw)",
      zIndex: 100,
      backdropFilter: "blur(20px)",
      overflow: "hidden"
    }}
  >

    {/* 🔹 CATEGORY TABS */}
    <div style={{
      display: "flex",
      overflowX: "auto",
      whiteSpace: "nowrap",
      borderBottom: "1px solid rgba(255,255,255,0.08)"
    }}>
      {Object.keys(emojiCategories).map((key) => (
        <button
          key={key}
          onClick={() => setActiveEmojiTab(key)}
          style={{
            flex: 1,
            padding: "6px 4px",
            fontSize: 12,
            background: activeEmojiTab === key ? "rgba(255,255,255,0.1)" : "transparent",
            border: "none",
            color: "white",
            cursor: "pointer"
          }}
        >
          {key}
        </button>
      ))}
    </div>

    {/* 🔹 EMOJI GRID */}
    <div style={{
      padding: 10,
      display: "grid",
      gridTemplateColumns: "repeat(8, 1fr)",
      gap: 6,
      maxHeight: "260px",
      overflowY: "auto"
    }}>
      {emojiCategories[activeEmojiTab].map((emoji, i) => (
        <span
          key={i}
          onClick={() => handleEmojiClick(emoji)}
          style={{
            fontSize: 22,
            cursor: "pointer"
          }}
        >
          {emoji}
        </span>
      ))}
    </div>

  </div>
)}

</div>

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
  )
}

export default ChatBottomPanel