/**
 * context/LanguageContext.jsx
 *
 * Single source of truth for the active language.
 * Wrap your app root with <LanguageProvider> once.
 * Consume with useLanguage() from @shared/hooks/useLanguage.
 *
 * What it does:
 *   1. Reads persisted preference from localStorage on mount.
 *   2. Resolves the full translation object (with fallback fill).
 *   3. Applies `dir` attribute to <html> for RTL support.
 *   4. Exposes `t`, `locale`, `setLocale`, `dir`, `isRTL` to consumers.
 */

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

import {
    DEFAULT_LOCALE,
    loadPersistedLocale,
    persistLocale,
    resolveLocale,
} from '../i18n/config';

// ── Context ───────────────────────────────────────────────────────────────────
const LanguageContext = createContext(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export const LanguageProvider = ({ children }) => {
    const [locale, setLocaleState] = useState(() => loadPersistedLocale());
    const [translations, setTranslations] = useState(() => resolveLocale(loadPersistedLocale()));

    // Apply language-level side-effects whenever locale changes
    useEffect(() => {
        const resolved = resolveLocale(locale);
        const dir      = resolved._meta?.dir ?? 'ltr';

        setTranslations(resolved);

        // RTL support: toggle dir on <html>
        document.documentElement.setAttribute('dir', dir);
        document.documentElement.setAttribute('lang', locale);
    }, [locale]);

    /**
     * Switch language.
     * Persists to localStorage and re-resolves translations immediately.
     */
    const setLocale = useCallback((code) => {
        persistLocale(code);
        setLocaleState(code);
    }, []);

    /**
     * Translation accessor.
     * t('settings.title')  →  'Settings'
     * t('common.next')     →  'Next'
     *
     * Supports nested dot-path access up to 2 levels deep (section.key).
     * Returns the key string itself if the path is not found (visible signal).
     */
    const t = useCallback((path) => {
        const parts = path.split('.');
        if (parts.length === 2) {
            const [section, key] = parts;
            return translations?.[section]?.[key] ?? path;
        }
        return translations?.[parts[0]] ?? path;
    }, [translations]);

    const isRTL = translations._meta?.dir === 'rtl';

    const value = {
        locale,         // 'en' | 'ur' | 'ar' | 'fr' | 'es'
        setLocale,      // (code: string) => void
        t,              // (path: string) => string
        isRTL,          // boolean
        dir: translations._meta?.dir ?? 'ltr',
        translations,   // full object (use t() instead when possible)
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

// ── Internal export (use the hook instead) ────────────────────────────────────
export { LanguageContext };
