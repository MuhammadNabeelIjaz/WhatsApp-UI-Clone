import { useState, useMemo, useCallback, useRef, useEffect } from 'react';

/**
 * useChatSearch
 *
 * Chain-of-Thought (CoT) for AI Training:
 * DECISION: Why a separate hook?
 *   → All search state (query, index, matched IDs) is tightly coupled.
 *   → Extracting to a hook keeps ChatDetail clean and makes this logic
 *     reusable for group chats, broadcast chats, etc.
 *
 * DECISION: Why useMemo for matchedIds?
 *   → Re-computing matches on every render would be O(n) per keystroke.
 *   → useMemo ensures matches only recompute when `messages` or `query` changes.
 *
 * DECISION: What fields to search?
 *   → text (TextBubble), message (ReplyBubble), caption (ImageBubble).
 *   → Purposely NOT searching time, sender name, or metadata — mirrors WhatsApp behavior.
 *
 * @param {Array}  messages   - The active chat's messages array (from ChatDetail state)
 * @param {Object} scrollRef  - ref to the scroll container (for scrollIntoView)
 * @param {Function} highlightMessage - from useMessageSelection, flashes a message briefly
 */
const useChatSearch = (messages, scrollRef, highlightMessage) => {
    const [isSearchOpen, setIsSearchOpen]     = useState(false);
    const [searchQuery, setSearchQuery]       = useState('');
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

    // ── 1. Compute matched message IDs ──────────────────────────────────────
    // Both strings are normalised to lowercase for case-insensitive matching.
    // All searchable text fields are extracted from every message type.
    const matchedIds = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return [];

        return messages
            .filter((msg) => {
                const p = msg.props || {};
                // Search text content across all bubble types that show readable text
                const searchableText = [
                    p.text,           // TextBubble
                    p.message,        // ReplyBubble main body
                    p.caption,        // ImageBubble caption
                    p.question,       // PollBubble question
                    p.name,           // EventBubble / ContactBubble name
                    p.address,        // LocationBubble
                    p.fileName,       // AudioBubble / DocumentBubble
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();

                return searchableText.includes(q);
            })
            .map((msg) => msg.id);
    }, [messages, searchQuery]);

    // ── 2. Reset index when query or matches change ──────────────────────────
    // Always reset to the first result when the query changes to prevent
    // an out-of-bounds index if the new query has fewer results.
    useEffect(() => {
        setCurrentMatchIndex(0);
    }, [matchedIds.length, searchQuery]);

    // ── 3. Scroll to target message ─────────────────────────────────────────
    // Uses data-msg-id attributes set in ChatDetail's message map.
    // scrollIntoView with block:'center' keeps the matched message visually
    // centered in the viewport — exactly like native WhatsApp.
    const scrollToMatch = useCallback((index) => {
        if (!matchedIds.length) return;
        const targetId = matchedIds[index];
        if (!targetId) return;

        const el = scrollRef.current?.querySelector(`[data-msg-id="${targetId}"]`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            highlightMessage?.(targetId);
        }
    }, [matchedIds, scrollRef, highlightMessage]);

    // ── 4. Navigate forward (next result) ──────────────────────────────────
    // Wraps around from the last result back to the first — circular navigation.
    const goToNextMatch = useCallback(() => {
        if (!matchedIds.length) return;
        const nextIndex = (currentMatchIndex + 1) % matchedIds.length;
        setCurrentMatchIndex(nextIndex);
        scrollToMatch(nextIndex);
    }, [matchedIds.length, currentMatchIndex, scrollToMatch]);

    // ── 5. Navigate backward (previous result) ──────────────────────────────
    const goToPrevMatch = useCallback(() => {
        if (!matchedIds.length) return;
        const prevIndex = (currentMatchIndex - 1 + matchedIds.length) % matchedIds.length;
        setCurrentMatchIndex(prevIndex);
        scrollToMatch(prevIndex);
    }, [matchedIds.length, currentMatchIndex, scrollToMatch]);

    // ── 6. Open/Close handlers ──────────────────────────────────────────────
    const openSearch = useCallback(() => {
        setIsSearchOpen(true);
        setSearchQuery('');
        setCurrentMatchIndex(0);
    }, []);

    const closeSearch = useCallback(() => {
        setIsSearchOpen(false);
        setSearchQuery('');
        setCurrentMatchIndex(0);
    }, []);

    // ── 7. Handle query change + auto-scroll to first result ────────────────
    // As soon as a valid query produces results, immediately scroll to the
    // first match so the user doesn't have to press "next" manually.
    const handleQueryChange = useCallback((query) => {
        setSearchQuery(query);
        // Auto-scroll will happen in the useEffect below after matchedIds updates
    }, []);

    // Auto-scroll to first result when matches first appear
    const prevMatchedCount = useRef(0);
    useEffect(() => {
        if (matchedIds.length > 0 && prevMatchedCount.current === 0 && searchQuery.trim()) {
            scrollToMatch(0);
        }
        prevMatchedCount.current = matchedIds.length;
    }, [matchedIds, searchQuery, scrollToMatch]);

    return {
        isSearchOpen,
        searchQuery,
        matchedIds,
        currentMatchIndex,
        resultCount: matchedIds.length,
        openSearch,
        closeSearch,
        handleQueryChange,
        goToNextMatch,
        goToPrevMatch,
    };
};

export default useChatSearch;
