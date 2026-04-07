import { useEffect } from 'react';

/**
 * Fires `callback` when a mousedown event occurs outside `ref`.
 * Replaces 12+ inline useEffect patterns across the codebase.
 *
 * @param {React.RefObject} ref - The element to watch
 * @param {Function} callback  - Called when click is outside ref
 * @param {boolean} [enabled=true] - Set false to suspend the listener
 */
const useOutsideClick = (ref, callback, enabled = true) => {
    useEffect(() => {
        if (!enabled) return;
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                callback(e);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [ref, callback, enabled]);
};

export default useOutsideClick;
