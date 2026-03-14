import React from 'react';

/**
 * Button — full-width or inline primary/secondary action button.
 * Used in dialogs, settings rows, call-to-action areas.
 *
 * Props:
 *   children   — label
 *   onClick
 *   variant    — 'primary' | 'secondary' | 'danger' | 'ghost'
 *   size       — 'sm' | 'md' | 'lg'
 *   fullWidth  — boolean
 *   disabled
 *   loading    — shows spinner
 *   leftIcon   — React node
 *   rightIcon  — React node
 *   className
 */
const variants = {
    primary:   'bg-accent text-white hover:opacity-90 active:scale-[0.98]',
    secondary: 'border border-border-main text-text-primary hover:bg-bg-hover active:scale-[0.98]',
    danger:    'bg-red-500 text-white hover:bg-red-600 active:scale-[0.98]',
    ghost:     'text-text-secondary hover:bg-bg-hover active:scale-[0.98]',
};

const sizes = {
    sm: 'px-4 py-2 text-[13px]',
    md: 'px-5 py-[10px] text-[14px]',
    lg: 'px-6 py-3 text-[15px]',
};

const Button = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    loading = false,
    leftIcon,
    rightIcon,
    className = '',
    ...rest
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        className={`
            inline-flex items-center justify-center gap-2 font-medium rounded-full
            transition-all duration-200
            disabled:opacity-40 disabled:pointer-events-none
            ${variants[variant]}
            ${sizes[size]}
            ${fullWidth ? 'w-full' : ''}
            ${className}
        `}
        {...rest}
    >
        {loading ? (
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
            <>
                {leftIcon && <span className="shrink-0">{leftIcon}</span>}
                {children}
                {rightIcon && <span className="shrink-0">{rightIcon}</span>}
            </>
        )}
    </button>
);

export default Button;
