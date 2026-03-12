import React, { forwardRef, useEffect, useRef } from 'react';

/**
 * Textarea — auto-expanding textarea used in ChatInputBar and similar.
 *
 * Props:
 *   value, onChange, placeholder
 *   maxRows     — caps expansion (default 6)
 *   onKeyDown
 *   className
 */
const Textarea = forwardRef(({
    value,
    onChange,
    placeholder,
    maxRows = 6,
    className = '',
    ...rest
}, ref) => {
    const innerRef = useRef(null);
    const resolvedRef = ref || innerRef;

    useEffect(() => {
        const el = resolvedRef.current;
        if (!el) return;
        el.style.height = 'auto';
        const lineH = parseInt(getComputedStyle(el).lineHeight) || 20;
        const maxH = lineH * maxRows;
        el.style.height = `${Math.min(el.scrollHeight, maxH)}px`;
        el.style.overflowY = el.scrollHeight > maxH ? 'auto' : 'hidden';
    }, [value, maxRows, resolvedRef]);

    return (
        <textarea
            ref={resolvedRef}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={1}
            className={`
                w-full bg-transparent resize-none outline-none
                text-[14.5px] text-text-primary
                placeholder:text-text-secondary
                leading-[1.45] py-2
                custom-scrollbar
                ${className}
            `}
            {...rest}
        />
    );
});

Textarea.displayName = 'Textarea';
export default Textarea;
