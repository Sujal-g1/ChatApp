import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Shield,
  Lock,
  UserRound,
  MessageCircle,
  Users,
  Database,
  KeyRound,
  Trash2,
  Settings,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ZingleeeLogo } from "./LandingPage";

const PrivacyPage = () => {
  const navigate = useNavigate();

  const particles = useMemo(
    () =>
      Array.from({ length: 45 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 18 + Math.random() * 16,
        size: 0.5 + Math.random() * 2,
        opacity: 0.04 + Math.random() * 0.22,
      })),
    []
  );

const handleBack = () => {
  navigate(-1);
};

  const sections = [
    {
      number: "01",
      title: "What This Policy Covers",
      icon: <Shield size={18} />,
      content: (
        <>
          <p>
            This Privacy Policy explains how Zingleee collects, uses,
            stores, protects, and manages information when you use the
            Zingleee platform.
          </p>

          <p>
            Zingleee includes private messaging, profiles, communities,
            media, voice and video communication, authentication, and
            other features that may be introduced as the platform evolves.
          </p>

          <p>
            By using Zingleee, you acknowledge that information may be
            processed as described in this Privacy Policy.
          </p>
        </>
      ),
    },

    {
      number: "02",
      title: "Information You Provide",
      icon: <UserRound size={18} />,
      content: (
        <>
          <p>
            When you create and use a Zingleee account, you may provide
            information such as:
          </p>

          <ul>
            <li>Email address.</li>
            <li>Username.</li>
            <li>Zinglee ID.</li>
            <li>Profile information.</li>
            <li>Profile image or other profile media.</li>
            <li>Authentication information.</li>
            <li>Community information and preferences.</li>
          </ul>

          <p>
            The exact information collected may depend on the features
            you choose to use.
          </p>
        </>
      ),
    },

    {
      number: "03",
      title: "Messages & Encrypted Content",
      icon: <MessageCircle size={18} />,
      content: (
        <>
          <p>
            Zingleee is designed to support private communication and,
            for applicable messaging features, end-to-end encryption.
          </p>

          <p>
            When end-to-end encryption is used, message content is
            encrypted on the user's device before it is transmitted.
            The server may therefore receive encrypted message data
            rather than readable message content.
          </p>

          <p>
            This does not mean that every piece of information associated
            with a conversation is encrypted or inaccessible to the
            service. Technical information and certain metadata may still
            be processed to operate the platform.
          </p>

          <p>
            The exact privacy properties of a feature depend on its
            implementation. We will not describe a feature as
            end-to-end encrypted unless it is actually designed and
            implemented that way.
          </p>
        </>
      ),
    },

    {
      number: "04",
      title: "Encryption Keys",
      icon: <KeyRound size={18} />,
      content: (
        <>
          <p>
            Zingleee may use cryptographic key pairs to enable secure
            communication.
          </p>

          <p>
            A public key may be stored or made available through the
            Zingleee backend so that other users can establish encrypted
            communication with you.
          </p>

          <p>
            Private encryption keys are intended to remain under the
            user's control and, where applicable, may be stored locally
            on the user's device rather than being transmitted to the
            Zingleee server.
          </p>

          <p>
            You are responsible for protecting your device and any local
            data used to access encrypted communications.
          </p>
        </>
      ),
    },

    {
      number: "05",
      title: "Communities & Social Information",
      icon: <Users size={18} />,
      content: (
        <>
          <p>
            If you use Zingleee communities, we may process information
            required to operate those communities.
          </p>

          <p>This may include:</p>

          <ul>
            <li>Community memberships.</li>
            <li>Community roles and permissions.</li>
            <li>Community posts and discussions.</li>
            <li>Membership requests.</li>
            <li>Community administration information.</li>
            <li>Moderation and reporting information.</li>
          </ul>

          <p>
            Information shared inside a community may be visible to
            other members according to that community's visibility and
            permissions.
          </p>
        </>
      ),
    },

    {
      number: "06",
      title: "Friends, Requests & Blocking",
      icon: <UserRound size={18} />,
      content: (
        <>
          <p>
            Zingleee may process information about relationships between
            users in order to provide social and messaging features.
          </p>

          <p>
            Depending on the features you use, this may include friend
            requests, accepted connections, blocked users, and other
            relationship or permission information.
          </p>

          <p>
            This information is necessary for features such as deciding
            who can communicate with you and which users appear in your
            communication interfaces.
          </p>
        </>
      ),
    },

    {
      number: "07",
      title: "Technical Information",
      icon: <Database size={18} />,
      content: (
        <>
          <p>
            When you use Zingleee, technical information may be processed
            to provide, maintain, secure, and troubleshoot the service.
          </p>

          <p>
            Depending on the implementation and environment, this may
            include information such as:
          </p>

          <ul>
            <li>IP address.</li>
            <li>Browser and device information.</li>
            <li>Operating system information.</li>
            <li>Authentication and session information.</li>
            <li>Application logs.</li>
            <li>Error and diagnostic information.</li>
            <li>Network and service activity information.</li>
          </ul>

          <p>
            We aim to collect only information reasonably necessary for
            operating, securing, and improving the platform.
          </p>
        </>
      ),
    },

    {
      number: "08",
      title: "How We Use Information",
      icon: <Settings size={18} />,
      content: (
        <>
          <p>
            Information processed by Zingleee may be used to:
          </p>

          <ul>
            <li>Create and manage your account.</li>
            <li>Authenticate you.</li>
            <li>Provide messaging and communication features.</li>
            <li>Operate communities.</li>
            <li>Enable security and encryption features.</li>
            <li>Prevent abuse, fraud, and unauthorized access.</li>
            <li>Diagnose technical problems.</li>
            <li>Maintain and improve the service.</li>
            <li>Respond to support requests.</li>
            <li>Meet applicable legal obligations.</li>
          </ul>

          <p>
            Zingleee does not need access to readable encrypted message
            content in order to provide the basic infrastructure for
            encrypted communication.
          </p>
        </>
      ),
    },

    {
      number: "09",
      title: "Cookies & Local Storage",
      icon: <Database size={18} />,
      content: (
        <>
          <p>
            Zingleee may use browser storage technologies such as cookies,
            local storage, or IndexedDB where necessary to provide
            authentication, application functionality, preferences, or
            security features.
          </p>

          <p>
            Certain cryptographic information may also be stored locally
            on your device when required by the encryption architecture.
          </p>

          <p>
            Removing browser storage may cause certain features to stop
            working or may require you to authenticate again.
          </p>
        </>
      ),
    },

    {
      number: "10",
      title: "Data Retention",
      icon: <FileText size={18} />,
      content: (
        <>
          <p>
            We retain information for as long as reasonably necessary to
            provide the service, maintain security, comply with legal
            obligations, resolve disputes, and enforce our agreements.
          </p>

          <p>
            Different types of information may have different retention
            periods.
          </p>

          <p>
            Some Zingleee features may also use automatic deletion or
            expiration mechanisms for certain types of content.
          </p>
        </>
      ),
    },

    {
      number: "11",
      title: "Account Deletion",
      icon: <Trash2 size={18} />,
      content: (
        <>
          <p>
            You may request deletion of your Zingleee account and
            associated personal information through the mechanisms made
            available by the service.
          </p>

          <p>
            Deleting an account does not necessarily mean that every
            piece of information is immediately removed from every
            system.
          </p>

          <p>
            Certain information may need to be retained for security,
            fraud prevention, legal compliance, dispute resolution, or
            other legitimate purposes.
          </p>
        </>
      ),
    },

    {
      number: "12",
      title: "Data Security",
      icon: <Lock size={18} />,
      content: (
        <>
          <p>
            We use reasonable technical and organizational measures to
            protect information handled by Zingleee.
          </p>

          <p>
            Security measures may include authentication controls,
            access restrictions, encryption, secure communication
            protocols, and other measures appropriate to the service.
          </p>

          <p>
            However, no internet-connected service can guarantee absolute
            security. You should also protect your account, device,
            credentials, and local storage.
          </p>
        </>
      ),
    },

    {
      number: "13",
      title: "Third-Party Services",
      icon: <ArrowUpRight size={18} />,
      content: (
        <>
          <p>
            Zingleee may rely on third-party infrastructure and services
            to provide parts of the platform.
          </p>

          <p>
            Depending on the features and environment, these services
            may include authentication providers, hosting infrastructure,
            databases, analytics or monitoring systems, communication
            infrastructure, and other technical providers.
          </p>

          <p>
            Third-party providers may process information according to
            their own privacy policies and contractual obligations.
          </p>
        </>
      ),
    },

    {
      number: "14",
      title: "Children & Age Requirements",
      icon: <UserRound size={18} />,
      content: (
        <>
          <p>
            Zingleee is not intended for users who are not legally
            permitted to use online communication services under the
            applicable laws in their jurisdiction.
          </p>

          <p>
            Users should provide accurate information regarding their
            eligibility to use the service.
          </p>

          <p>
            If we become aware that information has been collected from
            a person who is not permitted to use the service, we may
            take appropriate steps to address the situation.
          </p>
        </>
      ),
    },

    {
      number: "15",
      title: "Your Privacy Choices",
      icon: <Settings size={18} />,
      content: (
        <>
          <p>
            Depending on your jurisdiction, you may have rights relating
            to your personal information, including rights to access,
            correct, delete, restrict, or otherwise manage certain
            information.
          </p>

          <p>
            The availability of these rights depends on applicable law
            and the circumstances of the request.
          </p>

          <p>
            You may contact Zingleee to ask questions about your
            information or to submit an appropriate privacy request.
          </p>
        </>
      ),
    },

    {
      number: "16",
      title: "Changes to This Policy",
      icon: <FileText size={18} />,
      content: (
        <>
          <p>
            This Privacy Policy may change as Zingleee develops, adds
            features, changes its technical architecture, or responds to
            legal and operational requirements.
          </p>

          <p>
            When significant changes are made, we may provide appropriate
            notice or require users to review an updated policy.
          </p>

          <p>
            The date displayed at the top of this page indicates when
            this Privacy Policy was most recently updated.
          </p>
        </>
      ),
    },

    {
      number: "17",
      title: "Contact Zingleee",
      icon: <MessageCircle size={18} />,
      content: (
        <>
          <p>
            If you have questions about this Privacy Policy, your
            information, account privacy, or a privacy-related request,
            you can contact Zingleee through the official contact
            channel provided by the service.
          </p>

          <p>
            We will publish the appropriate privacy contact information
            as Zingleee establishes its formal privacy and support
            process.
          </p>
        </>
      ),
    },
  ];

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
        {/* =====================================================
            TOP NAVIGATION
        ===================================================== */}

        <div
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            right: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 20,
          }}
        >
          {/* Back button  */}
          <motion.button
            type="button"
            onClick={handleBack}
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

          <div
            style={{
              color: "rgba(255,255,255,.25)",
              fontFamily: "monospace",
              fontSize: 9,
              letterSpacing: ".12em",
            }}
          >
            ZINGLEEE / PRIVACY
          </div>
        </div>

        {/* =====================================================
            HERO
        ===================================================== */}

        <section
          style={{
            minHeight: "78vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "130px 24px 90px",
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
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  boxShadow: "0 0 12px var(--glow)",
                }}
              />

              ZINGLEEE / PRIVACY
            </div>

            <h1
              style={{
                margin: "30px 0 0",
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(50px, 10vw, 105px)",
                lineHeight: 0.9,
                letterSpacing: "-0.075em",
                maxWidth: 850,
              }}
            >
              Your data.
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent2))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Your control.
              </span>
            </h1>

            <p
              style={{
                maxWidth: 560,
                marginTop: 32,
                color: "rgba(255,255,255,.45)",
                fontSize: 16,
                lineHeight: 1.9,
              }}
            >
              Privacy at Zingleee is about being clear about what
              information is handled, why it is needed, and how
              communication is protected.
            </p>

            <div
              style={{
                marginTop: 30,
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 13px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,.07)",
                  background: "rgba(255,255,255,.025)",
                  color: "rgba(255,255,255,.3)",
                  fontFamily: "monospace",
                  fontSize: 10,
                }}
              >
                <FileText size={12} />
                EFFECTIVE: AUG 18, 2026
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 13px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,.07)",
                  background: "rgba(255,255,255,.025)",
                  color: "rgba(255,255,255,.3)",
                  fontFamily: "monospace",
                  fontSize: 10,
                }}
              >
                <Lock size={12} />
                PRIVACY FIRST
              </div>
            </div>
          </motion.div>
        </section>

        {/* =====================================================
            INTRO
        ===================================================== */}

        <section
          style={{
            padding: "100px 24px 120px",
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
              A NOTE ON PRIVACY
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
              We should tell you
              <br />
              what we know.
            </h2>

            <div
              style={{
                marginTop: 35,
                color: "rgba(255,255,255,.52)",
                fontSize: 16,
                lineHeight: 2,
              }}
            >
              <p>
                Zingleee is a communication platform. That means some
                information has to be processed for accounts,
                authentication, messaging, communities, and security
                to work.
              </p>

              <p>
                This policy exists to make that process understandable
                instead of hiding it behind vague language.
              </p>

              <p
                style={{
                  color: "rgba(255,255,255,.8)",
                  fontFamily: "Syne, sans-serif",
                  fontSize: 20,
                  lineHeight: 1.6,
                }}
              >
                Privacy starts with knowing what is happening.
              </p>
            </div>
          </motion.div>
        </section>

        {/* =====================================================
            PRIVACY SECTIONS
        ===================================================== */}

        <section
          style={{
            padding: "40px 24px 100px",
          }}
        >
          <div
            style={{
              maxWidth: 760,
            }}
          >
            <div
              style={{
                color: "var(--accent)",
                fontFamily: "monospace",
                fontSize: 11,
                letterSpacing: ".12em",
                marginBottom: 50,
              }}
            >
              PRIVACY POLICY
            </div>

            {sections.map((section, index) => (
              <motion.article
                key={section.number}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.12,
                }}
                transition={{
                  duration: 0.55,
                  delay: Math.min(index * 0.03, 0.15),
                }}
                style={{
                  padding: "0 0 55px",
                  marginBottom: 55,
                  borderBottom:
                    "1px solid rgba(255,255,255,.06)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 15,
                    marginBottom: 25,
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
                    {section.number}
                  </span>

                  <span
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--accent)",
                      border:
                        "1px solid rgba(255,255,255,.07)",
                      background: "rgba(255,255,255,.025)",
                    }}
                  >
                    {section.icon}
                  </span>

                  <h2
                    style={{
                      margin: 0,
                      fontFamily: "Syne, sans-serif",
                      fontWeight: 700,
                      fontSize: "clamp(21px, 4vw, 30px)",
                      lineHeight: 1.1,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {section.title}
                  </h2>
                </div>

                <div
                  style={{
                    paddingLeft: "clamp(0px, 6vw, 70px)",
                    color: "rgba(255,255,255,.46)",
                    fontSize: 15,
                    lineHeight: 1.95,
                  }}
                >
                  {section.content}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* =====================================================
            FINAL
        ===================================================== */}

        <section
          style={{
            minHeight: "65vh",
            padding: "80px 24px 120px",
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
              Privacy isn't
              <br />
              <span
                style={{
                  color: "var(--accent)",
                }}
              >
                an afterthought.
              </span>
            </h2>

            <p
              style={{
                maxWidth: 520,
                margin: "28px auto 0",
                color: "rgba(255,255,255,.3)",
                fontFamily: "monospace",
                fontSize: 10,
                lineHeight: 1.8,
                letterSpacing: ".1em",
              }}
            >
              ZINGLEEE / PRIVACY / TRANSPARENCY
            </p>

            <motion.button
              type="button"
              onClick={handleBack}
              whileHover={{
                y: -3,
                backgroundColor: "rgba(255,255,255,.07)",
              }}
              whileTap={{
                scale: 0.96,
              }}
              style={{
                marginTop: 35,
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                padding: "11px 18px",
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
              Back to Zingleee
            </motion.button>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default PrivacyPage;