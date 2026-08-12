import React from "react";
import { motion } from "framer-motion";

const Fireflies = () => {
  const fireflies = Array.from({ length: 12 }, (_, i) => ({
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 10,
    duration: 8 + Math.random() * 10,
  }));

  return (
    <>
      {fireflies.map((firefly, index) => (
        <motion.div
          key={index}
          animate={{
            x: ["-10vw", "110vw"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: firefly.duration,
            repeat: Infinity,
            delay: firefly.delay,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            top: firefly.top,
            left: 0,
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: "white",
            boxShadow: "0 0 10px rgba(255,255,255,0.8)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      ))}
    </>
  );
};

export default Fireflies;