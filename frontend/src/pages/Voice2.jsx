import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Heart,
  Lightbulb,
  MessageCircle,
  Quote,
  Send,
  Shield,
  Sparkles,
  UserRound,
} from "lucide-react";
import { ZingleeeLogo } from "./LandingPage";

const VoicePage = () => {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const particles = useMemo(
    () =>
      Array.from({ length: 60 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 18 + Math.random() * 16,
        size: 0.5 + Math.random() * 2,
        opacity: 0.04 + Math.random() * 0.3,
      })),
    []
  );

  const scrollToVoice = () => {
    document
      .getElementById("your-voice")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    // Backend integration will go here later.
    console.log("Voice:", message);

    setSent(true);
    setMessage("");
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
          BACKGROUND
      ===================================================== */}

      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.14, 0.28, 0.14],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "fixed",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, var(--glow), transparent 70%)",
          filter: "blur(120px)",
          left: "50%",
          top: "-20%",
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        animate={{
          x: [-100, 100, -100],
          y: [40, -40, 40],
          opacity: [0.03, 0.1, 0.03],
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

      {/* Floating particles */}

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
                : "0 0 7px rgba(255,255,255,.3)",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* =====================================================
          PAGE
      ===================================================== */}

      <main
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 950,
          margin: "0 auto",
        }}
      >
        {/* ===================================================
            HERO
        =================================================== */}

        <section
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px 24px",
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
                marginBottom: 35,
                filter: "drop-shadow(0 0 30px var(--glow))",
              }}
            >
              <ZingleeeLogo size={58} />
            </motion.div>

            {/* Small metadata */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: "rgba(255,255,255,.3)",
                fontFamily: "monospace",
                fontSize: 11,
                letterSpacing: ".1em",
                marginBottom: 25,
              }}
            >
              <span
                style={{
                  color: "var(--accent)",
                }}
              >
                VOICE / 001
              </span>

              <span>•</span>

              <span>FROM THE DEVELOPER</span>
            </div>

            {/* Hero title */}

            <h1
              style={{
                margin: 0,
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(52px, 11vw, 105px)",
                lineHeight: 0.92,
                letterSpacing: "-0.07em",
                maxWidth: 800,
              }}
            >
              I built
              <br />
              this
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent2))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                alone.
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
              Zingleee isn't backed by a huge team or a room full
              of people deciding what it should become.
            </p>

            <p
              style={{
                maxWidth: 520,
                marginTop: 12,
                color: "rgba(255,255,255,.45)",
                fontSize: 16,
                lineHeight: 1.9,
              }}
            >
              It's one person's idea, built one decision,
              one experiment, and occasionally one very stubborn
              bug at a time.
            </p>

            {/* Scroll */}

            <motion.button
              onClick={scrollToVoice}
              animate={{
                y: [0, 7, 0],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                marginTop: 50,
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: "none",
                background: "transparent",
                color: "rgba(255,255,255,.35)",
                cursor: "pointer",
                fontFamily: "monospace",
                fontSize: 11,
                letterSpacing: ".08em",
                padding: 0,
              }}
            >
              KEEP READING

              <ArrowDown size={15} />
            </motion.button>
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
            WHY
        =================================================== */}

        <section
          style={{
            padding: "100px 24px",
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
              WHY I STARTED
            </div>

            <h2
              style={{
                margin: 0,
                maxWidth: 780,
                fontFamily: "Syne, sans-serif",
                fontSize: "clamp(38px, 7vw, 68px)",
                lineHeight: 1,
                letterSpacing: "-0.06em",
              }}
            >
              I wanted to build something
              <span
                style={{
                  color: "var(--accent)",
                }}
              >
                {" "}
                I would actually want to use.
              </span>
            </h2>

            <div
              style={{
                marginTop: 40,
                maxWidth: 650,
                color: "rgba(255,255,255,.48)",
                fontSize: 15,
                lineHeight: 1.9,
              }}
            >
              <p>
                This section is deliberately written as
                placeholder content for now.
              </p>

              <p>
                Eventually, this is where the real story of
                Zingleee will live — the frustration, the ideas,
                the decisions, the mistakes, and the reason I
                decided to keep building.
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
            TURNING POINT
        =================================================== */}

        <section
          style={{
            minHeight: "70vh",
            padding: "130px 24px",
            display: "flex",
            alignItems: "center",
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
              amount: 0.3,
            }}
            transition={{
              duration: 0.8,
            }}
            style={{
              width: "100%",
              textAlign: "center",
            }}
          >
            <Quote
              size={30}
              style={{
                color: "var(--accent)",
                marginBottom: 25,
              }}
            />

            <h2
              style={{
                margin: 0,
                fontFamily: "Syne, sans-serif",
                fontSize: "clamp(38px, 8vw, 78px)",
                lineHeight: 0.98,
                letterSpacing: "-0.065em",
              }}
            >
              I don't know
              <br />
              where this goes.
            </h2>

            <p
              style={{
                maxWidth: 470,
                margin: "30px auto 0",
                color: "rgba(255,255,255,.42)",
                fontSize: 15,
                lineHeight: 1.9,
              }}
            >
              And honestly, I think that's okay.
              I'm building, learning, changing things,
              and figuring it out as I go.
            </p>
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

            {/* Feedback form */}

            <form
              onSubmit={handleSubmit}
              style={{
                marginTop: 45,
              }}
            >
              <div
                style={{
                  position: "relative",
                }}
              >
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What's on your mind?"
                  rows={7}
                  style={{
                    width: "100%",
                    resize: "vertical",
                    boxSizing: "border-box",
                    borderRadius: 24,
                    border:
                      "1px solid rgba(255,255,255,.08)",
                    outline: "none",
                    background: "rgba(255,255,255,.025)",
                    color: "#fff",
                    padding: "24px",
                    fontFamily: "Outfit, sans-serif",
                    fontSize: 15,
                    lineHeight: 1.8,
                    backdropFilter: "blur(15px)",
                  }}
                />
              </div>

              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 15,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "rgba(255,255,255,.3)",
                    fontSize: 11,
                  }}
                >
                  <UserRound size={14} />

                  You can share anonymously.
                </div>

                <motion.button
                  type="submit"
                  disabled={!message.trim()}
                  whileHover={{
                    scale: message.trim() ? 1.03 : 1,
                  }}
                  whileTap={{
                    scale: message.trim() ? 0.97 : 1,
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    border: "none",
                    borderRadius: 999,
                    padding: "13px 22px",
                    background:
                      "linear-gradient(135deg, var(--accent), var(--accent2))",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: message.trim()
                      ? "pointer"
                      : "not-allowed",
                    opacity: message.trim() ? 1 : 0.4,
                    boxShadow: "0 0 25px var(--glow)",
                  }}
                >
                  Send your voice

                  <Send size={15} />
                </motion.button>
              </div>
            </form>

            {/* Success */}

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
                    background: "rgba(255,255,255,.03)",
                    color: "rgba(255,255,255,.6)",
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
                  The backend connection will be added here once
                  the final feedback system is ready.
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <footer
          style={{
            padding: "70px 24px 100px",
            textAlign: "center",
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
            }}
            viewport={{
              once: true,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 20,
                filter: "drop-shadow(0 0 20px var(--glow))",
              }}
            >
              <ZingleeeLogo size={40} />
            </div>

            <p
              style={{
                margin: 0,
                fontFamily: "Syne, sans-serif",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              Built by one person.
            </p>

            <p
              style={{
                margin: "6px 0 0",
                color: "var(--accent)",
                fontFamily: "Syne, sans-serif",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              Shaped by many voices.
            </p>

            <div
              style={{
                marginTop: 25,
                color: "rgba(255,255,255,.2)",
                fontFamily: "monospace",
                fontSize: 10,
                letterSpacing: ".1em",
              }}
            >
              ZINGLEEE / VOICE / 001
            </div>
          </motion.div>
        </footer>
      </main>
    </div>
  );
};

export default VoicePage;