import React, { forwardRef } from 'react';
import { Icons } from '@constants/icons';

/**
 * SearchInput — pill-style search bar used across the app.
 * Sidebar, Settings, SelectContact, AddFavorite, etc.
 *
 * Props:
 *   value, onChange, onClear
 *   placeholder  (default 'Search...')
 *   autoFocus
 *   className
 */
const SearchInput = forwardRef(({
    value,
    onChange,
    onClear,
    placeholder = 'Search...',
    autoFocus = false,
    className = '',
    ...rest
}, ref) => (
    <div className={`flex items-center gap-2 bg-bg-input rounded-full px-4 py-2.5 ${className}`}>
        <Icons.Search size={16} className="text-text-secondary shrink-0" />
        <input
            ref={ref}
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="flex-1 bg-transparent text-[14px] text-text-primary outline-none placeholder:text-text-secondary"
            {...rest}
        />
        {value && onClear && (
            <button
                type="button"
                onClick={onClear}
                className="text-text-secondary hover:text-text-primary transition-colors shrink-0"
            >
                <Icons.X size={16} />
            </button>
        )}
    </div>
));

SearchInput.displayName = 'SearchInput';
export default SearchInput;
