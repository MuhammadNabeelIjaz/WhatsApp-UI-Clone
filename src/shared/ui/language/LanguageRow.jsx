/**
 * shared/ui/language/LanguageRow.jsx
 *
 * Atomic, reusable row for a single language option.
 * Matches the project's ContactRow / PhoneField component pattern:
 *   — no external deps, pure Tailwind + CSS vars
 *   — receives everything via props, owns zero state
 */

import React from 'react';
import { Icons } from '@constants/icons';

const LanguageRow = ({ language, isSelected, onSelect }) => {
    const { code, nativeName, name, flag, dir } = language;

    return (
        <div
            onClick={() => onSelect(code)}
            className={`
                flex items-center gap-4 px-4 py-3.5
                hover:bg-bg-hover cursor-pointer
                active:bg-bg-hover/80 transition-colors
                border-b border-border-main/10
                ${isSelected ? 'bg-accent/5' : ''}
            `}
        >
            {/* Flag */}
            <span className="text-[26px] leading-none shrink-0 select-none">{flag}</span>

            {/* Names */}
            <div className="flex-1 min-w-0" dir={dir}>
                <p className="text-[16px] text-text-primary font-medium truncate">{nativeName}</p>
                {nativeName !== name && (
                    <p className="text-[13px] text-text-secondary truncate">{name}</p>
                )}
            </div>

            {/* Selected indicator */}
            <div
                className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                    shrink-0 transition-all
                    ${isSelected ? 'bg-accent border-accent' : 'border-border-main/50'}
                `}
            >
                {isSelected && <Icons.Check size={12} className="text-white" strokeWidth={3} />}
            </div>
        </div>
    );
};

export default LanguageRow;
