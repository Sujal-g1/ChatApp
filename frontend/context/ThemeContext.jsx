

import React, { createContext, useContext, useState, useEffect } from 'react'

export const THEMES = [
  { id: 'violet', label: 'Violet', color: '#7c6af7',
    accent: '#7c6af7', accent2: '#a78bfa', glow: 'rgba(124,106,247,0.4)',
    orb1: '#7c6af7', orb2: '#4f46e5', bg: 'linear-gradient(135deg,#0f0c29 0%,#1a1040 50%,#0f0c29 100%)' },
  { id: 'rose', label: 'Rose', color: '#f43f5e',
    accent: '#f43f5e', accent2: '#fb7185', glow: 'rgba(244,63,94,0.4)',
    orb1: '#f43f5e', orb2: '#e11d48', bg: 'linear-gradient(135deg,#1f0a0e 0%,#2d0f18 50%,#1f0a0e 100%)' },
  { id: 'cyan', label: 'Cyan', color: '#06b6d4',
    accent: '#06b6d4', accent2: '#22d3ee', glow: 'rgba(6,182,212,0.4)',
    orb1: '#06b6d4', orb2: '#0891b2', bg: 'linear-gradient(135deg,#020e14 0%,#041c28 50%,#020e14 100%)' },
  { id: 'emerald', label: 'Emerald', color: '#10b981',
    accent: '#10b981', accent2: '#34d399', glow: 'rgba(16,185,129,0.4)',
    orb1: '#10b981', orb2: '#059669', bg: 'linear-gradient(135deg,#021209 0%,#062015 50%,#021209 100%)' },
  { id: 'amber', label: 'Amber', color: '#f59e0b',
    accent: '#f59e0b', accent2: '#fbbf24', glow: 'rgba(245,158,11,0.4)',
    orb1: '#f59e0b', orb2: '#d97706', bg: 'linear-gradient(135deg,#160e00 0%,#231600 50%,#160e00 100%)' },
  { id: 'indigo', label: 'Indigo', color: '#6366f1',
    accent: '#6366f1', accent2: '#818cf8', glow: 'rgba(99,102,241,0.4)',
    orb1: '#6366f1', orb2: '#4f46e5', bg: 'linear-gradient(135deg,#0a0b1a 0%,#12133a 50%,#0a0b1a 100%)' },
]

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeId] = useState(() => localStorage.getItem('zingleee-theme') || 'violet')

  const currentTheme = THEMES.find(t => t.id === theme) || THEMES[0]

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--accent', currentTheme.accent)
    root.style.setProperty('--accent2', currentTheme.accent2)
    root.style.setProperty('--glass', `${currentTheme.accent}14`)
    root.style.setProperty('--glass-hover', `${currentTheme.accent}26`)
    root.style.setProperty('--border-color', `${currentTheme.accent}33`)
    root.style.setProperty('--glow', currentTheme.glow)
    root.style.setProperty('--orb1', currentTheme.orb1)
    root.style.setProperty('--orb2', currentTheme.orb2)
    root.style.setProperty('--bg', currentTheme.bg)
    document.body.style.background = currentTheme.bg
    localStorage.setItem('zingleee-theme', theme)
  }, [theme, currentTheme])

  const setTheme = (id) => setThemeId(id)


  return (
    <ThemeContext.Provider value={{ theme, setTheme, THEMES, currentTheme }}>
      {children}
    </ThemeContext.Provider>

  );
};
  

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

