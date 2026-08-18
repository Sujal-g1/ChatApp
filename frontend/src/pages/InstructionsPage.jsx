import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  User,
  Search,
  UserPlus,
  Users,
  Mic,
  Shield,
  ArrowRight,
  Sparkles,
  Lock,
  EyeOff,
  Fingerprint,
  Zap,
  MessageCircle,
  Bell,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

/* =========================================================
   TABS
========================================================= */

const tabs = [
  {
    id: "how",
    label: "How It Works",
  },
  {
    id: "privacy",
    label: "Privacy & Safety",
  },
  {
    id: "features",
    label: "What's Inside",
  },
];

/* =========================================================
   MAIN JOURNEY
========================================================= */

const journeySteps = [
  {
    number: "01",
    eyebrow: "YOUR IDENTITY",
    title: "Start with your Zinglee ID.",
    description:
      "Create your account with your email, username, and profile details. Your Zinglee ID becomes your identity inside the platform and gives people a way to find you without needing your phone number.",

    icon: <User size={24} />,

    points: [
      "Create your account",
      "Choose your username",
      "Set up your profile",
    ],
  },

  {
    number: "02",
    eyebrow: "FIND & CONNECT",
    title: "Find people you know.",
    description:
      "Use search to find another person through their username or unique Zinglee ID. When you find the right person, send a friend request and wait for them to accept it.",

    icon: <Search size={24} />,

    points: [
      "Search by Zinglee ID",
      "Open the person's profile",
      "Send a friend request",
    ],
  },

  {
    number: "03",
    eyebrow: "PRIVATE CONVERSATIONS",
    title: "Start a 1-to-1 chat.",
    description:
      "Once a connection is accepted, that person becomes available for private conversation. Open the chat and start communicating directly with your friend.",

    icon: <MessageCircle size={24} />,

    points: [
      "Accept the connection",
      "Open the conversation",
      "Send messages and voice notes",
    ],
  },

  {
    number: "04",
    eyebrow: "COMMUNITIES",
    title: "Talk with more people.",
    description:
      "Communities are designed for group conversations around a shared space. Discover a community, join when membership is available, and participate in conversations with its members.",

    icon: <Users size={24} />,

    points: [
      "Discover communities",
      "Join a community",
      "Participate in group chat",
    ],
  },
];

/* =========================================================
   QUICK GUIDE
========================================================= */

const quickGuide = [
  {
    icon: <UserPlus size={19} />,
    title: "Friend Requests",
    text:
      "Requests give both people control over who becomes a private connection.",
  },

  {
    icon: <Mic size={19} />,
    title: "Voice Messages",
    text:
      "Record a voice message, preview it, and send it when you're ready.",
  },

  {
    icon: <Shield size={19} />,
    title: "Manage People",
    text:
      "Use available controls to manage unwanted connections and block users when necessary.",
  },

  {
    icon: <Bell size={19} />,
    title: "Notifications",
    text:
      "Stay aware of important activity such as new messages and connection requests.",
  },
];

/* =========================================================
   PRIVACY
========================================================= */

const privacyItems = [
  {
    icon: <Lock size={21} />,
    title: "No phone number required",
    desc:
      "Zingleee uses your account identity and unique Zinglee ID for user discovery instead of requiring your phone number.",
  },

  {
    icon: <Shield size={21} />,
    title: "Permission-based messaging",
    desc:
      "Private conversations are designed around accepted connections, helping prevent unwanted direct communication.",
  },

  {
    icon: <Fingerprint size={21} />,
    title: "You control your connections",
    desc:
      "You decide which connection requests to accept and can use available controls to manage people you interact with.",
  },

  {
    icon: <EyeOff size={21} />,
    title: "Private and community spaces are different",
    desc:
      "A 1-to-1 conversation is intended for connected users, while community conversations are available to members of that community.",
  },

  {
    icon: <Lock size={21} />,
    title: "Protect your account",
    desc:
      "Keep your password and authentication sessions secure. Never share account credentials or private security information with anyone.",
  },

  {
    icon: <Shield size={21} />,
    title: "Use Zingleee responsibly",
    desc:
      "Respect other users, communities, and the platform rules. Use blocking and reporting controls when something feels inappropriate or unwanted.",
  },
];

/* =========================================================
   FEATURES
========================================================= */

