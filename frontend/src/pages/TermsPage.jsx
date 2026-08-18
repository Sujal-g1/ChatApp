import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Shield,
  MessageCircle,
  Users,
  Lock,
  AlertTriangle,
  UserRound,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ZingleeeLogo } from "./LandingPage";

const TermsPage = () => {
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
      title: "Acceptance of Terms",
      icon: <Check size={18} />,
      content: (
        <>
          <p>
            Welcome to Zingleee. These Terms & Conditions govern your access
            to and use of the Zingleee platform, including its messaging,
            communities, profile, media, voice, video, and related features.
          </p>

          <p>
            By creating an account or using Zingleee, you acknowledge that you
            have read, understood, and agreed to these Terms & Conditions.
          </p>

          <p>
            If you do not agree with these terms, you should not create an
            account or continue using Zingleee.
          </p>
        </>
      ),
    },

    {
      number: "02",
      title: "Your Zingleee Account",
      icon: <UserRound size={18} />,
      content: (
        <>
          <p>
            To use certain features of Zingleee, you may need to create an
            account. You are responsible for providing information that is
            accurate and reasonably up to date.
          </p>

          <p>
            Your Zinglee ID and account credentials are intended for your own
            use. You should take reasonable steps to protect your account and
            authentication information.
          </p>

          <p>
            You must not impersonate another person, create an account
            intended to deceive others, or use another person's account
            without authorization.
          </p>
        </>
      ),
    },

    {
      number: "03",
      title: "Messaging & Communication",
      icon: <MessageCircle size={18} />,
      content: (
        <>
          <p>
            Zingleee allows users to communicate through private messages and
            other communication features. You are responsible for the content
            you choose to send, upload, share, or otherwise make available
            through the platform.
          </p>

          <p>
            You must not use Zingleee to harass, threaten, intimidate, defraud,
            impersonate, or deliberately harm another person.
          </p>

          <p>
            You must also not use the platform to distribute malicious
            software, phishing links, spam, or content that violates
            applicable law.
          </p>
        </>
      ),
    },

    {
      number: "04",
      title: "Privacy & Encryption",
      icon: <Lock size={18} />,
      content: (
        <>
          <p>
            Privacy is an important part of how Zingleee is designed.
            Depending on the feature, Zingleee may use encryption and
            cryptographic technologies to protect communications.
          </p>

          <p>
            Certain private messages are designed to use end-to-end
            encryption. This means message content may be encrypted on the
            user's device before being transmitted.
          </p>

          <p>
            Encryption does not mean that every piece of information
            associated with your account is invisible to Zingleee. Account
            information, public keys, technical information, and certain
            service metadata may still be processed as necessary to operate,
            secure, and improve the service.
          </p>

          <p>
            For more information about how information is collected, used,
            stored, and protected, please review the Zingleee Privacy Policy.
          </p>
        </>
      ),
    },

    {
      number: "05",
      title: "Communities",
      icon: <Users size={18} />,
      content: (
        <>
          <p>
            Zingleee communities are spaces where people can gather around
            shared interests, ideas, projects, and discussions.
          </p>

          <p>
            Community owners, administrators, and moderators may establish
            additional rules for their communities and may manage membership,
            permissions, and moderation.
          </p>

          <p>
            Joining a community does not give you permission to abuse,
            harass, expose private information about, or otherwise harm other
            members.
          </p>

          <p>
            Community-specific rules may apply in addition to these Terms.
          </p>
        </>
      ),
    },

    {
      number: "06",
      title: "User Content",
      icon: <FileText size={18} />,
      content: (
        <>
          <p>
            You retain ownership of content that you create and submit to
            Zingleee, subject to the rights necessary for Zingleee to operate
            the service.
          </p>

          <p>
            By submitting content through features that require storage,
            transmission, or display, you grant Zingleee the limited
            permissions necessary to provide those features to you and other
            users as intended.
          </p>

          <p>
            You are responsible for ensuring that you have the necessary
            rights to share content that you upload or transmit.
          </p>
        </>
      ),
    },

    {
      number: "07",
      title: "Prohibited Conduct",
      icon: <AlertTriangle size={18} />,
      content: (
        <>
          <p>You agree not to use Zingleee to:</p>

          <ul>
            <li>Harass, threaten, stalk, or intimidate other users.</li>
            <li>
              Impersonate another person, organization, or Zingleee
              representative.
            </li>
            <li>Conduct scams, fraud, phishing, or other deceptive activity.</li>
            <li>
              Distribute malware, malicious code, or links designed to
              compromise another person's device or account.
            </li>
            <li>
              Attempt to gain unauthorized access to accounts, systems, or
              data.
            </li>
            <li>
              Share private or personally identifying information about
              another person without appropriate authorization.
            </li>
            <li>Use Zingleee for unlawful activities.</li>
            <li>
              Deliberately interfere with or disrupt the operation of the
              platform.
            </li>
          </ul>
        </>
      ),
    },

    {
      number: "08",
      title: "Blocking & Reporting",
      icon: <Shield size={18} />,
      content: (
        <>
          <p>
            Zingleee may provide tools that allow users to block or report
            other users or content.
          </p>

          <p>
            You should use these tools when you encounter behavior that
            violates these Terms, applicable law, or community rules.
          </p>

          <p>
            Reports may be reviewed and appropriate action may be taken based
            on the circumstances and information available to Zingleee.
          </p>
        </>
      ),
    },

    {
      number: "09",
      title: "Account Suspension & Termination",
      icon: <AlertTriangle size={18} />,
      content: (
        <>
          <p>
            Zingleee may restrict, suspend, or terminate an account when
            reasonably necessary to protect users, the platform, or the
            integrity of the service, including where these Terms are
            violated.
          </p>

          <p>
            You may stop using Zingleee at any time and may request deletion
            of your account subject to applicable retention requirements and
            technical limitations.
          </p>

          <p>
            Some information may need to be retained for security, fraud
            prevention, legal compliance, dispute resolution, or other
            legitimate purposes.
          </p>
        </>
      ),
    },

    {
      number: "10",
      title: "Service Availability",
      icon: <Shield size={18} />,
      content: (
        <>
          <p>
            Zingleee is continuously evolving. Features may be added,
            changed, temporarily unavailable, or removed as the platform
            develops.
          </p>

          <p>
            We do not guarantee that the service will always be available,
            uninterrupted, error-free, or compatible with every device or
            software environment.
          </p>

          <p>
            Maintenance, technical failures, security incidents, third-party
            service interruptions, or circumstances outside our reasonable
            control may affect availability.
          </p>
        </>
      ),
    },

    {
      number: "11",
      title: "Security",
      icon: <Lock size={18} />,
      content: (
        <>
          <p>
            We work to protect Zingleee and its users through appropriate
            technical and organizational measures.
          </p>

          <p>
            However, no internet-connected system can be guaranteed to be
            completely secure. You acknowledge that using an online service
            involves certain security risks.
          </p>

          <p>
            If you believe that your account or the platform has been
            compromised, you should contact us as soon as reasonably
            possible.
          </p>
        </>
      ),
    },

    {
      number: "12",
      title: "Changes to These Terms",
      icon: <FileText size={18} />,
      content: (
        <>
          <p>
            These Terms may be updated as Zingleee develops, new features are
            introduced, or legal and operational requirements change.
          </p>

          <p>
            When changes are significant, we may provide an appropriate notice
            or require users to review and accept the updated terms before
            continuing to use certain parts of the service.
          </p>

          <p>
            The date shown at the top of this page indicates when these Terms
            were most recently updated.
          </p>
        </>
      ),
    },

    {
      number: "13",
      title: "Contact Zingleee",
      icon: <MessageCircle size={18} />,
      content: (
        <>
          <p>
            If you have questions about these Terms, the Zingleee platform,
            account issues, or legal matters relating to the service, you can
            contact us through our official Zingleee contact channel.
          </p>

          <p>
            We will publish the appropriate contact information as the service
            establishes its formal support and legal contact process.
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
            ZINGLEEE / LEGAL
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
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  boxShadow: "0 0 12px var(--glow)",
                }}
              />

              ZINGLEEE / TERMS
            </div>

            <h1
              style={{
                margin: "30px 0 0",
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(52px, 10vw, 105px)",
                lineHeight: 0.9,
                letterSpacing: "-0.075em",
                maxWidth: 850,
              }}
            >
              The rules
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent2))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                matter.
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
              These Terms & Conditions explain how Zingleee works,
              what you can expect from the platform, and what we
              expect from you.
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
                <Shield size={12} />
                ZINGLEEE
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
              BEFORE YOU BEGIN
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
              Zingleee is built
              <br />
              for people.
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
                Zingleee is a communication platform designed to
                bring private conversations and communities together.
              </p>

              <p>
                These terms exist so that everyone understands the
                boundaries of the platform and the responsibilities
                that come with using it.
              </p>

              <p
                style={{
                  color: "rgba(255,255,255,.8)",
                  fontFamily: "Syne, sans-serif",
                  fontSize: 20,
                  lineHeight: 1.6,
                }}
              >
                Use Zingleee to connect. Don't use it to harm.
              </p>
            </div>
          </motion.div>
        </section>

        {/* =====================================================
            TERMS SECTIONS
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
              TERMS & CONDITIONS
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
                      boxShadow: "0 0 20px rgba(255,255,255,.02)",
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
            FINAL MESSAGE
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
              Connect
              <br />
              <span
                style={{
                  color: "var(--accent)",
                }}
              >
                responsibly.
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
              BY USING ZINGLEEE, YOU ACKNOWLEDGE THESE TERMS.
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

export default TermsPage;