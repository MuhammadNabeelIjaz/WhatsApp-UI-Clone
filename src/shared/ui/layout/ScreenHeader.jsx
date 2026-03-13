import React from 'react';
import { Icons } from '@constants/icons';
import IconButton from '../buttons/IconButton';

/**
 * ScreenHeader — top navigation bar used on every screen/panel.
 * Handles back button, title, subtitle, right actions.
 *
 * Props:
 *   title        — string
 *   subtitle     — string (smaller text below title)
 *   onBack       — if provided, shows back arrow button
 *   leftElement  — replace back arrow with custom node
 *   rightActions — array of React nodes, OR single React node
 *   border       — show bottom border (default true)
 *   className
 */
const ScreenHeader = ({
    title,
    subtitle,
    onBack,
    leftElement,
    rightActions,
    border = true,
    className = '',
}) => {
    const actions = Array.isArray(rightActions) ? rightActions : (rightActions ? [rightActions] : []);

    return (
        <header
            className={`
                flex items-center px-4 py-3 shrink-0 gap-2 bg-bg-surface
                ${border ? 'border-b border-border-main/5' : ''}
                ${className}
            `}
        >
            {/* Left: back btn or custom */}
            {leftElement || (onBack && (
                <IconButton
                    icon={<Icons.ArrowLeft size={22} />}
                    onClick={onBack}
                    className="-ml-1"
                />
            ))}

            {/* Title block */}
            <div className="flex-1 min-w-0 ml-1">
                {title && (
                    <h1 className="text-[17px] font-semibold text-text-primary leading-tight truncate">
                        {title}
                    </h1>
                )}
                {subtitle && (
                    <p className="text-[12px] text-text-secondary leading-none mt-0.5 truncate">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Right actions */}
            {actions.length > 0 && (
                <div className="flex items-center gap-1 shrink-0">
                    {actions.map((action, i) => (
                        <React.Fragment key={i}>{action}</React.Fragment>
                    ))}
                </div>
            )}
        </header>
    );
};

export default ScreenHeader;
