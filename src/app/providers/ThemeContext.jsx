import React, { createContext, useContext, useState, useEffect } from 'react';
import { colors } from '@core/theme/colors';
import logger from '@core/utils/logger';

// 1. Create the Context
const ThemeContext = createContext();

// 2. Create a Provider Component
export const ThemeProvider = ({ children }) => {
    // themeMode: 'system' | 'light' | 'dark'
    const [themeMode, setThemeModeState] = useState(() => {
        return localStorage.getItem('themeMode') || 'system';
    });

    // Derive isDarkMode from themeMode
    const getIsDark = (mode) => {
        if (mode === 'dark') return true;
        if (mode === 'light') return false;
        // system
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    const [isDarkMode, setIsDarkMode] = useState(() => getIsDark(localStorage.getItem('themeMode') || 'system'));

    // setThemeMode: persist and update state
    const setThemeMode = (val) => {
        logger.event('ThemeContext', 'theme_mode_change', { from: themeMode, to: val });
        localStorage.setItem('themeMode', val);
        setThemeModeState(val);
        setIsDarkMode(getIsDark(val));
    };

    // Keep toggleTheme working (toggle dark/light)
    const toggleTheme = () => {
        const newMode = isDarkMode ? 'light' : 'dark';
        logger.event('ThemeContext', 'toggle_theme', { newMode });
        setThemeMode(newMode);
    };

    // Listen to system preference changes when themeMode === 'system'
    useEffect(() => {
        if (themeMode !== 'system') return;
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e) => setIsDarkMode(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [themeMode]);

    // Apply class to root element
    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.remove('light');
        } else {
            root.classList.add('light');
        }
    }, [isDarkMode]);

    const theme = isDarkMode ? colors.dark : colors.light;

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme, colors, themeMode, setThemeMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

// 4. Custom hook for easy access
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeContext;
