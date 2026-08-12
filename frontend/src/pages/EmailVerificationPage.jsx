import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { applyActionCode } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { ZingleeeLogo } from "./LandingPage";

const EmailVerificationPage = () => {
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const params = new URLSearchParams(window.location.search);

        const mode = params.get("mode");
        const oobCode = params.get("oobCode");

        // This page is only for email verification.
        if (mode !== "verifyEmail") {
          setStatus("error");
          setMessage("This verification link is not valid.");
          return;
        }

        if (!oobCode) {
          setStatus("error");
          setMessage("The verification link is missing its verification code.");
          return;
        }

        // Complete Firebase email verification.
        await applyActionCode(auth, oobCode);

        setStatus("success");
        setMessage(
          "Your email address has been successfully verified."
        );
      } catch (error) {
        console.error("Email verification error:", error);

        setStatus("error");

        if (
          error.code === "auth/invalid-action-code" ||
          error.code === "auth/expired-action-code"
        ) {
          setMessage(
            "This verification link has expired or is no longer valid."
          );
        } else {
          setMessage(
            "We couldn't verify your email. Please request a new verification email."
          );
        }
      }
    };

    verifyEmail();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, var(--glow), transparent 70%)",
          filter: "blur(50px)",
          opacity: 0.35,
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
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
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 18,
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
              <Loader2
                size={54}
                color="var(--accent)"
                style={{
                  animation: "spin 1s linear infinite",
                  marginBottom: 20,
                }}
              />

              <h2
                style={{
                  color: "white",
                  fontSize: 22,
                  margin: "0 0 10px",
                }}
              >
                Verifying your email
              </h2>

              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 14,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Please wait while we verify your email address.
              </p>
            </motion.div>
          )}

          {/* Success */}
          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle2
                size={64}
                color="var(--accent)"
                style={{
                  marginBottom: 20,
                  filter: "drop-shadow(0 0 15px var(--glow))",
                }}
              />

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

              <p
                style={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: 14,
                  lineHeight: 1.6,
                  margin: "0 auto 26px",
                  maxWidth: 320,
                }}
              >
                {message}
                <br />
                <br />
                Your email is now verified. Return to Zingleee to finish
                creating your account.
              </p>

              <button
                type="button"
                onClick={() => navigate("/")}
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
                  boxShadow: "0 6px 24px var(--glow)",
                }}
              >
                Return to Zingleee
              </button>
            </motion.div>
          )}

          {/* Error */}
          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <XCircle
                size={64}
                color="#ff6b6b"
                style={{
                  marginBottom: 20,
                }}
              />

              <h2
                style={{
                  color: "white",
                  fontSize: 23,
                  fontWeight: 700,
                  margin: "0 0 12px",
                }}
              >
                Verification failed
              </h2>

              <p
                style={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: 14,
                  lineHeight: 1.6,
                  margin: "0 auto 26px",
                  maxWidth: 320,
                }}
              >
                {message}
              </p>

              <button
                type="button"
                onClick={() => navigate("/")}
                style={{
                  width: "100%",
                  padding: "13px 20px",
                  borderRadius: 50,
                  border:
                    "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                  fontFamily: "Outfit, sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <ArrowLeft
                  size={15}
                  style={{
                    verticalAlign: "middle",
                    marginRight: 6,
                  }}
                />
                Back to Zingleee
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;