/* global performance */
/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║          WhatsApp Clone — Production Logger (src/utils/logger.js)    ║
 * ╠══════════════════════════════════════════════════════════════════════╣
 * ║  MODES (controlled via .env):                                        ║
 * ║    VITE_LOG_LEVEL=debug  → ALL logs (debug/info/warn/error + timer)  ║
 * ║    VITE_LOG_LEVEL=info   → info/warn/error only (skip debug)         ║
 * ║    VITE_LOG_LEVEL=warn   → warn/error only (production clean)        ║
 * ║    VITE_LOG_LEVEL=error  → only fatal errors                         ║
 * ║    VITE_LOG_LEVEL=silent → nothing (useful in test runners)          ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * USAGE:
 *   import logger from '../utils/logger';
 *
 *   logger.debug('ChatDetail', 'render triggered', { chatId });
 *   logger.info('Auth', 'User logged in', { userId });
 *   logger.warn('Store', 'Chat not found, skipping', { id });
 *   logger.error('API', 'Message send failed', err);
 *
 *   // Timing blocks:
 *   logger.time('AppInit');
 *   // ... expensive work ...
 *   logger.timeEnd('AppInit');
 *
 *   // Group (debug mode only):
 *   logger.group('SelectionHeader actions');
 *   logger.debug('SelectionHeader', 'copy triggered', { count });
 *   logger.groupEnd();
 *
 *   // Event shorthand (always info level):
 *   logger.event('UserInfoPanel', 'block_contact', { contactId });
 *
 *   // Navigation shorthand:
 *   logger.nav('AppNavigator', 'CHATS → SETTINGS');
 *
 *   // Auth shorthand:
 *   logger.auth('Login required — redirect triggered');
 *
 *   // Skip (logged in all modes including silent — for critical skips):
 *   logger.skip('NewGroupScreen', 'No contacts selected — skipping group create');
 */

// ─── Level hierarchy ──────────────────────────────────────────────────────────
const LEVELS = { debug: 0, info: 1, warn: 2, error: 3, silent: 99 };

// ─── Read from Vite env (defaults to 'warn' for production safety) ────────────
const RAW_LEVEL = (import.meta.env.VITE_LOG_LEVEL || 'warn').toLowerCase().trim();
const CURRENT_LEVEL = LEVELS[RAW_LEVEL] ?? LEVELS.warn;
const APP_ENV = import.meta.env.VITE_APP_ENV || 'production';
const IS_DEV = APP_ENV === 'development' || import.meta.env.DEV;

// ─── Colour palette for console (ANSI not available in browser, use %c) ───────
const STYLES = {
    debug:   'color:#64b5f6;font-weight:bold',          // soft blue
    info:    'color:#81c995;font-weight:bold',           // green
    warn:    'color:#ffb74d;font-weight:bold',           // amber
    error:   'color:#ef5350;font-weight:bold',           // red
    event:   'color:#ce93d8;font-weight:bold',           // purple
    nav:     'color:#4dd0e1;font-weight:bold',           // cyan
    auth:    'color:#ff8a65;font-weight:bold',           // orange
    skip:    'color:#90a4ae;font-weight:bold',           // grey-blue
    time:    'color:#a5d6a7;font-style:italic',          // light green
    badge:   'color:#fff;background:#37474f;padding:1px 5px;border-radius:3px',
    module:  'color:#b0bec5;font-weight:bold',
    reset:   '',
};

// ─── Performance timer map ─────────────────────────────────────────────────────
const _timers = new Map();

// ─── Core emit function ────────────────────────────────────────────────────────
function _emit(level, module, message, data) {
    if (LEVELS[level] < CURRENT_LEVEL) return;

    const ts = new Date().toISOString().slice(11, 23); // HH:MM:SS.mmm
    const envTag = IS_DEV ? '[DEV]' : '[PROD]';
    const prefix = `%c${envTag}%c [${ts}] %c${level.toUpperCase().padEnd(5)}%c %c${module || '─'}%c › ${message}`;

    const styles = [
        IS_DEV ? 'color:#64b5f6;font-size:10px' : 'color:#ff8a65;font-size:10px',
        STYLES.reset,
        STYLES[level] || STYLES.info,
        STYLES.reset,
        STYLES.module,
        STYLES.reset,
    ];

    // In production (warn level), keep it minimal — no extra data dump
    if (CURRENT_LEVEL >= LEVELS.warn) {
        if (level === 'error') {
            console.error(`[${ts}] ERROR ${module} › ${message}`, data !== undefined ? data : '');
        } else if (level === 'warn') {
            console.warn(`[${ts}] WARN  ${module} › ${message}`, data !== undefined ? data : '');
        }
        return;
    }

    // Development: rich formatted output
    if (data !== undefined && data !== null) {
        console[level === 'debug' ? 'log' : level]?.(prefix, ...styles, '\n ', data);
    } else {
        console[level === 'debug' ? 'log' : level]?.(prefix, ...styles);
    }
}

