"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.add("dark");
  }, []);

  const setTheme = useCallback((newTheme: "light" | "dark") => {
    // Dark mode only, do nothing
  }, []);

  const toggleTheme = useCallback(() => {
    // Dark mode only, do nothing
  }, []);

  // Prevent flash of unstyled content
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Safe fallback for SSG / prerendering outside ThemeProvider
    return {
      theme: "dark" as const,
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  return context;
}
