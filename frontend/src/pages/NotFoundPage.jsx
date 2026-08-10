import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Home, Radio, Terminal } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { ZingleeeLogo } from "./LandingPage";

const glitchCharacters = [
  "0",
  "1",
  "/",
  "?",
  "#",
  "×",
  "+",
  "=",
  "<",
  ">",
  "{",
  "}",
];

const ascii404 = [
  "██████╗  ██████╗ ██╗  ██╗",
  "██╔══██╗██╔═████╗██║  ██║",
  "██║  ██║██║██╔██║███████║",
  "██║  ██║████╔╝██║╚════██║",
  "██████╔╝╚██████╔╝     ██║",
  "╚═════╝  ╚═════╝      ╚═╝",
];

export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const particles = useMemo(
    () =>
      Array.from({ length: 70 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 18 + Math.random() * 18,
        size: 0.5 + Math.random() * 2,
        opacity: 0.08 + Math.random() * 0.35,
      })),
    []
  );

  const characters = useMemo(
    () =>
      Array.from({ length: 35 }, (_, i) => ({
        char:
          glitchCharacters[
            Math.floor(Math.random() * glitchCharacters.length)
          ],
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 4 + Math.random() * 5,
        size: 10 + Math.random() * 12,
      })),
    []
  );

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <div
      className="noise"
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontFamily: "Outfit, sans-serif",
      }}
    >
      {/* =========================================================
          BACKGROUND GLOW
      ========================================================= */}

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.38, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          width: 650,
          height: 650,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, var(--glow), transparent 68%)",
          filter: "blur(110px)",
          pointerEvents: "none",
        }}
      />

      {/* Secondary glow */}

      <motion.div
        animate={{
          x: [-80, 80, -80],
          y: [40, -40, 40],
          opacity: [0.05, 0.16, 0.05],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, var(--accent), transparent 70%)",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      {/* =========================================================
          FLOATING PARTICLES
      ========================================================= */}

      {particles.map((particle, index) => (
        <motion.div
          key={`particle-${index}`}
          initial={{
            y: "-10vh",
            opacity: 0,
          }}
          animate={{
            y: "110vh",
            opacity: [
              0,
              particle.opacity,
              particle.opacity,
              0,
            ],
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
            top: 0,
            width: particle.size,
            height: particle.size,
            borderRadius: "50%",
            background:
              index % 5 === 0
                ? "var(--accent)"
                : "rgba(255,255,255,.7)",
            boxShadow:
              index % 5 === 0
                ? "0 0 12px var(--glow)"
                : "0 0 7px rgba(255,255,255,.4)",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* =========================================================
          FLOATING GLITCH CHARACTERS
      ========================================================= */}

      {characters.map((item, index) => (
        <motion.span
          key={`char-${index}`}
          animate={{
            opacity: [0.05, 0.35, 0.05],
            y: [-8, 8, -8],
            rotate: [-4, 4, -4],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: `${item.left}%`,
            top: `${item.top}%`,
            color:
              index % 6 === 0
                ? "var(--accent)"
                : "rgba(255,255,255,.2)",
            fontFamily: "monospace",
            fontSize: item.size,
            fontWeight: 700,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {item.char}
        </motion.span>
      ))}

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 24,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          ease: [0.4, 0, 0.2, 1],
        }}
        style={{
          position: "relative",
          zIndex: 5,
          width: "100%",
          maxWidth: 650,
          padding: "40px 24px",
          textAlign: "center",
        }}
      >
        {/* =====================================================
            LOGO
        ===================================================== */}

        <motion.div
          animate={{
            scale: [1, 1.04, 1],
            y: [0, -4, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 26,
            filter: "drop-shadow(0 0 28px var(--glow))",
          }}
        >
          <ZingleeeLogo size={58} />
        </motion.div>

        {/* =====================================================
            TERMINAL HEADER
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.5,
            delay: 0.1,
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 12px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,.08)",
            background: "rgba(255,255,255,.035)",
            color: "rgba(255,255,255,.45)",
            fontFamily: "monospace",
            fontSize: 11,
            letterSpacing: ".08em",
          }}
        >
          <Terminal size={13} />

          ROUTE_NOT_FOUND
        </motion.div>

        {/* =====================================================
            ASCII 404
        ===================================================== */}

        <div
          style={{
            marginTop: 28,
            marginBottom: 18,
            overflow: "hidden",
          }}
        >
          {ascii404.map((line, index) => (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                x: index % 2 === 0 ? -12 : 12,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.35,
                delay: 0.15 + index * 0.04,
              }}
              style={{
                fontFamily: "monospace",
                fontSize: "clamp(6px, 1.7vw, 12px)",
                lineHeight: 1.15,
                whiteSpace: "pre",
                color:
                  index % 2 === 0
                    ? "rgba(255,255,255,.85)"
                    : "var(--accent)",
                textShadow:
                  index % 2 === 0
                    ? "0 0 10px rgba(255,255,255,.08)"
                    : "0 0 18px var(--glow)",
              }}
            >
              {line}
            </motion.div>
          ))}
        </div>

        {/* =====================================================
            SIGNAL
        ===================================================== */}

        <motion.div
          animate={{
            opacity: [0.35, 1, 0.35],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            color: "var(--accent)",
            fontFamily: "monospace",
            fontSize: 11,
            letterSpacing: ".12em",
            marginBottom: 16,
          }}
        >
          <Radio size={14} />

          SIGNAL LOST
        </motion.div>

        {/* =====================================================
            TITLE
        ===================================================== */}

        <h1
          style={{
            margin: 0,
            color: "#fff",
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(28px, 6vw, 42px)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
          }}
        >
          This conversation went nowhere.
        </h1>

        <p
          style={{
            maxWidth: 420,
            margin: "14px auto 0",
            color: "rgba(255,255,255,.48)",
            fontSize: 14,
            lineHeight: 1.8,
          }}
        >
          The page you're looking for doesn't exist, or the signal
          was sent to a route that Zingleee doesn't recognize.
        </p>

        {/* =====================================================
            INVALID ROUTE
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
            delay: 0.45,
          }}
          style={{
            maxWidth: 430,
            margin: "22px auto 0",
            padding: "11px 15px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,.07)",
            background: "rgba(255,255,255,.035)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            textAlign: "left",
            fontFamily: "monospace",
            fontSize: 12,
          }}
        >
          <span
            style={{
              color: "var(--accent)",
            }}
          >
            $
          </span>

          <span
            style={{
              color: "rgba(255,255,255,.35)",
            }}
          >
            route:
          </span>

          <span
            style={{
              color: "rgba(255,255,255,.65)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {location.pathname}
          </span>
        </motion.div>

        {/* =====================================================
            ACTIONS
        ===================================================== */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
            marginTop: 28,
          }}
        >
          <motion.button
            whileHover={{
              scale: 1.04,
            }}
            whileTap={{
              scale: 0.96,
            }}
            onClick={() => navigate("/", { replace: true })}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 9,
              padding: "13px 22px",
              borderRadius: 999,
              border: "none",
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              background:
                "linear-gradient(135deg, var(--accent), var(--accent2))",
              boxShadow: "0 0 24px var(--glow)",
            }}
          >
            <Home size={16} />

            Back to Zingleee
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.04,
              backgroundColor: "rgba(255,255,255,.08)",
            }}
            whileTap={{
              scale: 0.96,
            }}
            onClick={handleGoBack}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 9,
              padding: "13px 22px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,.1)",
              color: "rgba(255,255,255,.8)",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              background: "rgba(255,255,255,.035)",
              backdropFilter: "blur(12px)",
            }}
          >
            <ArrowLeft size={16} />

            Go Back
          </motion.button>
        </div>

        {/* =====================================================
            BRAND FOOTER
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
            delay: 0.8,
          }}
          style={{
            marginTop: 34,
            color: "rgba(255,255,255,.2)",
            fontSize: 11,
            letterSpacing: ".08em",
          }}
        >
          Zingle
          <span style={{ color: "var(--accent)" }}>ee</span>
          {" · "}
          Find your way back.
        </motion.div>
      </motion.div>
    </div>
  );
}