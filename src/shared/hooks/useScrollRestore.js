/**
 * useScrollRestore
 * Persists scroll position of a scrollable container across mounts/unmounts.
 * Uses an in-memory Map (sessionStorage could be used for cross-refresh persistence).
 */
import { useRef, useEffect } from 'react';
import logger from '@core/utils/logger';

// Module-level cache — survives component unmounts within the same session
const scrollCache = new Map();

/**
 * @param {string} key - Unique key for this scroll container (e.g. 'settings-main', 'sidebar-chats')
 * @returns {React.RefObject} ref — attach to the scrollable div
 */
export const useScrollRestore = (key) => {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Restore saved position on mount
        const saved = scrollCache.get(key);
        if (saved !== undefined) {
            el.scrollTop = saved;
            logger.debug('useScrollRestore', `restored: ${key} → ${saved}px`);
        }

        // Save position on unmount
        return () => {
            if (el) {
                scrollCache.set(key, el.scrollTop);
                logger.debug('useScrollRestore', `saved: ${key} → ${el.scrollTop}px`);
            }
        };
    }, [key]);

    return ref;
};

export default useScrollRestore;
