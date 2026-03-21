import { useState, useCallback } from 'react';

/**
 * Manages the "pinned messages" bar inside ChatDetail.
 * Max 3 pins. Cycles through pinned messages on click.
 *
 * @returns {{ pinnedMessages, pinnedIndex, pinToast, handlePin, handleUnpin, cyclePin }}
 */
const usePinnedMessages = () => {
    const [pinnedMessages, setPinnedMessages] = useState([]);
    const [pinnedIndex, setPinnedIndex]       = useState(0);
    const [pinToast, setPinToast]             = useState(false);

    const handlePin = useCallback((message) => {
        if (!message) return false;
        let success = false;
        setPinnedMessages((prev) => {
            if (prev.find((p) => p.id === message.id)) return prev; // already pinned
            if (prev.length >= 3) {
                setPinToast(true);
                setTimeout(() => setPinToast(false), 2500);
                return prev;
            }
            success = true;
            return [...prev, message];
        });
        return success;
    }, []);

    const handleUnpin = useCallback((index) => {
        setPinnedMessages((prev) => {
            const next = prev.filter((_, i) => i !== index);
            setPinnedIndex((i) => Math.min(i, next.length - 1));
            return next;
        });
    }, []);

    const cyclePin = useCallback(() => {
        setPinnedIndex((i) => (i + 1) % (pinnedMessages.length || 1));
    }, [pinnedMessages.length]);

    return { pinnedMessages, pinnedIndex, pinToast, handlePin, handleUnpin, cyclePin };
};

export default usePinnedMessages;