// ─── Public API ────────────────────────────────────────────────────────────────
const logger = {
    // ── Standard levels ──────────────────────────────────────────────────────
    debug:  (module, msg, data) => _emit('debug', module, msg, data),
    info:   (module, msg, data) => _emit('info',  module, msg, data),
    warn:   (module, msg, data) => _emit('warn',  module, msg, data),
    error:  (module, msg, data) => _emit('error', module, msg, data),

    // ── Semantic shortcuts ────────────────────────────────────────────────────

    /** Log a UI/store event (user interaction, state change) */
    event(module, eventName, data) {
        if (LEVELS.info < CURRENT_LEVEL) return;
        const ts = new Date().toISOString().slice(11, 23);
        if (IS_DEV) {
            console.log(
                `%c[${ts}] %cEVENT%c %c${module}%c › ${eventName}`,
                'color:#888;font-size:10px', STYLES.event, STYLES.reset, STYLES.module, STYLES.reset,
                data !== undefined ? data : ''
            );
        } else {
            console.info(`[${ts}] EVENT ${module} › ${eventName}`);
        }
    },

    /** Log a screen/route navigation */
    nav(module, transition) {
        if (LEVELS.info < CURRENT_LEVEL) return;
        const ts = new Date().toISOString().slice(11, 23);
        if (IS_DEV) {
            console.log(
                `%c[${ts}] %cNAV%c   %c${module}%c › ${transition}`,
                'color:#888;font-size:10px', STYLES.nav, STYLES.reset, STYLES.module, STYLES.reset
            );
        } else {
            console.info(`[${ts}] NAV ${module} › ${transition}`);
        }
    },

    /** Log auth-related events (login required, session expired, re-auth) */
    auth(message, data) {
        if (LEVELS.warn < CURRENT_LEVEL) return;
        const ts = new Date().toISOString().slice(11, 23);
        if (IS_DEV) {
            console.warn(
                `%c[${ts}] %cAUTH%c › ${message}`,
                'color:#888;font-size:10px', STYLES.auth, STYLES.reset,
                data !== undefined ? data : ''
            );
        } else {
            console.warn(`[${ts}] AUTH › ${message}`);
        }
    },

    /** Log when an operation is deliberately skipped */
    skip(module, reason, data) {
        if (LEVELS.debug < CURRENT_LEVEL) return;
        const ts = new Date().toISOString().slice(11, 23);
        console.log(
            `%c[${ts}] %cSKIP%c  %c${module}%c › ${reason}`,
            'color:#888;font-size:10px', STYLES.skip, STYLES.reset, STYLES.module, STYLES.reset,
            data !== undefined ? data : ''
        );
    },

    // ── Performance timers ────────────────────────────────────────────────────

    /** Start a named timer */
    time(label) {
        if (LEVELS.debug < CURRENT_LEVEL) return;
        _timers.set(label, performance.now());
        const ts = new Date().toISOString().slice(11, 23);
        console.log(`%c[${ts}] %c⏱ TIMER START%c › ${label}`, 'color:#888;font-size:10px', STYLES.time, STYLES.reset);
    },

    /** End a named timer and log elapsed ms */
    timeEnd(label) {
        if (LEVELS.debug < CURRENT_LEVEL) return;
        const start = _timers.get(label);
        if (start === undefined) {
            console.warn(`[logger] timeEnd called for unknown timer: "${label}"`);
            return;
        }
        const elapsed = (performance.now() - start).toFixed(2);
        _timers.delete(label);
        const ts = new Date().toISOString().slice(11, 23);
        console.log(
            `%c[${ts}] %c⏱ TIMER END%c   › ${label} — %c${elapsed}ms`,
            'color:#888;font-size:10px', STYLES.time, STYLES.reset, 'color:#fff;font-weight:bold'
        );
    },

    // ── Console group wrappers (debug only) ───────────────────────────────────

    group(label) {
        if (CURRENT_LEVEL <= LEVELS.debug) console.group(`%c▸ ${label}`, STYLES.badge);
    },

    groupEnd() {
        if (CURRENT_LEVEL <= LEVELS.debug) console.groupEnd();
    },

    groupCollapsed(label) {
        if (CURRENT_LEVEL <= LEVELS.debug) console.groupCollapsed(`%c▸ ${label}`, STYLES.badge);
    },

    // ── Boot summary (printed once at app start) ──────────────────────────────
    boot() {
        const ts = new Date().toISOString();
        if (IS_DEV) {
            console.log(
                `%c┌────────────────────────────────────────────────┐\n` +
                `│  WhatsApp Clone — Logger Initialized            │\n` +
                `│  Mode: %c${APP_ENV.padEnd(12)}%c  Level: %c${RAW_LEVEL.padEnd(8)}%c   │\n` +
                `│  Time: ${ts.slice(0, 19)}                   │\n` +
                `└────────────────────────────────────────────────┘`,
                'color:#37474f;font-weight:bold',
                'color:#81c995;font-weight:bold', 'color:#37474f;font-weight:bold',
                STYLES[RAW_LEVEL] || STYLES.info, 'color:#37474f;font-weight:bold'
            );
        } else {
            // Production: ultra quiet boot message
            console.info(`[${ts}] App starting — log:${RAW_LEVEL}`);
        }
    },
};

// Auto-boot on import
logger.boot();

export default logger;
