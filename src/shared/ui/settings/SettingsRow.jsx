import React from 'react';
import { Icons } from '@constants/icons';

/**
 * SettingsRow — standard settings list row used throughout all settings screens.
 * Extracted from features/settings/components/SettingsRow.jsx.
 *
 * Props:
 *   icon         — React node (left icon)
 *   title        — string | React node
 *   subtitle     — string
 *   onClick      — if provided, row is clickable and shows chevron
 *   rightElement — React node (toggle, badge, text, etc.)
 */
const SettingsRow = ({ icon, title, subtitle, onClick, rightElement }) => {
    const isClickable = !!onClick;
    return (
        <div
            onClick={onClick}
            className={`flex items-center px-5 py-4 transition-all duration-200 group
                ${isClickable ? 'cursor-pointer hover:bg-bg-hover active:bg-bg-hover/80' : ''}
            `}
        >
            {/* Left Icon */}
            <div className={`mr-6 flex shrink-0 w-6 items-center justify-center text-text-secondary ${isClickable ? 'group-hover:text-accent transition-colors' : ''}`}>
                {icon || null}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <span className="text-[16.5px] font-normal leading-tight text-text-primary">{title}</span>
                {subtitle && (
                    <span className="text-[14px] mt-0.5 text-text-secondary opacity-80 leading-snug">{subtitle}</span>
                )}
            </div>

            {/* Right element OR chevron */}
            {rightElement ? (
                <div className="ml-4 flex-shrink-0">{rightElement}</div>
            ) : isClickable ? (
                <Icons.ChevronRight size={18} className="ml-2 text-text-secondary opacity-40 flex-shrink-0" />
            ) : null}
        </div>
    );
};

export default React.memo(SettingsRow);
