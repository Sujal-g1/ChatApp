import React, { useEffect, useRef, useContext, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import RightSidebar from '../components/RightSidebar'
import { formatMsgTime } from '../lib/utils'
import assets from '../assets/assets'
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom"
import { ArrowDownFromLine,ArrowLeft, ArrowUpFromLine, Images, Mic, Pause, Phone, Search, Video,Forward, MoreVertical, Camera, CameraOff, MicOff, PhoneOff, RefreshCw} from 'lucide-react'; 
import ChatNavbar from './ChatElements/ChatNavbar'
import VideoCallOverlay from './ChatElements/VideoCallOverlay'
import ChatMessages from './ChatElements/ChatMessages'
import ChatBottomPanel from './ChatElements/ChatBottomPanel'

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
  const { authUser, onlineUsers,socket } = useContext(AuthContext)
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
  const [showEmoji, setShowEmoji] = useState(false)
  const [activeEmojiTab, setActiveEmojiTab] = useState("smileys")

  const [showVideoCall, setShowVideoCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callStatus, setCallStatus] = useState("Connecting...");
  const [isFrontCamera, setIsFrontCamera] = useState(true);


  const fireflies = Array.from({ length: 12 }, (_, i) => ({
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 10,
    duration: 8 + Math.random() * 8,
  }));

const emojiRef = useRef()
const currentAudioRef = useRef(null)
const mediaRecorderRef = useRef(null)
const chunksRef = useRef([])
const streamRef = useRef(null)
const typingTimer = useRef()

const localVideoRef = useRef(null);
const remoteVideoRef = useRef(null);

const remoteUserIdRef = useRef(null);
const peerConnection = useRef(null);
const localStream = useRef(null);


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

const emojiCategories = {
  smileys: [
    "😀","😁","😂","🤣","😊","😍","😘","😎","🤩","🥳",
    "😢","😭","😡","😤","😴","😵","🤯","😇","😈","🥺",
    "😜","😝","😏","😬","😅","🤭","🫠","🫡"
  ],

  animals: [
    "🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯",
    "🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦","🦄","🐝",
    "🐢","🐍","🐙","🦋"
  ],

  food: [
    "🍔","🍕","🍟","🌭","🍿","🍗","🍖","🥓","🍞","🥐",
    "🍩","🍪","🎂","🍰","🧁","🍫","🍬","🍭","🍎","🍉",
    "🍇","🍓","🍒","🥭","🍌","🥤","☕"
  ],

  gestures: [
    "👍","👎","👌","✌️","🤞","🤟","🤘","👏","🙌","🙏",
    "🤝","💪","🫶","👊","✊","🖐️","👋","🤚"
  ],

  symbols: [
    "❤️","💔","💖","💯","🔥","✨","⭐","🌟","⚡","💥",
    "🎉","🎊","💀","☠️","👑","🎯","🚀"
  ],

  objects: [
    "📱","💻","⌚","🎧","📷","🎥","📞","🔋","💡","📦",
    "🧸","🎮","🕹️","📚","✏️","🖊️"
  ]
}

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (input.trim() === '') return
    await sendMessage({ text: input.trim() })
    setInput('')
  }

  const handleSendImage = async (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  // Only images
  if (!file.type.startsWith("image/")) {
    toast.error("Please select a valid image");
    e.target.value = "";
    return;
  }

  // 5 MB limit
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

  if (file.size > MAX_IMAGE_SIZE) {
    toast.error("Image is too large. Maximum size is 5 MB.");
    e.target.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = async () => {
    try {
      await sendMessage({
        image: reader.result,
      });
    } catch {
      toast.error("Unable to send image");
    } finally {
      e.target.value = "";
    }
  };

  reader.onerror = () => {
    toast.error("Unable to read image");
    e.target.value = "";
  };

  reader.readAsDataURL(file);
};


  const handleEmojiClick = (emoji) => {
  setInput(prev => prev + emoji)
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


// ---------
  const handleInputChange = (e) => {
    setInput(e.target.value)
    setIsTyping(true)
    clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => setIsTyping(false), 1000)
  }

  // ------------------------------------video call ------------------------------------
const handleCall = async (type) => {
if (type === "video") {
setShowVideoCall(true);
await startCall();
return;
}

toast.custom(() => <CallToast type={type} />, {
duration: 3000
});
};

// vc connection,
 const createPeerConnection = () => {
peerConnection.current = new RTCPeerConnection({
iceServers: [
{
urls: "stun:stun.l.google.com:19302"
}
]
});

peerConnection.current.ontrack = (event) => {

// console.log("REMOTE VIDEO RECEIVED");
// console.log(event.streams);

setCallStatus("Connected");

if (remoteVideoRef.current) {
remoteVideoRef.current.srcObject = event.streams[0];
}
};

peerConnection.current.onicecandidate = (event) => {
if (event.candidate) {

// console.log("SENDING ICE");

socket.emit("ice-candidate", {
to: remoteUserIdRef.current,
candidate: event.candidate
});
}
};


};

// start vc
  const startCall = async () => {
    remoteUserIdRef.current = selectedUser._id;
  try {

  // create only if missing
  if (!peerConnection.current) {
    createPeerConnection();
  }

  // get camera + mic
  localStream.current =
    await navigator.mediaDevices.getUserMedia({
    video: {
  facingMode: "environment"
  },
      audio: true
    });

  // show local video
  if (localVideoRef.current) {
    localVideoRef.current.srcObject = localStream.current;
  }

  // safety check again
  if (!peerConnection.current) {
    // console.log("Peer connection missing again, recreating...");
    createPeerConnection();
  }

  // add tracks safely
  localStream.current.getTracks().forEach((track) => {
    if (peerConnection.current) {
      peerConnection.current.addTrack(track, localStream.current);
    }
  });

  // create offer
  const offer = await peerConnection.current.createOffer();

  await peerConnection.current.setLocalDescription(offer);

  socket.emit("call-user", {
    to: selectedUser?._id,
    offer,
    callerInfo: {
      name: authUser.fullName,
      profilePic: authUser.profilePic
    }
  });

  }catch {
  setShowVideoCall(false);
  setCallStatus("Call failed");
  toast.error("Unable to start the video call");
}
  };
  
  const switchCamera = async () => {
  try {
  if (!localStream.current) return;

  // stop old video tracks
  localStream.current.getVideoTracks().forEach(track => {
    track.stop();
  });

  const newStream =
    await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: isFrontCamera
          ? "user"
          : "environment"
      },
      audio: true
    });

  const newVideoTrack =
    newStream.getVideoTracks()[0];

  // replace local video preview
  if (localVideoRef.current) {
    localVideoRef.current.srcObject = newStream;
  }

  // replace track in peer connection
  const sender =
    peerConnection.current
      ?.getSenders()
      .find(sender =>
        sender.track?.kind === "video"
      );

  if (sender) {
    await sender.replaceTrack(newVideoTrack);
  }

  localStream.current = newStream;
  setIsFrontCamera(!isFrontCamera);

  } catch {
  toast.error("Unable to switch camera");
  // console.log("Switch camera error:", error);
  }
  };


  const acceptCall = async () => {
  remoteUserIdRef.current = incomingCall.from;
  setShowVideoCall(true);
  createPeerConnection();
  localStream.current =
  await navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
  });

  if (localVideoRef.current) {
  localVideoRef.current.srcObject = localStream.current;
  }

  localStream.current.getTracks().forEach((track) => {
  peerConnection.current.addTrack(track, localStream.current);
  });

  await peerConnection.current.setRemoteDescription(
  new RTCSessionDescription(incomingCall.offer)
  );

  const answer = await peerConnection.current.createAnswer();
  await peerConnection.current.setLocalDescription(answer);
  socket.emit("answer-call", {
  to: incomingCall.from,
  answer
  });
  setIncomingCall(null);
  };

  const rejectCall = () => {
  socket.emit("reject-call", {
  to: incomingCall.from
  });

  setIncomingCall(null);
  };

  const endCall = () => {
  if (selectedUser?._id) {
  socket.emit("end-call", {
  to: selectedUser._id
  });
  }

if (peerConnection.current) {
peerConnection.current.close();
peerConnection.current = null;
}

if (localStream.current) {
localStream.current.getTracks().forEach((track) => {
track.stop();
});
localStream.current = null;
}

if (localVideoRef.current) {
localVideoRef.current.srcObject = null;
}

if (remoteVideoRef.current) {
remoteVideoRef.current.srcObject = null;
}

setShowVideoCall(false);
setIncomingCall(null);
};

  const toggleMute = () => {
  if (!localStream.current) return;

  const audioTrack = localStream.current
  .getAudioTracks()[0];

  if (audioTrack) {
  audioTrack.enabled = !audioTrack.enabled;
  setIsMuted(!audioTrack.enabled);
  }
  };

  // cam on/off
  const toggleCamera = () => {
if (!localStream.current) return;

const videoTrack = localStream.current
.getVideoTracks()[0];

if (videoTrack) {
videoTrack.enabled = !videoTrack.enabled;
setIsCameraOff(!videoTrack.enabled);
}
};
// const toggleCamera = () => {
//   const stream = localStream.current;

