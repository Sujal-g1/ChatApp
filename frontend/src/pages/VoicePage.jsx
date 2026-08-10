
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  Lightbulb,
  MessageCircle,
  Radio,
  Send,
  Shield,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ZingleeeLogo } from "./LandingPage";

const VoicePage = () => {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [sent, setSent] = useState(false);
    const [email, setEmail] = useState("");
  const particles = useMemo(
    () =>
      Array.from({ length: 55 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 18 + Math.random() * 16,
        size: 0.5 + Math.random() * 2,
        opacity: 0.04 + Math.random() * 0.28,
      })),
    []
  );

  /*
   * Scroll to the actual feedback section.
   *
   * FIX:
   * The previous code was looking for #open-channel,
   * but the form section uses id="your-voice".
   */
  const handleStart = () => {
    document.getElementById("your-voice")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    /*
      Backend integration will be added later.

      Example payload:

      {
        message,
        anonymous
      }
    */

    console.log({
      message,
      anonymous,
    });

    setSent(true);
    setMessage("");
  };

  const handleHome = () => {
    navigate("/");
  };

  return (
    <div
      className="noise"
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Outfit, sans-serif",
      }}
    >
      {/* =====================================================
          AMBIENT BACKGROUND
      ===================================================== */}

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.12, 0.25, 0.12],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "fixed",
          width: 750,
          height: 750,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, var(--glow), transparent 70%)",
          filter: "blur(130px)",
          left: "50%",
          top: "-30%",
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        animate={{
          x: [-100, 100, -100],
          y: [50, -40, 50],
          opacity: [0.02, 0.1, 0.02],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "fixed",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, var(--accent), transparent 70%)",
          filter: "blur(110px)",
          right: "-15%",
          bottom: "-10%",
          pointerEvents: "none",
        }}
      />

      {/* =====================================================
          FLOATING PARTICLES
      ===================================================== */}

      {particles.map((particle, index) => (
        <motion.div
          key={index}
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
            position: "fixed",
            left: `${particle.left}%`,
            top: 0,
            width: particle.size,
            height: particle.size,
            borderRadius: "50%",
            background:
              index % 5 === 0
                ? "var(--accent)"
                : "rgba(255,255,255,.6)",
            boxShadow:
              index % 5 === 0
                ? "0 0 12px var(--glow)"
                : "0 0 6px rgba(255,255,255,.25)",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        {/* ===================================================
            TOP NAVIGATION
        =================================================== */}

        <div
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            right: 24,
            display: "flex",
            justifyContent: "flex-start",
            zIndex: 20,
          }}
        >
          <motion.button
            type="button"
            onClick={handleHome}
            whileHover={{
              x: -3,
              backgroundColor: "rgba(255,255,255,.07)",
            }}
            whileTap={{
              scale: 0.96,
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              padding: "9px 14px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,.08)",
              background: "rgba(255,255,255,.025)",
              backdropFilter: "blur(15px)",
              color: "rgba(255,255,255,.7)",
              cursor: "pointer",
              fontFamily: "Outfit, sans-serif",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={14} />

            Back to Home
          </motion.button>
        </div>

        {/* ===================================================
            HERO
        =================================================== */}

        <section
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "90px 24px 70px",
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
          >
            {/* Logo */}

            <motion.div
              animate={{
                y: [0, -5, 0],
                scale: [1, 1.03, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                marginBottom: 38,
                filter: "drop-shadow(0 0 30px var(--glow))",
              }}
            >
              <ZingleeeLogo size={58} />
            </motion.div>

            {/* Status */}

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 13px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,.08)",
                background: "rgba(255,255,255,.025)",
                fontFamily: "monospace",
                fontSize: 10,
                letterSpacing: ".12em",
                color: "rgba(255,255,255,.4)",
              }}
            >
              <motion.span
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                }}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  boxShadow: "0 0 12px var(--glow)",
                }}
              />

              VOICE / OPEN
            </div>

            {/* Hero */}

            <h1
              style={{
                margin: "30px 0 0",
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(54px, 11vw, 112px)",
                lineHeight: 0.9,
                letterSpacing: "-0.075em",
                maxWidth: 850,
              }}
            >
              This space
              <br />
              is{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent2))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                open.
              </span>
            </h1>

            <p
              style={{
                maxWidth: 520,
                marginTop: 32,
                color: "rgba(255,255,255,.45)",
                fontSize: 16,
                lineHeight: 1.9,
              }}
            >
              Say what you think about Zingleee.
              Tell me what's broken. Tell me what could be
              better. Tell me what you love.
            </p>

            <p
              style={{
                maxWidth: 520,
                marginTop: 10,
                color: "rgba(255,255,255,.35)",
                fontSize: 14,
                lineHeight: 1.8,
              }}
            >
              You don't need the right words.
            </p>

            {/* CTA */}

            <motion.button
              type="button"
              onClick={handleStart}
              whileHover={{
                x: 5,
              }}
              whileTap={{
                scale: 0.97,
              }}
              style={{
                marginTop: 42,
                display: "flex",
                alignItems: "center",
                gap: 12,
                border: "none",
                background: "transparent",
                padding: 0,
                color: "#fff",
                cursor: "pointer",
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Open the channel

              <span
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent2))",
                  boxShadow: "0 0 20px var(--glow)",
                }}
              >
                <ArrowRight size={15} />
              </span>
            </motion.button>
          </motion.div>

          {/* Scroll indicator */}

          <motion.div
            animate={{
              y: [0, 8, 0],
              opacity: [0.25, 0.6, 0.25],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            style={{
              position: "absolute",
              bottom: 35,
              left: "50%",
              transform: "translateX(-50%)",
              color: "rgba(255,255,255,.3)",
            }}
          >
            <ArrowDown size={17} />
          </motion.div>
        </section>

        {/* ===================================================
            OPEN LETTER
        =================================================== */}

        <section
          style={{
            padding: "130px 24px",
            maxWidth: 760,
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.7,
            }}
          >
            <div
              style={{
                color: "var(--accent)",
                fontFamily: "monospace",
                fontSize: 11,
                letterSpacing: ".12em",
                marginBottom: 25,
              }}
            >
              A SMALL LETTER
            </div>

            <h2
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "clamp(32px, 6vw, 55px)",
                lineHeight: 1.05,
                letterSpacing: "-0.05em",
                margin: 0,
              }}
            >
              Dear Zingleee user,
            </h2>

            <div
              style={{
                marginTop: 35,
                color: "rgba(255,255,255,.55)",
                fontSize: 16,
                lineHeight: 2,
              }}
            >
              <p>
                You probably don't know the person behind this
                screen.
              </p>

              <p>
                To you, Zingleee is just an application. A place
                to log in, talk to people, send messages and
                hopefully make communication a little easier.
              </p>

              <p>
                But behind it is someone constantly wondering
                whether the next decision is actually the right
                one.
              </p>

              <p>
                Some things work. Some things don't. Some ideas
                sound brilliant at midnight and questionable the
                next morning.
              </p>

              <p
                style={{
                  color: "rgba(255,255,255,.85)",
                  fontFamily: "Syne, sans-serif",
                  fontSize: 21,
                  lineHeight: 1.6,
                }}
              >
                And that's exactly why I wanted this page to exist.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ===================================================
            NOT A FEEDBACK FORM
        =================================================== */}

        <section
          style={{
            padding: "130px 24px",
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: 0.7,
            }}
            style={{
              maxWidth: 760,
            }}
          >
            <div
              style={{
                color: "var(--accent)",
                fontFamily: "monospace",
                fontSize: 10,
                letterSpacing: ".14em",
                marginBottom: 25,
              }}
            >
              WHAT IS THIS?
            </div>

            <h2
              style={{
                margin: 0,
                fontFamily: "Syne, sans-serif",
                fontSize: "clamp(38px, 7vw, 70px)",
                lineHeight: 0.98,
                letterSpacing: "-0.06em",
              }}
            >
              This isn't
              <br />
              a feedback form.
            </h2>

            <div
              style={{
                marginTop: 38,
                color: "rgba(255,255,255,.48)",
                fontSize: 16,
                lineHeight: 2,
                maxWidth: 620,
              }}
            >
              <p>It's a conversation.</p>

              <p>
                Zingleee is still evolving. There are decisions
                I'm confident about, decisions I'm still thinking
                about, and probably a few that I'll eventually
                realize were completely wrong.
              </p>

              <p
                style={{
                  color: "rgba(255,255,255,.75)",
                }}
              >
                That's part of building something.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ===================================================
            DEVELOPER PERSPECTIVE
        =================================================== */}

        <section
          style={{
            padding: "80px 24px 150px",
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
            }}
            style={{
              borderLeft: "1px solid var(--accent)",
              paddingLeft: "clamp(22px, 5vw, 50px)",
              maxWidth: 760,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                color: "var(--accent)",
                fontFamily: "monospace",
                fontSize: 10,
                letterSpacing: ".12em",
                marginBottom: 25,
              }}
            >
              <Radio size={14} />

              FROM THE DEVELOPER
            </div>

            <h2
              style={{
                margin: 0,
                fontFamily: "Syne, sans-serif",
                fontSize: "clamp(30px, 5vw, 50px)",
                lineHeight: 1.05,
                letterSpacing: "-0.05em",
              }}
            >
              Before you tell me what
              <span
                style={{
                  color: "var(--accent)",
                }}
              >
                {" "}
                Zingleee needs,
              </span>{" "}
              let me tell you what I'm
              trying to build.
            </h2>

            <div
              style={{
                marginTop: 35,
                color: "rgba(255,255,255,.46)",
                fontSize: 15,
                lineHeight: 1.95,
              }}
            >
              <p>This is placeholder content for now.</p>

              <p>
                Eventually, this section will contain my actual
                perspective — why Zingleee exists, what I think
                communication should feel like, why certain
                decisions were made, and what I'm hoping this
                project can become.
              </p>

              <p>
                I don't want this page to pretend that Zingleee
                is finished. It isn't.
              </p>

              <p
                style={{
                  color: "rgba(255,255,255,.8)",
                  fontFamily: "Syne, sans-serif",
                  fontSize: 20,
                  lineHeight: 1.6,
                }}
              >
                I'm building it. You're using it.
                <br />
                That means your perspective matters.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ===================================================
            BELIEFS
        =================================================== */}

        <section
          style={{
            padding: "110px 24px",
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
          >
            <div
              style={{
                color: "var(--accent)",
                fontFamily: "monospace",
                fontSize: 11,
                letterSpacing: ".12em",
                marginBottom: 40,
              }}
            >
              WHAT I BELIEVE
            </div>

            {[
              {
                number: "01",
                title: "Privacy should matter.",
                icon: <Shield size={20} />,
              },
              {
                number: "02",
                title: "Software should feel human.",
                icon: <Heart size={20} />,
              },
              {
                number: "03",
                title: "Simple is harder than complicated.",
                icon: <Lightbulb size={20} />,
              },
              {
                number: "04",
                title: "Being imperfect is okay.",
                icon: <Sparkles size={20} />,
              },
              {
                number: "05",
                title: "If I'm wrong, tell me.",
                icon: <MessageCircle size={20} />,
              },
            ].map((item, index) => (
              <motion.div
                key={item.number}
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "24px 0",
                  borderBottom:
                    "1px solid rgba(255,255,255,.06)",
                }}
              >
                <span
                  style={{
                    width: 32,
                    color: "rgba(255,255,255,.2)",
                    fontFamily: "monospace",
                    fontSize: 11,
                  }}
                >
                  {item.number}
                </span>

                <span
                  style={{
                    color: "var(--accent)",
                    display: "flex",
                  }}
                >
                  {item.icon}
                </span>

                <span
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(18px, 4vw, 27px)",
                  }}
                >
                  {item.title}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ===================================================
            YOUR VOICE
        =================================================== */}


        <section
        id="your-voice"
        style={{
            padding: "120px 24px 80px",
        }}
        >
        <motion.div
            initial={{
            opacity: 0,
            y: 30,
            }}
            whileInView={{
            opacity: 1,
            y: 0,
            }}
            viewport={{
            once: true,
            }}
            transition={{
            duration: 0.7,
            }}
        >
            {/* Section label */}

            <div
            style={{
                color: "var(--accent)",
                fontFamily: "monospace",
                fontSize: 11,
                letterSpacing: ".12em",
                marginBottom: 20,
            }}
            >
            NOW YOUR TURN
            </div>

            {/* Heading */}

            <h2
            style={{
                margin: 0,
                fontFamily: "Syne, sans-serif",
                fontSize: "clamp(42px, 8vw, 76px)",
                lineHeight: 0.95,
                letterSpacing: "-0.065em",
            }}
            >
            Tell me
            <br />
            something.
            </h2>

            {/* Description */}

            <p
            style={{
                maxWidth: 500,
                marginTop: 25,
                color: "rgba(255,255,255,.45)",
                fontSize: 15,
                lineHeight: 1.9,
            }}
            >
            A problem. An idea. A criticism. Something you
            love. Something you think I'm completely wrong
            about.
            </p>

            {/* =================================================
                FEEDBACK FORM
            ================================================= */}

            <form
            onSubmit={handleSubmit}
            style={{
                marginTop: 45,
                width: "100%",
            }}
            >
            {/* =================================================
                MESSAGE
            ================================================= */}

            <div
                style={{
                width: "100%",
                position: "relative",
                }}
            >
                <textarea
                value={message}
                onChange={(e) => {
                    setMessage(e.target.value);

                    if (sent) {
                    setSent(false);
                    }
                }}
                placeholder="What's on your mind?"
                rows={7}
                required
                style={{
                    width: "100%",
                    maxWidth: "100%",
                    resize: "vertical",
                    boxSizing: "border-box",
                    borderRadius: 24,
                    border:
                    "1px solid rgba(255,255,255,.08)",
                    outline: "none",
                    background:
                    "rgba(255,255,255,.025)",
                    color: "#fff",
                    padding: "24px",
                    fontFamily: "Outfit, sans-serif",
                    fontSize: 15,
                    lineHeight: 1.8,
                    backdropFilter: "blur(15px)",
                }}
                />
            </div>

            {/* =================================================
                FORM CONTROLS
            ================================================= */}

           <div
            className="voice-controls"
            style={{
                marginTop: 16,
                display: "grid",
                alignItems: "start",
                gap: 14,
                width: "100%",
            }}
            >
                {/* ===============================================
                    ANONYMOUS
                =============================================== */}

                <div
                className="voice-anonymous"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "rgba(255,255,255,.3)",
                    fontSize: 11,
                    whiteSpace: "nowrap",
                    minHeight: 40,
                    paddingTop: 12,
                }}
                >
                <UserRound size={14} />

                <span>
                    You can share anonymously.
                </span>
                </div>

                {/* ===============================================
                    EMAIL
                =============================================== */}

                <div
                className="voice-email-wrapper"
                style={{
                    width: "100%",
                    minWidth: 0,
                }}
                >
                {/* Email input */}

                <div
                    className="voice-email-box"
                    style={{
                    width: "100%",
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    boxSizing: "border-box",
                    borderRadius: 999,
                    border:
                        "1px solid rgba(255,255,255,.08)",
                    background:
                        "rgba(255,255,255,.025)",
                    padding: "0 14px",
                    transition:
                        "border-color .25s ease, background .25s ease",
                    }}
                >
                    <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);

                        if (sent) {
                        setSent(false);
                        }
                    }}
                    placeholder="your@email.com"
                    required
                    aria-label="Your email address"
                    style={{
                        flex: 1,
                        minWidth: 0,
                        width: "100%",
                        height: "100%",
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        color: "#fff",
                        fontFamily:
                        "Outfit, sans-serif",
                        fontSize: 11,
                    }}
                    />

                    {/* Email check */}

                    <AnimatePresence mode="wait">
                    {email && (
                        <motion.span
                        key="email-confirmed"
                        initial={{
                            opacity: 0,
                            scale: 0.85,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.85,
                        }}
                        style={{
                            flexShrink: 0,
                            marginLeft: 8,
                            color: "var(--accent)",
                            fontSize: 10,
                            lineHeight: 1,
                        }}
                        >
                        ✓
                        </motion.span>
                    )}
                    </AnimatePresence>
                </div>

                {/* =============================================
                    EMAIL HELPER
                ============================================= */}

                <AnimatePresence mode="wait">
                    {email ? (
                    <motion.div
                        key="email-active"
                        initial={{
                        opacity: 0,
                        y: -3,
                        }}
                        animate={{
                        opacity: 1,
                        y: 0,
                        }}
                        exit={{
                        opacity: 0,
                        y: -3,
                        }}
                        style={{
                        marginTop: 7,
                        paddingLeft: 7,
                        color:
                            "rgba(255,255,255,.28)",
                        fontSize: 10,
                        lineHeight: 1.4,
                        }}
                    >
                        ✓ We'll send your response
                        confirmation here.
                    </motion.div>
                    ) : (
                    <motion.div
                        key="email-empty"
                        initial={{
                        opacity: 0,
                        }}
                        animate={{
                        opacity: 1,
                        }}
                        exit={{
                        opacity: 0,
                        }}
                        style={{
                        marginTop: 7,
                        paddingLeft: 7,
                        color:
                            "rgba(255,255,255,.18)",
                        fontSize: 10,
                        lineHeight: 1.4,
                        }}
                    >
                        We'll only use this for your
                        confirmation.
                    </motion.div>
                    )}
                </AnimatePresence>
                </div>

                {/* ===============================================
                    SEND BUTTON
                =============================================== */}

                <motion.button
                type="submit"
                disabled={
                    !message.trim() ||
                    !email.trim()
                }
                whileHover={{
                    scale:
                    message.trim() &&
                    email.trim()
                        ? 1.03
                        : 1,
                }}
                whileTap={{
                    scale:
                    message.trim() &&
                    email.trim()
                        ? 0.97
                        : 1,
                }}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 9,
                    border: "none",
                    borderRadius: 999,
                    padding: "13px 22px",
                    minHeight: 40,
                    background:
                    "linear-gradient(135deg, var(--accent), var(--accent2))",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 12,
                    cursor:
                    message.trim() &&
                    email.trim()
                        ? "pointer"
                        : "not-allowed",
                    opacity:
                    message.trim() &&
                    email.trim()
                        ? 1
                        : 0.4,
                    boxShadow:
                    "0 0 25px var(--glow)",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                }}
                >
                Send your voice

                <Send size={15} />
                </motion.button>
            </div>
            </form>

            {/* =================================================
                SUCCESS
            ================================================= */}

            <AnimatePresence>
            {sent && (
                <motion.div
                initial={{
                    opacity: 0,
                    y: 10,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                exit={{
                    opacity: 0,
                    y: -10,
                }}
                style={{
                    marginTop: 25,
                    padding: "16px 20px",
                    borderRadius: 15,
                    border:
                    "1px solid rgba(255,255,255,.07)",
                    background:
                    "rgba(255,255,255,.03)",
                    color:
                    "rgba(255,255,255,.6)",
                    fontSize: 13,
                }}
                >
                <strong
                    style={{
                    color: "var(--accent)",
                    }}
                >
                    Voice received.
                </strong>{" "}
                A confirmation has been sent to your
                email.
                </motion.div>
            )}
            </AnimatePresence>
        </motion.div>
        </section>

        {/* ===================================================
            BOTTOM BACK BUTTON
        =================================================== */}

        <div
          style={{
            padding: "30px 24px 70px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <motion.button
            type="button"
            onClick={handleHome}
            whileHover={{
              y: -3,
            }}
            whileTap={{
              scale: 0.96,
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 19px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,.08)",
              background: "rgba(255,255,255,.025)",
              backdropFilter: "blur(15px)",
              color: "rgba(255,255,255,.65)",
              cursor: "pointer",
              fontFamily: "Outfit, sans-serif",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={14} />

            Back to Home
          </motion.button>
        </div>

        {/* ===================================================
            END
        =================================================== */}

        <section
          style={{
            minHeight: "65vh",
            padding: "70px 24px 100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 25,
                filter: "drop-shadow(0 0 25px var(--glow))",
              }}
            >
              <ZingleeeLogo size={48} />
            </div>

            <h2
              style={{
                margin: 0,
                fontFamily: "Syne, sans-serif",
                fontSize: "clamp(35px, 7vw, 65px)",
                lineHeight: 0.95,
                letterSpacing: "-0.06em",
              }}
            >
              The channel
              <br />
              <span
                style={{
                  color: "var(--accent)",
                }}
              >
                stays open.
              </span>
            </h2>

            <p
              style={{
                marginTop: 25,
                color: "rgba(255,255,255,.3)",
                fontFamily: "monospace",
                fontSize: 10,
                letterSpacing: ".12em",
              }}
            >
              ZINGLEEE / VOICE / OPEN
            </p>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default VoicePage;

