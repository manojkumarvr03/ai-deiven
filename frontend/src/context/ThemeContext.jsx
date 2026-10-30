import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const THEMES = [
  {
    id: 'cyber-blue',
    name: 'Cosmic Indigo',
    icon: '🌌',
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    bgDark: '#070a13',
    cardBg: 'rgba(13, 20, 36, 0.75)',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #6366f1 100%)',
    glow: 'rgba(59, 130, 246, 0.35)'
  },
  {
    id: 'emerald-matrix',
    name: 'Emerald Matrix',
    icon: '⚡',
    primary: '#10b981',
    secondary: '#059669',
    accent: '#14b8a6',
    bgDark: '#05120d',
    cardBg: 'rgba(6, 28, 20, 0.75)',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #14b8a6 100%)',
    glow: 'rgba(16, 185, 129, 0.35)'
  },
  {
    id: 'crimson-sunset',
    name: 'Crimson Sunset',
    icon: '🔥',
    primary: '#f43f5e',
    secondary: '#ea580c',
    accent: '#f59e0b',
    bgDark: '#14080b',
    cardBg: 'rgba(31, 12, 17, 0.75)',
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #ea580c 50%, #f59e0b 100%)',
    glow: 'rgba(244, 63, 94, 0.35)'
  },
  {
    id: 'royal-amethyst',
    name: 'Neon Amethyst',
    icon: '💜',
    primary: '#a855f7',
    secondary: '#d946ef',
    accent: '#ec4899',
    bgDark: '#10071a',
    cardBg: 'rgba(26, 11, 41, 0.75)',
    gradient: 'linear-gradient(135deg, #a855f7 0%, #d946ef 50%, #ec4899 100%)',
    glow: 'rgba(168, 85, 247, 0.35)'
  },
  {
    id: 'oceanic-cyan',
    name: 'Oceanic Aqua',
    icon: '🌊',
    primary: '#06b6d4',
    secondary: '#0284c7',
    accent: '#3b82f6',
    bgDark: '#050f18',
    cardBg: 'rgba(8, 24, 38, 0.75)',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 50%, #3b82f6 100%)',
    glow: 'rgba(6, 182, 212, 0.35)'
  },
  {
    id: 'obsidian-gold',
    name: 'Obsidian Gold',
    icon: '✨',
    primary: '#eab308',
    secondary: '#f59e0b',
    accent: '#fbbf24',
    bgDark: '#120f06',
    cardBg: 'rgba(28, 23, 10, 0.75)',
    gradient: 'linear-gradient(135deg, #eab308 0%, #d97706 50%, #f59e0b 100%)',
    glow: 'rgba(234, 179, 8, 0.35)'
  }
];

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('edura_theme');
    return saved && THEMES.find(t => t.id === saved) ? saved : 'cyber-blue';
  });

  const applyTheme = (themeId) => {
    const themeObj = THEMES.find((t) => t.id === themeId) || THEMES[0];
    const root = document.documentElement;

    root.style.setProperty('--accent-electric', themeObj.primary);
    root.style.setProperty('--accent-violet', themeObj.secondary);
    root.style.setProperty('--accent-cyan', themeObj.accent);
    root.style.setProperty('--bg-dark', themeObj.bgDark);
    root.style.setProperty('--bg-card', themeObj.cardBg);
    root.style.setProperty('--shadow-glow', `0 0 35px -5px ${themeObj.glow}`);
    root.style.setProperty('--shadow-purple-glow', `0 0 35px -5px ${themeObj.glow}`);

    document.body.style.backgroundColor = themeObj.bgDark;
    document.documentElement.setAttribute('data-theme', themeId);
  };

  useEffect(() => {
    applyTheme(currentTheme);
    localStorage.setItem('edura_theme', currentTheme);
  }, [currentTheme]);

  const changeTheme = (themeId) => {
    setCurrentTheme(themeId);
  };

  const activeThemeObj = THEMES.find((t) => t.id === currentTheme) || THEMES[0];

  return (
    <ThemeContext.Provider value={{ currentTheme, activeThemeObj, changeTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