//   if (!stream) return;

//   const videoTrack = stream.getVideoTracks()[0];

//   if (!videoTrack) return;

//   const newState = !videoTrack.enabled;

//   videoTrack.enabled = newState;

//   setIsCameraOff(!newState);
// };


// noti vc

useEffect(() => {
  if (!socket) return;
socket.on("incoming-call", ({ from, offer, callerInfo }) => {
setIncomingCall({
    from,
    offer,
    callerInfo
});
});

socket.on("call-answered", async ({ answer }) => {
if (!peerConnection.current) return;
await peerConnection.current.setRemoteDescription(
  new RTCSessionDescription(answer)
);
});

socket.on("ice-candidate", async ({ candidate }) => {

// console.log("RECEIVED ICE");

if (!peerConnection.current || !candidate) return;

try {
await peerConnection.current.addIceCandidate(
new RTCIceCandidate(candidate)
);
} catch (err) {
// console.log("ICE ERROR", err);
}

});

socket.on("call-ended", () => {
endCall();
});
socket.on("call-rejected", () => {
toast.error("Call rejected");
endCall();
});
return () => {
socket.off("incoming-call");
socket.off("call-answered");
socket.off("ice-candidate");
socket.off("call-ended");
socket.off("call-rejected");
};
}, [socket]);



