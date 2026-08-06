import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { RotateCw, ShieldCheck } from "lucide-react";
import { ZingleeeLogo } from "./LandingPage";

const rings=[0,1,2];

export default function OfflineScreen(){

  const particles = useMemo(
  () =>
    Array.from({ length: 90 }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 12,
      duration: 20 + Math.random() * 15,
      size: 2 + Math.random() * 5,
      opacity: 0.2 + Math.random() * 0.6,
    })),
  []
);

  return (
    <div
      className="noise relative overflow-hidden"
      style={{
        minHeight:"100vh",
        background:"var(--bg)",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        flexDirection:"column",
      }}
    >
      {/* Background Glow */}
      <motion.div
        animate={{scale:[1,1.15,1],opacity:[.35,.6,.35]}}
        transition={{duration:8,repeat:Infinity}}
        style={{
          position:"absolute",
          width:700,
          height:700,
          borderRadius:"50%",
          background:"radial-gradient(circle,var(--glow),transparent 70%)",
          filter:"blur(120px)"
        }}
      />

      {/* Aurora 1 */}
{/* <motion.div
  animate={{
    scale: [1, 1.15, 1],
    rotate: [0, 8, -6, 0],
  }}
  transition={{
    duration: 18,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  style={{
    position: "absolute",
    width: 700,
    height: 700,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(124,106,247,.22), transparent 70%)",
    filter: "blur(80px)",
  }}
/> */}

{/* Aurora 2 */}
<motion.div
  animate={{
    x: [-80, 70, -80],
    y: [-30, 40, -30],
  }}
  transition={{
    duration: 20,
    repeat: Infinity,
    ease: "linear",
  }}
  style={{
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(0,255,255,.12), transparent 70%)",
    filter: "blur(90px)",
  }}
/>

     {/* Floating particles across whole screen */}
      {particles.map((particle, i) => (
  <motion.div
    key={i}
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
      position: "absolute",
      left: `${particle.left}%`,
      top: 0,

      width: particle.size,
      height: particle.size,

      borderRadius: "50%",

      background:
        i % 4 === 0
          ? "var(--accent)"
          : "rgba(255,255,255,.8)",

      boxShadow:
        i % 4 === 0
          ? "0 0 12px var(--glow)"
          : "0 0 8px rgba(255,255,255,.5)",

      pointerEvents: "none",
    }}
  />
))}



      {/* Radar */}
      <div
        style={{
          position:"relative",
          width:230,
          height:230,
          marginBottom:30
        }}
      >
        {rings.map(r=>(
          <motion.div
            key={r}
            animate={{
    opacity:[0.15,.6,.15],
    scale:[1,1.08,1]
}}
transition={{
    duration:3,
    delay:r*0.4,
    repeat:Infinity,
    ease:"easeInOut"
}}
            style={{
              position:"absolute",
              inset:20*r,
              border:"1px solid rgba(255,255,255,.12)",
              borderRadius:"50%"
            }}
          />
        ))}

        <motion.div
          animate={{rotate:360}}
          transition={{duration:3,repeat:Infinity,ease:"linear"}}
          style={{
            position:"absolute",
            inset:0,
            display:"flex",
            justifyContent:"center",
            alignItems:"center"
          }}
        >
          <div
            style={{
              width:2,
              height:100,
              transformOrigin:"bottom",
              background:"linear-gradient(to top,var(--accent),transparent)",
              borderRadius:999
            }}
          />
        </motion.div>

        <motion.div
         animate={{
        scale:[1,1.08,1],
        y:[0,-8,0]
        }}
          transition={{
        duration:2,
        repeat:Infinity,
        ease:"easeInOut"
    }}
          style={{
            position:"absolute",
            inset:0,
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            filter:"drop-shadow(0 0 25px var(--glow))"
          }}
        >
          <ZingleeeLogo size={70}/>
        </motion.div>
      </div>

      <h1 style={{
        color:"#fff",
        fontFamily:"Syne",
        fontSize:44,
        fontWeight:800,
        margin:0
      }}>
        Zingle<span style={{color:"var(--accent)"}}>ee</span>
      </h1>


      <p style={{
        color:"rgba(255,255,255,.55)",
        textAlign:"center",
        lineHeight:1.8,
        maxWidth:380,
        fontSize:14,
        padding: "25px 0",
      }}>
        Your encrypted conversations remain completely safe.
        <br/>
        Re-establishing a secure connection…
      </p>

            {/* Loading Dots */}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 10,
              }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.15,
                    repeat: Infinity,
                  }}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background:
                    "linear-gradient(135deg,var(--accent),var(--accent2))",
                    boxShadow: "0 0 12px var(--glow)",
                  }}
                />
              ))}
            </div>


      <div style={{
        display:"flex",
        alignItems:"center",
        gap:10,
        marginTop:18,
        color:"rgba(255,255,255,.8)"
      }}>
        <ShieldCheck size={18} color="var(--accent)"/>
        End-to-end encryption remains active
      </div>

      <motion.button
        whileHover={{scale:1.05}}
        whileTap={{scale:.96}}
        onClick={()=>window.location.reload()}
        style={{
          marginTop:42,
          border:"none",
          borderRadius:999,
          padding:"14px 34px",
          color:"#fff",
          fontWeight:700,
          cursor:"pointer",
          background:"linear-gradient(135deg,var(--accent),var(--accent2))",
          boxShadow:"0 0 24px var(--glow)"
        }}
      >
        Retry 
      </motion.button>
    </div>
  );
}




