import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Palette, Check, Sparkles } from 'lucide-react';

const ThemeSwitcher = () => {
  const { currentTheme, activeThemeObj, changeTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close popup if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="position-fixed"
      style={{
        bottom: '24px',
        right: '24px',
        zIndex: 9999
      }}
    >
      {/* Theme Picker Dropdown Panel */}
      {isOpen && (
        <div
          className="p-3 mb-2 rounded-4 shadow-lg border-0"
          style={{
            width: '260px',
            background: 'rgba(11, 17, 33, 0.95)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(59, 130, 246, 0.2)',
            animation: 'fadeInUp 0.25s ease-out'
          }}
        >
          <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary border-opacity-25">
            <div className="d-flex align-items-center gap-2">
              <Palette size={16} style={{ color: activeThemeObj.primary }} />
              <span className="small fw-bold text-white font-heading">Select Color Theme</span>
            </div>
            <span className="badge-ai" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>Live</span>
          </div>

          <div className="d-flex flex-column gap-2">
            {themes.map((t) => {
              const isSelected = currentTheme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    changeTheme(t.id);
                  }}
                  className="btn d-flex align-items-center justify-content-between p-2 rounded-3 text-white transition-all text-start"
                  style={{
                    background: isSelected ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? `1px solid ${t.primary}` : '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    {/* Color Swatch Circle */}
                    <div
                      className="rounded-circle shadow-sm"
                      style={{
                        width: '20px',
                        height: '20px',
                        background: t.gradient,
                        border: '2px solid rgba(255, 255, 255, 0.3)'
                      }}
                    ></div>
                    <span className="small fw-medium">{t.name}</span>
                  </div>

                  {isSelected && (
                    <Check size={16} style={{ color: t.primary }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Action Button Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="btn p-3 rounded-circle shadow-lg d-flex align-items-center justify-content-center text-white transition-all"
        style={{
          width: '54px',
          height: '54px',
          background: activeThemeObj.gradient,
          border: '2px solid rgba(255, 255, 255, 0.25)',
          boxShadow: `0 8px 25px ${activeThemeObj.glow}`,
          transform: isOpen ? 'rotate(45deg)' : 'none'
        }}
        title="Customize Theme Color"
      >
        <Palette size={22} />
      </button>
    </div>
  );
};

export default ThemeSwitcher;
