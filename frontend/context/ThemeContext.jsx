import { createContext, useContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

const THEMES = [
  { id: "midnight", label: "Midnight", color: "#7c6af7" },
  { id: "ocean",    label: "Ocean",    color: "#38bdf8" },
  { id: "forest",   label: "Forest",   color: "#4ade80" },
  { id: "sunset",   label: "Sunset",   color: "#fb923c" },
  { id: "rose",     label: "Rose",     color: "#f43f5e" },
  { id: "light",    label: "Light",    color: "#6d28d9" },
];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("zingleee-theme") || "midnight"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("zingleee-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);