const featureGroups = [
  {
    label: "CONNECT",
    title: "Find the right people.",
    text:
      "Zingleee is built around identity rather than phone-number discovery. Find people using their Zinglee ID and choose who you want to connect with.",

    icon: <Search size={24} />,

    items: [
      "Zinglee ID discovery",
      "Friend requests",
      "Connection management",
    ],
  },

  {
    label: "COMMUNICATE",
    title: "Private conversations that stay focused.",
    text:
      "After a connection is accepted, conversations become available in your chat experience. Communicate directly without needing to refresh the page.",

    icon: <MessageCircle size={24} />,

    items: [
      "1-to-1 conversations",
      "Real-time messaging",
      "Voice messages",
    ],
  },

  {
    label: "COMMUNITIES",
    title: "A space for group conversations.",
    text:
      "Communities provide a different way to communicate. Instead of a private conversation between two people, members can participate in a shared group space.",

    icon: <Users size={24} />,

    items: [
      "Discover communities",
      "Join communities",
      "Community conversations",
    ],
  },
];

/* =========================================================
   JOURNEY CARD
========================================================= */

const JourneyCard = ({ step, index }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
      }}
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "90px 1fr",
        gap: 24,
        padding: "28px 30px",
        borderRadius: 24,
        border: "1px solid rgba(255,255,255,.07)",
        background: "rgba(255,255,255,.025)",
        overflow: "hidden",
      }}
    >
      {/* Glow */}

      <div
        style={{
          position: "absolute",
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "var(--glow)",
          filter: "blur(70px)",
          opacity: 0.15,
          top: -80,
          right: -80,
          pointerEvents: "none",
        }}
      />

      {/* Number */}

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, var(--accent), var(--accent2))",
            boxShadow: "0 8px 25px var(--glow)",
          }}
        >
          {step.icon}
        </div>

        <div
          style={{
            marginTop: 12,
            fontFamily: "monospace",
            fontSize: 9,
            color: "rgba(255,255,255,.25)",
            letterSpacing: ".12em",
          }}
        >
          {step.number}
        </div>
      </div>

      {/* Content */}

      <div
        style={{
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            letterSpacing: ".15em",
            color: "var(--accent)",
            marginBottom: 10,
          }}
        >
          {step.eyebrow}
        </div>

        <h3
          style={{
            margin: 0,
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(22px, 4vw, 30px)",
            lineHeight: 1.05,
            letterSpacing: "-.04em",
          }}
        >
          {step.title}
        </h3>

        <p
          style={{
            margin: "14px 0 18px",
            color: "rgba(255,255,255,.43)",
            fontSize: 13.5,
            lineHeight: 1.7,
            maxWidth: 520,
          }}
        >
          {step.description}
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {step.points.map((point) => (
            <div
              key={point}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "7px 10px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,.06)",
                background: "rgba(255,255,255,.025)",
                color: "rgba(255,255,255,.55)",
                fontSize: 10,
              }}
            >
              <CheckCircle2
                size={12}
                style={{
                  color: "var(--accent)",
                }}
              />

              {point}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/* =========================================================
   QUICK GUIDE ITEM
========================================================= */

const QuickGuideItem = ({ item, index }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
        delay: index * 0.07,
      }}
      style={{
        padding: "20px",
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,.06)",
        background: "rgba(255,255,255,.018)",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(124,106,247,.12)",
          border: "1px solid rgba(124,106,247,.2)",
          color: "var(--accent2)",
          marginBottom: 14,
        }}
      >
        {item.icon}
      </div>

      <h4
        style={{
          margin: "0 0 7px",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        {item.title}
      </h4>

      <p
        style={{
          margin: 0,
          color: "rgba(255,255,255,.38)",
          fontSize: 12,
          lineHeight: 1.65,
        }}
      >
        {item.text}
      </p>
    </motion.div>
  );
};

/* =========================================================
   PRIVACY ITEM
========================================================= */

const PrivacyItem = ({ item, index }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -15,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: 0.4,
        delay: index * 0.07,
      }}
      style={{
        display: "flex",
        gap: 16,
        padding: "22px 0",
        borderBottom:
          index !== privacyItems.length - 1
            ? "1px solid rgba(255,255,255,.06)"
            : "none",
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 13,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, rgba(124,106,247,.18), rgba(124,106,247,.05))",
          border: "1px solid rgba(124,106,247,.2)",
          color: "var(--accent2)",
        }}
      >
        {item.icon}
      </div>

      <div>
        <h4
          style={{
            margin: "0 0 6px",
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          {item.title}
        </h4>

        <p
          style={{
            margin: 0,
            color: "rgba(255,255,255,.4)",
            fontSize: 13,
            lineHeight: 1.65,
          }}
        >
          {item.desc}
        </p>
      </div>
    </motion.div>
  );
};

/* =========================================================
   FEATURE GROUP
========================================================= */

