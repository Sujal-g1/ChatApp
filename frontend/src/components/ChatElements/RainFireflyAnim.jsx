import { useMemo } from 'react'
import { motion } from "framer-motion";


const RainFireflyAnim = () => {

    const fireflies = Array.from({ length: 12 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 10,
    duration: 12 + Math.random() * 10,
  }));


  const particles = useMemo(
      () =>
        Array.from({ length: 90 }, () => ({
          left: Math.random() * 100,
          delay: Math.random() * 12,
          duration: 20 + Math.random() * 15,
          size: 0.5 + Math.random() * 2.5,
          opacity: 0.01 + Math.random() * 0.5,
        })),
      []
    );


  return (
    <div>
            {fireflies.map((firefly, index) => (
          <motion.div
            key={index}
            initial={{ top: "-10px", opacity: 0 }}
            animate={{
              top: ["-10px", "580px"],
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
              left: firefly.left,
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

          {/* BACKGROUND FALLING PARTICLES LAYER */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            initial={{
              top: "-5%",
              opacity: 0,
            }}
            animate={{
              top: "105%",
              opacity: [0, particle.opacity, particle.opacity, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              left: `${particle.left}%`,
              width: particle.size,
              height: particle.size,
              borderRadius: "50%",
              background:
                i % 4 === 0 ? "var(--accent)" : "rgba(255,255,255,.8)",
              boxShadow:
                i % 4 === 0
                  ? "0 0 12px var(--glow)"
                  : "0 0 8px rgba(255,255,255,.5)",
              pointerEvents: "none",
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default RainFireflyAnim