// video call end
  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id)
  }, [selectedUser])


  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
  if (scrollEnd.current && messages) {
    scrollEnd.current.scrollIntoView({ behavior: 'smooth' })
  }
}, [messages])

useEffect(() => {
  const handleClickOutside = (e) => {
    if (emojiRef.current && !emojiRef.current.contains(e.target)) {
      setShowEmoji(false)
    }
  }
  document.addEventListener("mousedown", handleClickOutside)
  return () => document.removeEventListener("mousedown", handleClickOutside)
}, [])

      // will go to the main page file i created
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
        {/* zingleee logo before chat opening */}
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

          {/* zingleee name with start guide   */}
        <div style={{ textAlign: 'center' }}>
         <span style={{ 
        fontFamily: 'Syne, sans-serif', 
        fontWeight: 800, 
        fontSize: 45, // Reduced from 20
        letterSpacing: '-0.02em',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis' // Gracefully cuts text if there's no room
      }}>
        Zingle<span style={{ color: 'var(--accent)' }}>ee</span>
      </span>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
            Select a conversation to start messaging
          </p>

         <motion.button
          onClick={() => navigate('/ins')}
          className="feature-card"
          style={{ 
            marginTop: '20px', 
            position: "relative", 
            overflow: "hidden",
            height: '40px', // Adjust this value to your preferred height
            padding: '8px 16px', // Optional: lowering vertical padding also reduces height
            textAlign:'center'
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4 }}
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


      <ChatNavbar 
        setShowRightSidebar={setShowRightSidebar}
        handleCall={handleCall}
        />

      {/* Messages */}
      <ChatMessages 
      scrollEnd={scrollEnd}
      playingId={playingId}
      setPlayingId={setPlayingId} />


      {/* bottom panel */}
      <ChatBottomPanel
      input={input}
      handleInputChange={handleInputChange}
      handleSendMessage={handleSendMessage}
      handleSendImage={handleSendImage}

      showEmoji={showEmoji}
      setShowEmoji={setShowEmoji}
      emojiRef={emojiRef}
      emojiCategories={emojiCategories}
      activeEmojiTab={activeEmojiTab}
      setActiveEmojiTab={setActiveEmojiTab}
      handleEmojiClick={handleEmojiClick}

      isRecording={isRecording}
      recordTime={recordTime}
      startRecording={startRecording}
      stopRecording={stopRecording}

      audioBlob={audioBlob}
      currentAudioRef={currentAudioRef}
      isPreviewPlaying={isPreviewPlaying}
      setIsPreviewPlaying={setIsPreviewPlaying}
      sendAudio={sendAudio}
      cancelRecording={cancelRecording}
    />

      
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

     background: 'rgba(15, 15, 20, 0.96)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    boxShadow: '-8px 0 24px rgba(0,0,0,0.2)',

      zIndex: 50,
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
        
      {/* vc  ----------------------------- */}
     <VideoCallOverlay
        showRightSidebar={showRightSidebar}
        setShowRightSidebar={setShowRightSidebar}
        incomingCall={incomingCall}
        showVideoCall={showVideoCall}
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        selectedUser={selectedUser}
        callStatus={callStatus}
        isMuted={isMuted}
        isCameraOff={isCameraOff}
        assets={assets}
        acceptCall={acceptCall}
        rejectCall={rejectCall}
        endCall={endCall}
        toggleMute={toggleMute}
        toggleCamera={toggleCamera}
        switchCamera={switchCamera}
      />
  


    </motion.div>
  )
}

export default ChatContainer