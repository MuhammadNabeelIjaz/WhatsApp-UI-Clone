import React from 'react';
import { Icons } from '@constants/icons';

/**
 * ListItem — generic tappable row.
 * Used in Settings, Contacts, Linked Devices, Privacy lists, etc.
 *
 * Props:
 *   leftElement   — React node (icon, avatar, etc.)
 *   title         — string
 *   subtitle      — string
 *   rightElement  — React node (toggle, badge, text)
 *   showChevron   — auto-shows › if onClick provided and no rightElement (default true)
 *   onClick
 *   active        — highlight row
 *   className
 */
const ListItem = ({
    leftElement,
    title,
    subtitle,
    rightElement,
    showChevron = true,
    onClick,
    active = false,
    className = '',
}) => (
    <div
        onClick={onClick}
        className={`
            flex items-center px-5 py-4 gap-4 transition-all duration-150 group
            ${onClick ? 'cursor-pointer hover:bg-bg-hover active:bg-bg-hover/80' : ''}
            ${active ? 'bg-bg-hover/60' : ''}
            ${className}
        `}
    >
        {/* Left slot */}
        {leftElement && (
            <div className="shrink-0 flex items-center justify-center w-6 text-text-secondary">
                {leftElement}
            </div>
        )}

        {/* Text */}
        <div className="flex-1 min-w-0">
            <p className="text-[16px] font-normal text-text-primary leading-tight truncate">{title}</p>
            {subtitle && (
                <p className="text-[13px] text-text-secondary mt-0.5 leading-snug truncate">{subtitle}</p>
            )}
        </div>

        {/* Right slot */}
        {rightElement ? (
            <div className="shrink-0">{rightElement}</div>
        ) : (onClick && showChevron) ? (
            <Icons.ChevronRight size={16} className="text-text-secondary/40 shrink-0" />
        ) : null}
    </div>
);

export default ListItem;
