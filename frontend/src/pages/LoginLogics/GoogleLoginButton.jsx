import React from "react";
import { motion } from "framer-motion";

const GoogleLoginButton = ({ onClick }) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      style={{
        width: "100%",
        padding: "13px 0",
        borderRadius: 50,
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        color: "white",
        fontFamily: "Outfit, sans-serif",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        transition: "all 0.25s ease",
      }}
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        style={{
          width: 18,
          height: 18,
        }}
      />

      Continue with Google
    </motion.button>
  );
};

export default GoogleLoginButton;