/**
 * i18n/config/index.js
 *
 * Central registry for all supported locales.
 * To add a new language:
 *   1. Create src/i18n/locales/<code>.js  (copy en.js as template)
 *   2. Add one line in LOCALES below — that's it.
 *
 * Architecture contract:
 *   - Every locale file exports a default object.
 *   - The object MUST contain a `_meta` key (see en.js).
 *   - Missing keys are silently filled from the fallback locale (en).
 */

import en from '../locales/en';
import ur from '../locales/ur';
import ar from '../locales/ar';
import fr from '../locales/fr';
import es from '../locales/es';
import de from '../locales/de';

// ── Registry ──────────────────────────────────────────────────────────────────
// Order determines display order in the language picker.
export const LOCALES = {
    en,
    ur,
    ar,
    fr,
    es,
    de,
};

// ── Constants ─────────────────────────────────────────────────────────────────
export const DEFAULT_LOCALE     = 'en';
export const STORAGE_KEY        = 'app_language';      // localStorage key
export const SUPPORTED_CODES    = Object.keys(LOCALES); // ['en','ur','ar','fr','es']

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Returns a flat list of language metadata for the picker UI.
 * [{ code, name, nativeName, flag, dir }, ...]
 */
export const getLanguageList = () =>
    SUPPORTED_CODES.map(code => ({ code, ...LOCALES[code]._meta }));

/**
 * Resolves a locale object, falling back to DEFAULT_LOCALE if the code
 * is unsupported or the locale is partially missing top-level keys.
 */
export const resolveLocale = (code) => {
    const base   = LOCALES[DEFAULT_LOCALE];
    const target = LOCALES[code] ?? base;

    // Shallow merge: every top-level section is filled from `en` if absent.
    const merged = {};
    Object.keys(base).forEach(section => {
        merged[section] = { ...base[section], ...(target[section] ?? {}) };
    });
    return merged;
};

/**
 * Reads the persisted language preference from localStorage.
 * Returns DEFAULT_LOCALE if nothing is stored or the stored code is invalid.
 */
export const loadPersistedLocale = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return SUPPORTED_CODES.includes(stored) ? stored : DEFAULT_LOCALE;
    } catch {
        return DEFAULT_LOCALE;
    }
};

/**
 * Persists the chosen language code to localStorage.
 */
export const persistLocale = (code) => {
    try {
        localStorage.setItem(STORAGE_KEY, code);
    } catch {
        // Silently fail (e.g. private browsing with storage quota 0)
    }
};
