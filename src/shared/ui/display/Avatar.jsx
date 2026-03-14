import React from 'react';

/**
 * Avatar — contact/group/channel avatar with initials fallback.
 * Used in ChatListItem, ChatDetail, CallHistory, UserInfo, etc.
 *
 * Props:
 *   src          — image URL
 *   name         — used for initials fallback
 *   initials     — override auto-generated initials
 *   color        — bg color for initials (hex)
 *   size         — 'xs'|'sm'|'md'|'lg'|'xl'|'2xl' or number (px)
 *   shape        — 'circle' | 'rounded' (for groups/communities)
 *   selected     — shows checkmark overlay
 *   badge        — React node rendered bottom-right
 *   onClick
 *   className
 */
const sizeMap = {
    xs:  'w-7 h-7 text-xs',
    sm:  'w-9 h-9 text-sm',
    md:  'w-[52px] h-[52px] text-lg',
    lg:  'w-16 h-16 text-xl',
    xl:  'w-20 h-20 text-2xl',
    '2xl': 'w-28 h-28 text-3xl',
};

const Avatar = ({
    src,
    name = '?',
    initials,
    color,
    size = 'md',
    shape = 'circle',
    selected = false,
    badge,
    onClick,
    className = '',
}) => {
    const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-xl';
    const sizeClass = typeof size === 'number'
        ? ''
        : (sizeMap[size] || sizeMap.md);
    const inlineSize = typeof size === 'number'
        ? { width: size, height: size }
        : {};

    const autoInitials = (
        initials ||
        name.split(' ').map(w => w[0]).join('')
    ).slice(0, 2).toUpperCase();

    return (
        <div
            className={`relative flex-shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
            onClick={onClick}
            style={inlineSize}
        >
            {/* Image */}
            {src && (
                <img
                    src={src}
                    alt={name}
                    className={`${sizeClass} ${shapeClass} object-cover ${selected ? 'scale-90' : ''}`}
                    style={inlineSize}
                    onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
            )}

            {/* Initials fallback */}
            <div
                className={`
                    ${sizeClass} ${shapeClass} flex items-center justify-center
                    font-bold text-white select-none
                    ${selected ? 'scale-90' : ''}
                    ${src ? 'hidden' : 'flex'}
                `}
                style={{ backgroundColor: color || '#6b7280', ...inlineSize }}
            >
                {autoInitials}
            </div>

            {/* Selection overlay */}
            {selected && (
                <div className={`absolute inset-0 ${shapeClass} bg-accent/40 flex items-center justify-center`}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
            )}

            {/* Badge slot (pin, group icon, unread, etc.) */}
            {badge && (
                <div className="absolute -bottom-0.5 -right-0.5">
                    {badge}
                </div>
            )}
        </div>
    );
};

export default React.memo(Avatar);
