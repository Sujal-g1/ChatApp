import { createContext, useContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const THEMES = [
  {
    id: "midnight",
    label: "Midnight",
    color: "#7c6af7",
    bg: "linear-gradient(135deg, #0f0c29 0%, #1a1040 50%, #0f0c29 100%)",
    accent: "#7c6af7",
    accent2: "#a78bfa",
    glass: "rgba(124, 106, 247, 0.08)",
    border: "rgba(124, 106, 247, 0.2)",
    glow: "rgba(124, 106, 247, 0.4)",
    orb1: "#7c6af7",
    orb2: "#4f46e5",
  },
  {
    id: "ocean",
    label: "Ocean",
    color: "#38bdf8",
    bg: "linear-gradient(135deg, #0c1a2e 0%, #0a2540 50%, #051525 100%)",
    accent: "#38bdf8",
    accent2: "#7dd3fc",
    glass: "rgba(56, 189, 248, 0.08)",
    border: "rgba(56, 189, 248, 0.2)",
    glow: "rgba(56, 189, 248, 0.4)",
    orb1: "#0ea5e9",
    orb2: "#0369a1",
  },
  {
    id: "forest",
    label: "Forest",
    color: "#4ade80",
    bg: "linear-gradient(135deg, #0a1f0f 0%, #0d2818 50%, #071510 100%)",
    accent: "#4ade80",
    accent2: "#86efac",
    glass: "rgba(74, 222, 128, 0.08)",
    border: "rgba(74, 222, 128, 0.2)",
    glow: "rgba(74, 222, 128, 0.4)",
    orb1: "#22c55e",
    orb2: "#16a34a",
  },
  {
    id: "sunset",
    label: "Sunset",
    color: "#fb923c",
    bg: "linear-gradient(135deg, #1f0a00 0%, #2d1200 50%, #1a0800 100%)",
    accent: "#fb923c",
    accent2: "#fdba74",
    glass: "rgba(251, 146, 60, 0.08)",
    border: "rgba(251, 146, 60, 0.2)",
    glow: "rgba(251, 146, 60, 0.4)",
    orb1: "#f97316",
    orb2: "#ea580c",
  },
  {
    id: "rose",
    label: "Rose",
    color: "#f43f5e",
    bg: "linear-gradient(135deg, #1f0a0f 0%, #2d0f17 50%, #1a0810 100%)",
    accent: "#f43f5e",
    accent2: "#fb7185",
    glass: "rgba(244, 63, 94, 0.08)",
    border: "rgba(244, 63, 94, 0.2)",
    glow: "rgba(244, 63, 94, 0.4)",
    orb1: "#e11d48",
    orb2: "#be123c",
  },
  {
    id: "aurora",
    label: "Aurora",
    color: "#06b6d4",
    bg: "linear-gradient(135deg, #050d1a 0%, #0a1628 50%, #050d1a 100%)",
    accent: "#06b6d4",
    accent2: "#67e8f9",
    glass: "rgba(6, 182, 212, 0.08)",
    border: "rgba(6, 182, 212, 0.2)",
    glow: "rgba(6, 182, 212, 0.4)",
    orb1: "#0891b2",
    orb2: "#7c3aed",
  },
];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("zingleee-theme") || "midnight"
  );

  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  useEffect(() => {
    const t = currentTheme;
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.style.setProperty("--accent", t.accent);
    root.style.setProperty("--accent2", t.accent2);
    root.style.setProperty("--glass", t.glass);
    root.style.setProperty("--border-color", t.border);
    root.style.setProperty("--glow", t.glow);
    root.style.setProperty("--orb1", t.orb1);
    root.style.setProperty("--orb2", t.orb2);
    root.style.setProperty("--bg", t.bg);
    localStorage.setItem("zingleee-theme", theme);
  }, [theme, currentTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, THEMES, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);