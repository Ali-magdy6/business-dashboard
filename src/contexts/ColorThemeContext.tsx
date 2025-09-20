import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

export type ColorTheme = 'default' | 'colorblind' | 'high-contrast';
export type ColorMode = 'light' | 'dark' | 'system';

interface ColorThemeContextType {
  theme: ColorTheme;
  setTheme: (theme: ColorTheme) => void;
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  isColorBlind: boolean;
  isHighContrast: boolean;
  isDark: boolean;
  toggleColorBlind: () => void;
  toggleHighContrast: () => void;
}

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(undefined);

interface ColorThemeProviderProps {
  children: ReactNode;
}

export const ColorThemeProvider: React.FC<ColorThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ColorTheme>('default');
  const [colorMode, setColorMode] = useState<ColorMode>('system');
  const [isColorBlind, setIsColorBlind] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Detect system preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    
    const handleSystemChange = () => {
      if (colorMode === 'system') {
        setIsDark(mediaQuery.matches);
      }
      setIsHighContrast(contrastQuery.matches);
    };

    handleSystemChange();
    mediaQuery.addEventListener('change', handleSystemChange);
    contrastQuery.addEventListener('change', handleSystemChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange);
      contrastQuery.removeEventListener('change', handleSystemChange);
    };
  }, [colorMode]);

  // Apply color mode
  useEffect(() => {
    if (colorMode === 'dark') {
      setIsDark(true);
    } else if (colorMode === 'light') {
      setIsDark(false);
    } else {
      // system mode - handled by the media query listener
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDark(mediaQuery.matches);
    }
  }, [colorMode]);

  // Apply theme classes to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('colorblind-safe', 'high-contrast', 'light', 'dark');
    
    // Apply new theme classes
    if (isColorBlind) root.classList.add('colorblind-safe');
    if (isHighContrast) root.classList.add('high-contrast');
    if (isDark) root.classList.add('dark');
    else root.classList.add('light');
    
    // Update CSS custom properties
    root.style.setProperty('--color-theme', theme);
    root.style.setProperty('--color-mode', colorMode);
  }, [theme, colorMode, isColorBlind, isHighContrast, isDark]);

  const toggleColorBlind = () => {
    setIsColorBlind(!isColorBlind);
    setTheme(isColorBlind ? 'default' : 'colorblind');
  };

  const toggleHighContrast = () => {
    setIsHighContrast(!isHighContrast);
    setTheme(isHighContrast ? 'default' : 'high-contrast');
  };

  const value: ColorThemeContextType = {
    theme,
    setTheme,
    colorMode,
    setColorMode,
    isColorBlind,
    isHighContrast,
    isDark,
    toggleColorBlind,
    toggleHighContrast,
  };

  return (
    <ColorThemeContext.Provider value={value}>
      {children}
    </ColorThemeContext.Provider>
  );
};

export const useColorTheme = (): ColorThemeContextType => {
  const context = useContext(ColorThemeContext);
  if (context === undefined) {
    throw new Error('useColorTheme must be used within a ColorThemeProvider');
  }
  return context;
};

// Color utility hooks
export const useBrandColors = () => {
  const { isDark } = useColorTheme();
  return {
    primary: isDark ? 'var(--brand-primary)' : 'var(--brand-primary)',
    secondary: isDark ? 'var(--brand-secondary)' : 'var(--brand-secondary)',
    tertiary: isDark ? 'var(--brand-tertiary)' : 'var(--brand-tertiary)',
  };
};

export const useSurfaceColors = () => {
  const { isDark } = useColorTheme();
  return {
    0: isDark ? 'var(--surface-0)' : 'var(--light-surface-0)',
    1: isDark ? 'var(--surface-1)' : 'var(--light-surface-1)',
    2: isDark ? 'var(--surface-2)' : 'var(--light-surface-2)',
    3: isDark ? 'var(--surface-3)' : 'var(--light-surface-3)',
    4: isDark ? 'var(--surface-4)' : 'var(--light-surface-4)',
  };
};

export const useTextColors = () => {
  const { isDark } = useColorTheme();
  return {
    primary: isDark ? 'var(--text-primary)' : 'var(--light-text-primary)',
    secondary: isDark ? 'var(--text-secondary)' : 'var(--light-text-secondary)',
    tertiary: isDark ? 'var(--text-tertiary)' : 'var(--light-text-tertiary)',
    muted: isDark ? 'var(--text-muted)' : 'var(--light-text-muted)',
  };
};
