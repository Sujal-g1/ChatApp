import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from 'react-router-dom';
import {
  User,
  Search,
  Mic,
  Shield,
  ArrowRight,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  Fingerprint,
  Zap,
  MessageCircle,
  Bell
} from "lucide-react"

// ─── Tab Config ─────────────────────────────────────────────
const tabs = [
  { id: "how", label: "How to Use" },
  { id: "privacy", label: "Privacy" },
  { id: "features", label: "Features" },
]

// ─── Content Config ─────────────────────────────────────────
const howCards = [
  {
    icon: <User size={22} />,
    title: "Create ID",
    text: "Your identity is your Zinglee ID — unique, private, and yours alone.",
    step: "01",
  },
  {
    icon: <Search size={22} />,
    title: "Find People",
    text: "Search anyone using their unique Zinglee ID. No phone numbers needed.",
    step: "02",
  },
  {
    icon: <Shield size={22} />,
    title: "Approve Requests",
    text: "You decide who gets in. Only accepted users can message you.",
    step: "03",
  },
   {
    icon: <Mic size={22} />,
    title: "Send Voice",
    text: "Record, preview, and send voice messages with full control.",
    step: "04",
  },
]

const privacyItems = [
  { icon: <Lock size={20} />, title: "Zero Phone Numbers", desc: "Sign up with just an ID — we never ask for your number." },
  { icon: <EyeOff size={20} />, title: "No Spam", desc: "Strangers can't reach you without your explicit approval." },
  { icon: <Fingerprint size={20} />, title: "You're in Control", desc: "Revoke, block, or archive any contact at any time." },
]

const featureItems = [
  { icon: <Zap size={20} />, title: "Instant Delivery", desc: "Messages arrive in real time with end-to-end delivery receipts." },
  { icon: <Mic size={20} />, title: "Voice Preview", desc: "Hear your voice note before it goes out — no regrets." },
  { icon: <MessageCircle size={20} />, title: "Clean Threads", desc: "Distraction-free conversations, always organised and searchable." },
  { icon: <Bell size={20} />, title: "Smart Alerts", desc: "Notification controls that respect your focus time." },
]

// ─── Sub-components ──────────────────────────────────────────

const HowCard = ({ icon, title, text, step, index }) => (
  <motion.div
    className="feature-card"
    style={{ position: "relative", overflow: "hidden" }}
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.08 }}
    whileHover={{ y: -4 }}
  >
    {/* Step number watermark */}
    <span
      style={{
        position: "absolute",
        top: 12,
        right: 18,
        fontFamily: "'Syne', sans-serif",
        fontSize: 42,
        fontWeight: 800,
        color: "rgba(124,106,247,0.08)",
        lineHeight: 1,
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      {step}
    </span>

    <div className="feature-icon">{icon}</div>
    <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13.5, lineHeight: 1.6 }}>{text}</p>
  </motion.div>
)

const PrivacyRow = ({ icon, title, desc, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.35, delay: index * 0.1 }}
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 16,
      padding: "20px 24px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16,
    }}
  >
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        background: "linear-gradient(135deg, var(--accent), var(--accent2))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: "0 4px 14px var(--glow)",
      }}
    >
      {icon}
    </div>
    <div>
      <p style={{ fontWeight: 700, marginBottom: 4, fontSize: 15 }}>{title}</p>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13.5, lineHeight: 1.55 }}>{desc}</p>
    </div>
  </motion.div>
)

const FeatureRow = ({ icon, title, desc, index }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.35, delay: index * 0.1 }}
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 16,
      padding: "20px 24px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16,
    }}
  >
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        background: "rgba(124,106,247,0.15)",
        border: "1px solid rgba(124,106,247,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: "var(--accent2)",
      }}
    >
      {icon}
    </div>
    <div>
      <p style={{ fontWeight: 700, marginBottom: 4, fontSize: 15 }}>{title}</p>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13.5, lineHeight: 1.55 }}>{desc}</p>
    </div>
  </motion.div>
)

// ─── Main Page ───────────────────────────────────────────────
const InstructionsPage = () => {
  const [activeTab, setActiveTab] = useState("how")
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const navigate = useNavigate();

  const handleContinue = () => {
    // navigate("/") — wire up your router here
    alert("Navigating to app…")
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 24px",
        position: "relative",
      }}
    >
      {/* Background orbs */}
      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* ── Content wrapper ── */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 32 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 680,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 36,
        }}
      >
        {/* ── HEADER ── */}
        <div style={{ textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 16px",
              borderRadius: 50,
              marginBottom: 20,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
            className="glass"
          >
            <Sparkles size={11} />
            Onboarding
          </motion.div>

          <motion.h1
            className="hero-title accent-gradient-text"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{ fontSize: "clamp(36px, 8vw, 56px)", marginBottom: 14 }}
          >
            Welcome to Zinglee
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.22 }}
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 16,
              lineHeight: 1.6,
              maxWidth: 420,
              margin: "0 auto",
            }}
          >
            Private, permission-based communication built for control and clarity.
          </motion.p>
        </div>

        {/* ── TABS ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="glass"
          style={{
            display: "inline-flex",
            gap: 4,
            padding: 6,
            borderRadius: 50,
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "9px 22px",
                borderRadius: 50,
                fontSize: 13.5,
                fontWeight: 600,
                fontFamily: "'Outfit', sans-serif",
                cursor: "pointer",
                border: "none",
                transition: "all 0.25s ease",
                background:
                  activeTab === tab.id
                    ? "linear-gradient(135deg, var(--accent), var(--accent2))"
                    : "transparent",
                color: activeTab === tab.id ? "#fff" : "rgba(255,255,255,0.45)",
                boxShadow: activeTab === tab.id ? "0 4px 14px var(--glow)" : "none",
              }}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* ── TAB CONTENT ── */}
        <div style={{ width: "100%" }}>
          <AnimatePresence mode="wait">

            {activeTab === "how" && (
              <motion.div
                key="how"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 16,
                }}
              >
                {howCards.map((c, i) => (
                  <HowCard key={c.step} {...c} index={i} />
                ))}
              </motion.div>
            )}

            {activeTab === "privacy" && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {/* Section heading */}
                <div style={{ textAlign: "center", marginBottom: 8 }}>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
                    Privacy First
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>
                    No phone numbers. No spam. You control who can reach you.
                  </p>
                </div>
                {privacyItems.map((item, i) => (
                  <PrivacyRow key={item.title} {...item} index={i} />
                ))}
              </motion.div>
            )}

            {activeTab === "features" && (
              <motion.div
                key="features"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {/* Section heading */}
                <div style={{ textAlign: "center", marginBottom: 8 }}>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
                    What You Get
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>
                    Voice previews, secure chats, and clean communication.
                  </p>
                </div>
                {featureItems.map((item, i) => (
                  <FeatureRow key={item.title} {...item} index={i} />
                ))}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
        >
          
          <button 
        onClick={() => navigate('/')}
        style={{
          marginTop: '20px',
          padding: '12px 24px',
          borderRadius: '50px',
          background: 'var(--accent)',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Go to Homepage
      </button>

        </motion.div>

      </motion.div>
    </div>
  )
}

export default InstructionsPage