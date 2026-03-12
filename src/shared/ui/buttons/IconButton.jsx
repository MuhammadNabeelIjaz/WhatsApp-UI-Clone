import React from 'react';

/**
 * IconButton — rounded icon-only button used throughout the app.
 * Usage: header back, close, action icons in chat, settings etc.
 *
 * Props:
 *   icon       — React node (lucide icon)
 *   onClick    — click handler
 *   size       — 'sm' | 'md' | 'lg'  (default 'md')
 *   variant    — 'ghost' | 'filled' | 'danger'  (default 'ghost')
 *   disabled   — boolean
 *   className  — extra classes
 *   title      — tooltip text
 */
const sizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
};

const variants = {
    ghost:  'text-text-secondary hover:bg-bg-hover hover:text-white active:scale-90',
    filled: 'bg-accent text-white hover:opacity-90 active:scale-90',
    danger: 'text-red-400 hover:bg-red-500/10 active:scale-90',
};

const IconButton = ({
    icon,
    onClick,
    size = 'md',
    variant = 'ghost',
    disabled = false,
    className = '',
    title,
    ...rest
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`
            flex items-center justify-center rounded-full
            transition-all duration-200 shrink-0
            disabled:opacity-30 disabled:pointer-events-none
            ${sizes[size]}
            ${variants[variant]}
            ${className}
        `}
        {...rest}
    >
        {icon}
    </button>
);

export default IconButton;
