import React, { forwardRef } from 'react';

/**
 * TextInput — base text input used across the app.
 * Handles: chat search, settings search, add-contact, group-name, etc.
 *
 * Props:
 *   value, onChange, placeholder
 *   type         — 'text' | 'tel' | 'email' | 'number' | 'password'
 *   leftIcon     — React node (shown inside left side)
 *   rightElement — React node (shown inside right side)
 *   onClear      — if provided, shows × button when value non-empty
 *   variant      — 'filled' | 'underline'  (default 'filled')
 *   size         — 'sm' | 'md'
 *   className
 *   autoFocus, disabled, readOnly, onKeyDown, onFocus, onBlur
 */
const variants = {
    filled:    'bg-bg-input rounded-full px-4 py-2.5',
    underline: 'bg-transparent border-b border-accent pb-1 px-0 rounded-none',
};

const sizes = {
    sm: 'text-[13px]',
    md: 'text-[14px]',
};

const TextInput = forwardRef(({
    value,
    onChange,
    placeholder,
    type = 'text',
    leftIcon,
    rightElement,
    onClear,
    variant = 'filled',
    size = 'md',
    className = '',
    ...rest
}, ref) => (
    <div className={`flex items-center gap-2 ${variants[variant]} ${className}`}>
        {leftIcon && (
            <span className="text-text-secondary shrink-0">{leftIcon}</span>
        )}
        <input
            ref={ref}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`flex-1 bg-transparent outline-none placeholder:text-text-secondary text-text-primary ${sizes[size]}`}
            {...rest}
        />
        {onClear && value ? (
            <button
                type="button"
                onClick={onClear}
                className="text-text-secondary hover:text-text-primary transition-colors shrink-0"
            >
                ✕
            </button>
        ) : rightElement ? (
            <span className="shrink-0">{rightElement}</span>
        ) : null}
    </div>
));

TextInput.displayName = 'TextInput';
export default TextInput;
