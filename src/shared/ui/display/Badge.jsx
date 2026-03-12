import React from 'react';

/**
 * Badge — unread count / notification pill.
 * Used in ChatListItem, MiniSidebar, CallHistoryItem, etc.
 *
 * Props:
 *   count     — number | string
 *   max       — truncate above this (default 99)
 *   muted     — shows grey style instead of accent
 *   dot       — shows a small dot (no count)
 *   className
 */
const Badge = ({ count, max = 99, muted = false, dot = false, className = '' }) => {
    if (dot) {
        return (
            <span className={`w-2 h-2 rounded-full ${muted ? 'bg-text-secondary/50' : 'bg-accent'} ${className}`} />
        );
    }

    if (!count && count !== 0) return null;

    const display = typeof count === 'number' && count > max ? `${max}+` : count;

    return (
        <span
            className={`
                inline-flex items-center justify-center
                min-w-[20px] h-[20px] px-1
                rounded-full text-[11px] font-bold text-white
                ${muted ? 'bg-text-secondary/40' : 'bg-accent'}
                ${className}
            `}
        >
            {display}
        </span>
    );
};

export default React.memo(Badge);
