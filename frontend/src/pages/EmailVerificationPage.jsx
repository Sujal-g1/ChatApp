
import React, { useContext, useEffect, useState, useRef } from "react";
import { onAuthStateChanged, } from "firebase/auth";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ZingleeeLogo } from "./LandingPage";
import { auth } from "../firebase";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const EmailVerificationPage = () => {

 const navigate = useNavigate();

  const { login } = useContext(AuthContext);
  const hasCompletedVerification = useRef(false);

  const [status, setStatus] = useState("loading");

    useEffect(() => {
  if (hasCompletedVerification.current) {
    return;
  }

  hasCompletedVerification.current = true;

  const completeEmailVerification = async () => {
    try {
    //   console.log("VERIFY PAGE - starting verification completion" );

      const user = await new Promise((resolve, reject) => {
        let finished = false;

        const unsubscribe = onAuthStateChanged(
          auth,
          (firebaseUser) => {
            if (finished) return;

            finished = true;
            unsubscribe();

            resolve(firebaseUser);
          }
        );

        setTimeout(() => {
          if (finished) return;

          finished = true;
          unsubscribe();

          reject(
            new Error(
              "Unable to restore your Firebase session."
            )
          );
        }, 10000);
      });

    //   console.log("VERIFY PAGE - Firebase user:",user );

      if (!user) {
        throw new Error(
          "Firebase session could not be restored."
        );
      }

      await user.reload();

      if (!user.emailVerified) {
        throw new Error(
          "Your email has not been verified yet."
        );
      }

    //   console.log("VERIFY PAGE - email verified:",user.emailVerified);

      // --------------------------------
      // Pending signup
      // --------------------------------

      const pendingSignupRaw =
        localStorage.getItem(
          "zingleee_pending_signup"
        );

    //   console.log("VERIFY PAGE - pending signup:",pendingSignupRaw );

      if (!pendingSignupRaw) {
        throw new Error(
          "Your signup information could not be found."
        );
      }

      const pendingSignup =
        JSON.parse(pendingSignupRaw);

      // --------------------------------
      // Firebase token
      // --------------------------------

      const token =
        await user.getIdToken(true);

    //   console.log("VERIFY PAGE - Firebase token obtained");

      // --------------------------------
      // Create Zingleee account
      // --------------------------------

      const result = await login(
        "firebase-email",
        {
          token,
          provider: "email",
          fullName:
            pendingSignup.fullName,
          username:
            pendingSignup.username,
          bio:
            pendingSignup.bio,
        }
      );

    //   console.log("VERIFY PAGE - backend result:",result);

      if (!result?.success) {
        throw new Error(
          result?.message ||
          "Unable to create your Zingleee account."
        );
      }

    //   console.log("VERIFY PAGE - Zingleee account created");

      // --------------------------------
      // Remove temporary signup data
      // --------------------------------

      localStorage.removeItem("zingleee_pending_signup");

      // --------------------------------
      // Success
      // --------------------------------

      setStatus("success");

      setTimeout(() => {
        navigate("/");
      }, 1200);

    } catch (error) {
//       console.error(
//         "EMAIL VERIFICATION ERROR:",
//         error
// );

      setStatus("error");

      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Unable to complete account creation."
      );
    }
  };

  completeEmailVerification();
}, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, var(--glow), transparent 70%)",
          filter: "blur(70px)",
          opacity: 0.3,
          pointerEvents: "none",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Card */}
      <motion.div
        initial={{
          opacity: 0,
          y: 25,
          scale: 0.97,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.45,
          ease: [0.4, 0, 0.2, 1],
        }}
        style={{
          width: "100%",
          maxWidth: 430,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: "100%",
            boxSizing: "border-box",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 28,
            padding: "42px 32px",
            boxShadow:
              "0 30px 60px rgba(0,0,0,0.45), 0 0 0 1px var(--border-color)",
            textAlign: "center",
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay: 0.1,
              duration: 0.35,
            }}
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 16,
              filter: "drop-shadow(0 0 20px var(--glow))",
            }}
          >
            <ZingleeeLogo size={58} />
          </motion.div>

          {/* Brand */}
          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: 25,
              letterSpacing: "-0.02em",
              color: "white",
              margin: "0 0 30px",
            }}
          >
            Zingle
            <span style={{ color: "var(--accent)" }}>ee</span>
          </h1>

          {/* Loading */}
          {status === "loading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div
                style={{
                  width: 68,
                  height: 68,
                  margin: "0 auto 20px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <Loader2
                  size={34}
                  color="var(--accent)"
                  style={{
                    animation: "spin 1s linear infinite",
                  }}
                />
              </div>

              <h2
                style={{
                  color: "white",
                  fontSize: 22,
                  fontWeight: 700,
                  margin: "0 0 10px",
                }}
              >
                Email verified
              </h2>

              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 14,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Preparing your Zingleee account...
              </p>
            </motion.div>
          )}

          {/* Success */}
          {status === "success" && (
            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.35,
              }}
            >
              {/* Success icon */}
              <motion.div
                initial={{
                  scale: 0.7,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                transition={{
                  delay: 0.05,
                  type: "spring",
                  stiffness: 220,
                  damping: 15,
                }}
                style={{
                  width: 72,
                  height: 72,
                  margin: "0 auto 22px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 0 30px var(--glow)",
                }}
              >
                <CheckCircle2
                  size={42}
                  color="var(--accent)"
                  strokeWidth={2}
                />
              </motion.div>

              {/* Heading */}
              <h2
                style={{
                  color: "white",
                  fontSize: 23,
                  fontWeight: 700,
                  margin: "0 0 12px",
                }}
              >
                Email verified!
              </h2>

              {/* Description */}
              <p
                style={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: 14,
                  lineHeight: 1.7,
                  margin: "0 auto 26px",
                  maxWidth: 320,
                }}
              >
                Your email address has been successfully verified.
                <br />
                <br />
                You can now return to Zingleee and finish creating your
                account.
              </p>

              {/* Return button */}
              <motion.button
                type="button"
                onClick={() => navigate("/")}
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                style={{
                  width: "100%",
                  padding: "13px 20px",
                  borderRadius: 50,
                  border: "none",
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent2))",
                  color: "white",
                  fontFamily: "Outfit, sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  boxShadow: "0 6px 24px var(--glow)",
                }}
              >
                Return to Zingleee
              </motion.button>

              {/* Small note */}
              <p
                style={{
                  color: "rgba(255,255,255,0.3)",
                  fontSize: 12,
                  lineHeight: 1.5,
                  margin: "18px 0 0",
                }}
              >
                Sign in with the email and password you used to
                create your account.
              </p>
            </motion.div>
          )}

          {/* Back button */}
          <motion.button
            type="button"
            onClick={() => navigate("/login")}
            whileHover={{
              opacity: 0.8,
            }}
            style={{
              marginTop: 22,
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.4)",
              fontFamily: "Outfit, sans-serif",
              fontSize: 12,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <ArrowLeft size={13} />
            Back to login
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;