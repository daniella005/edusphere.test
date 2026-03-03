import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeColor = 'default' | 'ocean' | 'forest' | 'sunset' | 'purple' | 'rose' | 'amber' | 'slate' | 'emerald' | 'crimson';
export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeColor: ThemeColor;
  themeMode: ThemeMode;
  setThemeColor: (color: ThemeColor) => void;
  setThemeMode: (mode: ThemeMode) => void;
  themes: { value: ThemeColor; label: string; color: string }[];
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEMES: { value: ThemeColor; label: string; color: string }[] = [
  { value: 'default', label: 'Professional Blue', color: 'hsl(222, 47%, 20%)' },
  { value: 'ocean', label: 'Ocean Breeze', color: 'hsl(200, 80%, 40%)' },
  { value: 'forest', label: 'Forest Green', color: 'hsl(150, 60%, 35%)' },
  { value: 'sunset', label: 'Sunset Warm', color: 'hsl(25, 90%, 50%)' },
  { value: 'purple', label: 'Royal Purple', color: 'hsl(270, 60%, 50%)' },
  { value: 'rose', label: 'Rose Pink', color: 'hsl(340, 75%, 55%)' },
  { value: 'amber', label: 'Golden Amber', color: 'hsl(45, 90%, 50%)' },
  { value: 'slate', label: 'Modern Slate', color: 'hsl(215, 20%, 40%)' },
  { value: 'emerald', label: 'Vibrant Emerald', color: 'hsl(160, 84%, 39%)' },
  { value: 'crimson', label: 'Bold Crimson', color: 'hsl(0, 72%, 51%)' },
];

const ALL_THEME_CLASSES = THEMES.map(t => `theme-${t.value}`);

function getSystemDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyTheme(color: ThemeColor, isDark: boolean) {
  const root = document.documentElement;
  
  // Remove all theme and mode classes
  root.classList.remove(...ALL_THEME_CLASSES, 'dark', 'light');
  
  // Apply new classes
  root.classList.add(`theme-${color}`);
  root.classList.add(isDark ? 'dark' : 'light');
  
  // Also set data attribute for any CSS that might use it
  root.dataset.theme = color;
  root.dataset.mode = isDark ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeColor, setThemeColorState] = useState<ThemeColor>(() => {
    if (typeof window === 'undefined') return 'default';
    const saved = localStorage.getItem('app-theme-color');
    return (saved as ThemeColor) || 'default';
  });

  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem('app-theme-mode');
    return (saved as ThemeMode) || 'light';
  });

  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const savedMode = localStorage.getItem('app-theme-mode') as ThemeMode || 'light';
    if (savedMode === 'system') return getSystemDarkMode();
    return savedMode === 'dark';
  });

  // Apply theme on mount and when theme changes
  useEffect(() => {
    let shouldBeDark = themeMode === 'dark';
    if (themeMode === 'system') {
      shouldBeDark = getSystemDarkMode();
    }
    
    setIsDark(shouldBeDark);
    applyTheme(themeColor, shouldBeDark);
    
    // Save to localStorage
    localStorage.setItem('app-theme-color', themeColor);
    localStorage.setItem('app-theme-mode', themeMode);
  }, [themeColor, themeMode]);

  // Listen for system theme changes
  useEffect(() => {
    if (themeMode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
      applyTheme(themeColor, e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode, themeColor]);

  // Apply theme immediately on first render
  useEffect(() => {
    let shouldBeDark = themeMode === 'dark';
    if (themeMode === 'system') {
      shouldBeDark = getSystemDarkMode();
    }
    applyTheme(themeColor, shouldBeDark);
  }, []);

  const setThemeColor = (color: ThemeColor) => {
    setThemeColorState(color);
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  return (
    <ThemeContext.Provider value={{ 
      themeColor, 
      themeMode, 
      setThemeColor, 
      setThemeMode, 
      themes: THEMES,
      isDark 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