const FeatureGroup = ({ group, index }) => {
  return (
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
        duration: 0.45,
        delay: index * 0.08,
      }}
      style={{
        position: "relative",
        padding: "26px",
        borderRadius: 22,
        border: "1px solid rgba(255,255,255,.07)",
        background: "rgba(255,255,255,.025)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "var(--glow)",
          filter: "blur(70px)",
          opacity: 0.12,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 15,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, var(--accent), var(--accent2))",
            boxShadow: "0 7px 22px var(--glow)",
            marginBottom: 20,
          }}
        >
          {group.icon}
        </div>

        <div
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            color: "var(--accent)",
            letterSpacing: ".14em",
            marginBottom: 8,
          }}
        >
          {group.label}
        </div>

        <h3
          style={{
            margin: 0,
            fontFamily: "Syne, sans-serif",
            fontSize: 23,
            lineHeight: 1.1,
            letterSpacing: "-.035em",
          }}
        >
          {group.title}
        </h3>

        <p
          style={{
            margin: "12px 0 20px",
            color: "rgba(255,255,255,.4)",
            fontSize: 12.5,
            lineHeight: 1.7,
          }}
        >
          {group.text}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 9,
          }}
        >
          {group.items.map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "rgba(255,255,255,.55)",
                fontSize: 11,
              }}
            >
              <CheckCircle2
                size={13}
                style={{
                  color: "var(--accent)",
                }}
              />

              {item}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/* =========================================================
   MAIN PAGE
========================================================= */

