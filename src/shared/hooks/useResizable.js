import { useState, useCallback, useEffect } from 'react';

/**
 * Drag-to-resize hook.
 * Extracts all resize logic from MainLayout — no more inline mouse handlers.
 *
 * @param {object} options
 * @param {number} options.initial   - Initial size in px
 * @param {number} options.min       - Minimum allowed size
 * @param {number} options.max       - Maximum allowed size
 * @param {'left'|'right'} [options.edge='right'] - Which edge the drag handle sits on
 * @param {number} [options.offset=0] - Fixed px offset subtracted from cursor (e.g. rail width)
 * @returns {{ size, isResizing, startResizing, resetSize }}
 */
const useResizable = ({ initial, min, max, edge = 'right', offset = 0 }) => {
    const [size, setSize] = useState(initial);
    const [isResizing, setIsResizing] = useState(false);

    const startResizing = useCallback((e) => {
        e.preventDefault();
        setIsResizing(true);
    }, []);

    const stopResizing = useCallback(() => setIsResizing(false), []);

    const resize = useCallback((e) => {
        if (!isResizing) return;
        let newSize;
        if (edge === 'right') {
            // Handle on right edge: width = cursor.x - offset
            newSize = e.clientX - offset;
        } else {
            // Handle on left edge (right panel): width = window.innerWidth - cursor.x
            newSize = window.innerWidth - e.clientX;
        }
        if (newSize >= min && newSize <= max) setSize(newSize);
    }, [isResizing, edge, offset, min, max]);

    const resetSize = useCallback(() => setSize(initial), [initial]);

    useEffect(() => {
        if (!isResizing) return;
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResizing);
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [isResizing, resize, stopResizing]);

    return { size, isResizing, startResizing, resetSize };
};

export default useResizable;
