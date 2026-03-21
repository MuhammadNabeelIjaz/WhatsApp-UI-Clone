import { useState, useCallback } from 'react';

/**
 * Message multi-select state for ChatDetail.
 * Tracks selected IDs, active reaction popup, and reply target.
 *
 * @returns selection state + action handlers
 */
const useMessageSelection = () => {
    const [selectedMessages, setSelectedMessages]     = useState([]);
    const [replyingTo, setReplyingTo]                 = useState(null);
    const [highlightedMessageId, setHighlightedMessageId] = useState(null);
    const [activeReactionId, setActiveReactionId]     = useState(null);
    const [popupPos, setPopupPos]                     = useState({ x: 0, y: 0 });

    const selectionModeActive = selectedMessages.length > 0;

    const toggleMessageSelection = useCallback((id) => {
        setSelectedMessages((prev) =>
            prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
        );
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedMessages([]);
        setActiveReactionId(null);
    }, []);

    /**
     * Open context menu / reaction popup on long-press or right-click.
     * @param {Event} e
     * @param {string} msgId
     * @param {React.RefObject} containerRef - scroll container ref for position calc
     */
    const handleContextMenu = useCallback((e, msgId, containerRef) => {
        e.preventDefault();
        const clickX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
        const clickY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;

        if (containerRef?.current?.parentElement) {
            const rect = containerRef.current.parentElement.getBoundingClientRect();
            let x = clickX - rect.left;
            let y = clickY - rect.top;
            const popW = 280;
            if (x < 15) x = 15;
            else if (x + popW > rect.width - 15) x = rect.width - popW - 15;
            if (y < 80) y = y + 80;
            setPopupPos({ x, y });
        }

        setActiveReactionId(msgId);
        setSelectedMessages((prev) => (prev.includes(msgId) ? prev : [...prev, msgId]));
        if (window.navigator.vibrate) window.navigator.vibrate(50);
    }, []);

    const highlightMessage = useCallback((id) => {
        setHighlightedMessageId(id);
        window.setTimeout(
            () => setHighlightedMessageId((current) => (current === id ? null : current)),
            2500
        );
    }, []);

    return {
        selectedMessages,
        replyingTo,
        setReplyingTo,
        highlightedMessageId,
        highlightMessage,
        activeReactionId,
        setActiveReactionId,
        popupPos,
        selectionModeActive,
        toggleMessageSelection,
        clearSelection,
        handleContextMenu,
    };
};

export default useMessageSelection;
