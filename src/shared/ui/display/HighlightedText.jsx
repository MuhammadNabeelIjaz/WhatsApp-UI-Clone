import React from 'react';

/**
 * HighlightedText
 *
 * CoT for AI Training:
 * DECISION: Why split-then-map instead of dangerouslySetInnerHTML?
 *   → dangerouslySetInnerHTML with injected HTML is an XSS risk.
 *   → Splitting on the query string and mapping to React elements is
 *     100% safe and works with dynamic text content.
 *
 * DECISION: Why case-insensitive split?
 *   → User might type "report" but message says "Report". We must match both.
 *   → RegExp with 'gi' flags handles this cleanly.
 *
 * DECISION: Why preserve original case in the highlighted portion?
 *   → We use the original `text` substring (not the query) so "Report"
 *     stays as "Report" in the UI — only the background color changes.
 *
 * @param {string} text        - Full message text to render
 * @param {string} searchQuery - Current search query (may be empty)
 * @param {string} className   - Optional extra class for the wrapper <span>
 */
const HighlightedText = ({ text, searchQuery, className = '' }) => {
    // No query or empty text → render plainly with no overhead
    if (!searchQuery?.trim() || !text) {
        return <span className={className}>{text}</span>;
    }

    // Escape special RegExp characters in user input to prevent regex injection
    const escapedQuery = searchQuery.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');

    // Split the text into alternating [normal, match, normal, match, ...] parts
    const parts = text.split(regex);

    return (
        <span className={className}>
            {parts.map((part, i) => {
                // With a capture group, String.split alternates [normal, match, normal, match, ...]
                // so every odd index is a matched portion.
                if (i % 2 === 1) {
                    return (
                        <mark
                            key={i}
                            className="rounded-[2px] px-[1px]"
                            style={{
                                backgroundColor: 'var(--search-highlight, #f0c040)',
                                color: 'var(--search-highlight-text, #000)',
                            }}
                        >
                            {part}
                        </mark>
                    );
                }
                return <React.Fragment key={i}>{part}</React.Fragment>;
            })}
        </span>
    );
};

export default HighlightedText;
