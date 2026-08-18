import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AuthForm = ({
  onSubmitHandler,

  currentState,
  isDataSubmitted,
  setIsDataSubmitted,

  fullName,
  setFullName,

  email,
  setEmail,

  username,
  setUsername,

  password,
  setPassword,

  showPwd,
  setShowPwd,

  bio,
  setBio,
}) => {

  const navigate = useNavigate();

  const handleTerms = () => {
  navigate("/terms");
};
  const handlePrivacy = () => {
  navigate("/privacy");
};

  return (
    <form onSubmit={onSubmitHandler}>
      <AnimatePresence mode="wait">
        {!isDataSubmitted ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.25 }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {/* Full Name */}
            {currentState === "Sign up" && (
              <div style={{ position: "relative" }}>
                <User
                  size={16}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "rgba(255,255,255,0.3)",
                  }}
                />

                <input
                  className="input-glass"
                  type="text"
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  style={{ paddingLeft: 42 }}
                />
              </div>
            )}

            {/* Email */}
            <div style={{ position: "relative" }}>
              <Mail
                size={16}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(255,255,255,0.3)",
                }}
              />

              <input
                className="input-glass"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: 42 }}
              />
            </div>

            {/* Username */}
            {currentState === "Sign up" && (
              <div style={{ position: "relative" }}>
                <User
                  size={16}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "rgba(255,255,255,0.3)",
                  }}
                />

                <input
                  className="input-glass"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{ paddingLeft: 42 }}
                />
              </div>
            )}

            {/* Password */}
            <div style={{ position: "relative" }}>
              <Lock
                size={16}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(255,255,255,0.3)",
                }}
              />

              <input
                className="input-glass"
                type={showPwd ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  paddingLeft: 42,
                  paddingRight: 42,
                }}
              />

              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.35)",
                  fontSize: 13,
                  padding: 0,
                }}
              >
                {showPwd ? "hide" : "show"}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {/* Back */}
            <button
              type="button"
              onClick={() => setIsDataSubmitted(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--accent)",
                fontSize: 13,
                padding: 0,
              }}
            >
              <ArrowLeft size={14} />
              Back
            </button>

            {/* Bio */}
            <div style={{ position: "relative" }}>
              <FileText
                size={16}
                style={{
                  position: "absolute",
                  left: 14,
                  top: 14,
                  color: "rgba(255,255,255,0.3)",
                }}
              />

              <textarea
                className="input-glass"
                rows={4}
                placeholder="Tell us a bit about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
                style={{
                  paddingLeft: 42,
                  resize: "none",
                  borderRadius: 14,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terms */}
      {!isDataSubmitted && currentState === "Sign up" && (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginTop: 14,
    }}
  >
    <input
      type="checkbox"
      required
      style={{
        accentColor: "var(--accent)",
        width: 14,
        height: 14,
        flexShrink: 0,
      }}
    />

    <label
      style={{
        fontSize: 11,
        color: "rgba(255,255,255,0.35)",
        lineHeight: 1.4,
      }}
    >
      I agree to{" "}
      <span
        onClick={handleTerms}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleTerms();
          }
        }}
        style={{
          color: "rgba(255,255,255,0.6)",
          textDecoration: "underline",
          cursor: "pointer",
        }}
      >
        Terms & Conditions
      </span>{" "}
      and{" "}
      <span
        onClick={handlePrivacy}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            navigate("/privacy");
          }
        }}
        style={{
          color: "rgba(255,255,255,0.6)",
          textDecoration: "underline",
          cursor: "pointer",
        }}
      >
        Privacy Policy
      </span>
    </label>
  </div>
)}

      {/* Submit */}
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        style={{
          width: "100%",
          marginTop: 20,
          padding: "13px 0",
          borderRadius: 50,
          border: "none",
          background:
            "linear-gradient(135deg, var(--accent), var(--accent2))",
          color: "white",
          fontFamily: "Outfit, sans-serif",
          fontSize: 15,
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          boxShadow: "0 6px 24px var(--glow)",
        }}
      >
        {currentState === "Sign up"
          ? isDataSubmitted
            ? "Create Account"
            : "Continue"
          : "Sign In"}

        <ArrowRight size={16} />
      </motion.button>
    </form>
  );
};

export default AuthForm;