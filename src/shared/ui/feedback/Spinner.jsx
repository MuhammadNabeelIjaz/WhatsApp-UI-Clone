import React from 'react';

/**
 * Spinner — loading indicator.
 * Used in async operations, screen transitions.
 *
 * Props:
 *   size     — 'sm' | 'md' | 'lg'
 *   centered — wrap in centering div
 *   className
 */
const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-7 h-7 border-2',
    lg: 'w-10 h-10 border-[3px]',
};

const Spinner = ({ size = 'md', centered = false, className = '' }) => {
    const el = (
        <span
            className={`
                inline-block rounded-full border-accent border-t-transparent animate-spin
                ${sizes[size]} ${className}
            `}
        />
    );

    if (centered) {
        return (
            <div className="flex items-center justify-center w-full py-10">
                {el}
            </div>
        );
    }
    return el;
};

export default Spinner;
