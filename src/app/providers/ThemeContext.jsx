import React, { createContext, useContext, useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
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

    // setThemeModeRaw: persist and update state without animation
    const setThemeModeRaw = (val) => {
        logger.event('ThemeContext', 'theme_mode_change', { from: themeMode, to: val });
        localStorage.setItem('themeMode', val);
        setThemeModeState(val);
        setIsDarkMode(getIsDark(val));
    };

    const applyThemeWithAnimation = (newMode, e) => {
        const isDark = getIsDark(newMode);
        if (isDarkMode === isDark) {
            setThemeModeRaw(newMode);
            return;
        }

        // We check if e exists, has clientX (mouse/touch event), and View Transitions API is supported
        if (!e || e.clientX === undefined || !document.startViewTransition) {
            setThemeModeRaw(newMode);
            return;
        }

        const x = e.clientX;
        const y = e.clientY;
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        const transition = document.startViewTransition(() => {
            flushSync(() => {
                setThemeModeRaw(newMode);
            });
        });

        transition.ready.then(() => {
            const clipPath = [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`
            ];
            
            document.documentElement.animate(
                {
                    clipPath: clipPath,
                },
                {
                    duration: 1000,
                    easing: 'ease-out',
                    pseudoElement: '::view-transition-new(root)',
                }
            );
        });
    };

    // Exported setThemeMode (can accept an event)
    const setThemeMode = (val, e) => {
        applyThemeWithAnimation(val, e);
    };

    // Keep toggleTheme working (toggle dark/light)
    const toggleTheme = (e) => {
        const newMode = isDarkMode ? 'light' : 'dark';
        logger.event('ThemeContext', 'toggle_theme', { newMode });
        applyThemeWithAnimation(newMode, e);
    };

    // Listen to system preference changes when themeMode === 'system'
    useEffect(() => {
        if (themeMode !== 'system') return;
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e) => setIsDarkMode(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [themeMode]);

    // Apply class to root element and update PWA title bar color
    useEffect(() => {
        const root = window.document.documentElement;
        
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = "theme-color";
            document.head.appendChild(metaThemeColor);
        }

        if (isDarkMode) {
            root.classList.remove('light');
            metaThemeColor.setAttribute('content', '#111b21'); // dark surface color
        } else {
            root.classList.add('light');
            metaThemeColor.setAttribute('content', '#f0f2f5'); // exact color for PWA title bar matching mini sidebar
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
