import React, { useEffect, useRef, useState } from 'react';
import { Icons } from '@constants/icons';

/**
 * ChatSearchBar
 * Slides down from header when in-chat search is active.
 * Props: query, onChange, onClose, resultCount, currentIndex, onNext, onPrev
 */
const ChatSearchBar = ({
    query = '',
    onChange,
    onClose,
    resultCount = 0,
    currentIndex = 0,
    onNext,
    onPrev,
}) => {
    const inputRef = useRef(null);
    const [localQuery, setLocalQuery] = useState(query);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleChange = (e) => {
        setLocalQuery(e.target.value);
        onChange?.(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') onNext?.();
        if (e.key === 'Escape') onClose?.();
    };

    return (
        <div
            className="flex items-center gap-2 px-3 py-2 border-b shrink-0 animate-fade-in relative z-[450]"
            style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'rgba(255,255,255,0.06)',
            }}
        >
            {/* Back / Close */}
            <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-bg-hover text-text-secondary active:scale-90 transition-all shrink-0"
            >
                <Icons.ArrowLeft size={20} />
            </button>

            {/* Search Input */}
            <input
                ref={inputRef}
                type="text"
                value={localQuery}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Search messages..."
                className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-text-secondary"
                style={{ color: 'var(--text-primary)' }}
            />

            {/* Result Counter + Navigation */}
            {localQuery.length > 0 && (
                <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[12px] text-text-secondary whitespace-nowrap">
                        {resultCount === 0 ? 'No results' : `${currentIndex + 1} of ${resultCount}`}
                    </span>
                    <button
                        onClick={onPrev}
                        disabled={resultCount === 0}
                        className="p-1.5 rounded-full hover:bg-bg-hover text-text-secondary disabled:opacity-30 transition-all"
                    >
                        <Icons.ChevronDown size={18} className="rotate-180" />
                    </button>
                    <button
                        onClick={onNext}
                        disabled={resultCount === 0}
                        className="p-1.5 rounded-full hover:bg-bg-hover text-text-secondary disabled:opacity-30 transition-all"
                    >
                        <Icons.ChevronDown size={18} />
                    </button>
                </div>
            )}

            {/* Clear / X */}
            {localQuery.length > 0 && (
                <button
                    onClick={() => { setLocalQuery(''); onChange?.(''); inputRef.current?.focus(); }}
                    className="p-1.5 rounded-full hover:bg-bg-hover text-text-secondary active:scale-90 transition-all shrink-0"
                >
                    <Icons.X size={18} />
                </button>
            )}
        </div>
    );
};

export default ChatSearchBar;