const InstructionsPage = () => {
  const [activeTab, setActiveTab] = useState("how");
  const [mounted, setMounted] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "70px 24px 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <motion.main
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: mounted ? 1 : 0,
          y: mounted ? 0 : 30,
        }}
        transition={{
          duration: 0.6,
        }}
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 820,
          margin: "0 auto",
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <header
          style={{
            textAlign: "center",
            marginBottom: 42,
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.4,
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "7px 15px",
              borderRadius: 999,
              marginBottom: 20,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: ".13em",
              textTransform: "uppercase",
            }}
            className="glass"
          >
            <Sparkles size={11} />

            Getting Started
          </motion.div>

            {/* title */}
         <motion.h1
            className="hero-title"
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.1,
            }}
            style={{
              fontSize: "clamp(40px, 8vw, 62px)",
              marginBottom: 16,
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            Welcome to{" "}
            <span
              style={{
                whiteSpace: "nowrap",
              }}
            >
              Zingle
              <span
                style={{
                  color: "var(--accent)",
                }}
              >
                ee
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.45,
              delay: 0.18,
            }}
            style={{
              maxWidth: 540,
              margin: "0 auto",
              color: "rgba(255,255,255,.42)",
              fontSize: 15,
              lineHeight: 1.7,
            }}
          >
            Learn how to find people, build connections, start private
            conversations, join communities, and keep control of your
            Zingleee experience.
          </motion.p>
        </header>

        {/* =================================================
            TABS
        ================================================= */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 36,
          }}
        >
          <div
            className="glass"
            style={{
              display: "flex",
              gap: 4,
              padding: 5,
              borderRadius: 999,
              maxWidth: "100%",
              overflowX: "auto",
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "9px 18px",
                  borderRadius: 999,
                  border: "none",
                  whiteSpace: "nowrap",
                  fontFamily: "Outfit, sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all .25s ease",

                  background:
                    activeTab === tab.id
                      ? "linear-gradient(135deg, var(--accent), var(--accent2))"
                      : "transparent",

                  color:
                    activeTab === tab.id
                      ? "#fff"
                      : "rgba(255,255,255,.42)",

                  boxShadow:
                    activeTab === tab.id
                      ? "0 4px 15px var(--glow)"
                      : "none",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* =================================================
            TAB CONTENT
        ================================================= */}

        <AnimatePresence mode="wait">
          {/* =================================================
              HOW IT WORKS
          ================================================= */}

          {activeTab === "how" && (
            <motion.div
              key="how"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -15,
              }}
              transition={{
                duration: 0.3,
              }}
            >
              {/* Intro */}

              <div
                style={{
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: 9,
                    letterSpacing: ".15em",
                    color: "var(--accent)",
                    marginBottom: 9,
                  }}
                >
                  THE ZINGLEEE FLOW
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontFamily: "Syne, sans-serif",
                    fontSize: "clamp(28px, 5vw, 40px)",
                    letterSpacing: "-.045em",
                    lineHeight: 1,
                  }}
                >
                  From finding someone
                  <br />
                  to having a conversation.
                </h2>
              </div>

              {/* Main journey */}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                {journeySteps.map((step, index) => (
                  <JourneyCard
                    key={step.number}
                    step={step}
                    index={index}
                  />
                ))}
              </div>

              {/* Quick guide */}

              <section
                style={{
                  marginTop: 60,
                }}
              >
                <div
                  style={{
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: 9,
                      letterSpacing: ".15em",
                      color: "var(--accent)",
                      marginBottom: 8,
                    }}
                  >
                    QUICK GUIDE
                  </div>

                  <h2
                    style={{
                      margin: 0,
                      fontFamily: "Syne, sans-serif",
                      fontSize: 28,
                      letterSpacing: "-.04em",
                    }}
                  >
                    A few things worth knowing.
                  </h2>
                </div>

                <div
                  className="quick-guide-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(2, minmax(0, 1fr))",
                    gap: 12,
                  }}
                >
                  {quickGuide.map((item, index) => (
                    <QuickGuideItem
                      key={item.title}
                      item={item}
                      index={index}
                    />
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* =================================================
              PRIVACY
          ================================================= */}

          {activeTab === "privacy" && (
            <motion.div
              key="privacy"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -15,
              }}
              transition={{
                duration: 0.3,
              }}
            >
              <section
                style={{
                  padding: "30px",
                  borderRadius: 24,
                  border: "1px solid rgba(255,255,255,.07)",
                  background: "rgba(255,255,255,.025)",
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 15,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(135deg, var(--accent), var(--accent2))",
                    boxShadow: "0 8px 25px var(--glow)",
                    marginBottom: 22,
                  }}
                >
                  <Lock size={23} />
                </div>

                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: 9,
                    letterSpacing: ".15em",
                    color: "var(--accent)",
                    marginBottom: 9,
                  }}
                >
                  PRIVACY & SAFETY
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontFamily: "Syne, sans-serif",
                    fontSize: "clamp(30px, 6vw, 44px)",
                    lineHeight: 1,
                    letterSpacing: "-.05em",
                  }}
                >
                  You decide
                  <br />
                  who gets in.
                </h2>

                <p
                  style={{
                    maxWidth: 560,
                    margin: "17px 0 0",
                    color: "rgba(255,255,255,.4)",
                    fontSize: 13,
                    lineHeight: 1.75,
                  }}
                >
                  Zingleee is built around controlled connections. Understand
                  how private conversations, communities, account security,
                  and user controls work before you start communicating.
                </p>
              </section>

              <div
                style={{
                  padding: "0 8px",
                }}
              >
                {privacyItems.map((item, index) => (
                  <PrivacyItem
                    key={item.title}
                    item={item}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* =================================================
              FEATURES
          ================================================= */}

          {activeTab === "features" && (
            <motion.div
              key="features"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -15,
              }}
              transition={{
                duration: 0.3,
              }}
            >
              <div
                style={{
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: 9,
                    letterSpacing: ".15em",
                    color: "var(--accent)",
                    marginBottom: 9,
                  }}
                >
                  INSIDE ZINGLEEE
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontFamily: "Syne, sans-serif",
                    fontSize: "clamp(30px, 6vw, 44px)",
                    lineHeight: 1,
                    letterSpacing: "-.05em",
                  }}
                >
                  Built around
                  <br />
                  real conversations.
                </h2>

                <p
                  style={{
                    maxWidth: 540,
                    margin: "15px 0 0",
                    color: "rgba(255,255,255,.4)",
                    fontSize: 13,
                    lineHeight: 1.7,
                  }}
                >
                  Zingleee combines private connections and community spaces
                  so you can choose the right environment for every
                  conversation.
                </p>
              </div>

              <div
                className="feature-groups-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(3, minmax(0, 1fr))",
                  gap: 12,
                }}
              >
                {featureGroups.map((group, index) => (
                  <FeatureGroup
                    key={group.label}
                    group={group}
                    index={index}
                  />
                ))}
              </div>

              {/* Real-time note */}

              <div
                style={{
                  marginTop: 14,
                  padding: "20px 22px",
                  borderRadius: 20,
                  border: "1px solid rgba(255,255,255,.06)",
                  background: "rgba(255,255,255,.018)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                }}
              >
                <Zap
                  size={19}
                  style={{
                    color: "var(--accent)",
                    marginTop: 2,
                    flexShrink: 0,
                  }}
                />

                <div>
                  <h4
                    style={{
                      margin: "0 0 5px",
                      fontSize: 14,
                    }}
                  >
                    Real-time experience
                  </h4>

                  <p
                    style={{
                      margin: 0,
                      color: "rgba(255,255,255,.37)",
                      fontSize: 12,
                      lineHeight: 1.65,
                    }}
                  >
                    Messaging and conversation updates are designed to happen
                    in real time, so you can communicate without repeatedly
                    refreshing the application.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =================================================
            FOOTER CTA
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
            delay: 0.35,
          }}
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 55,
          }}
        >
          <motion.button
            type="button"
            onClick={() => navigate(-1)}
            whileHover={{
              y: -3,
            }}
            whileTap={{
              scale: 0.97,
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              padding: "12px 20px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,.08)",
              background: "rgba(255,255,255,.025)",
              color: "rgba(255,255,255,.7)",
              cursor: "pointer",
              fontFamily: "Outfit, sans-serif",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            Back to Zingleee

            <ChevronRight size={15} />
          </motion.button>
        </motion.div>
      </motion.main>

    </div>
  );
};

export default InstructionsPage;