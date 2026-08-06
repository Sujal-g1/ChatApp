import React from "react";
import { motion } from "framer-motion";
import { ZingleeeLogo } from "./LandingPage";

const LoadingScreen = () => {
  return (
    <div
      className="noise"
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* Animated Logo */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          rotate: [0, 6, -6, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          filter: "drop-shadow(0 0 30px var(--glow))",
        }}
      >
        <ZingleeeLogo size={84} />
      </motion.div>

      {/* App Name */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
        style={{
          margin: 0,
          color: "white",
          fontFamily: "Syne",
          fontWeight: 800,
          fontSize: "42px",
          letterSpacing: "-0.03em",
        }}
      >
        Zingle<span style={{ color: "var(--accent)" }}>ee</span>
      </motion.h1>

      {/* Loading Dots */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 10,
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -10, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 0.7,
              delay: i * 0.15,
              repeat: Infinity,
            }}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background:
              "linear-gradient(135deg,var(--accent),var(--accent2))",
              boxShadow: "0 0 12px var(--glow)",
            }}
          />
        ))}
      </div>

      <motion.p
        animate={{
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
        }}
        style={{
          marginTop: 18,
          color: "rgba(255,255,255,.45)",
          fontSize: 14,
          letterSpacing: ".08em",
        }}
      >
        Securing conversations...
      </motion.p>
    </div>
  );
};

export default LoadingScreen;