import React from 'react';
import Avatar from '@shared/ui/display/Avatar';

/**
 * ContactRow — contact list row with avatar, name, subtitle, and optional right element.
 * Used in SelectContactScreen, NewGroupScreen, NewBroadcastScreen,
 * AddFavoriteHub, InviteSettingsScreen, BlockedContacts.
 *
 * Props:
 *   name         — string
 *   subtitle     — string (status/phone)
 *   avatar       — image URL
 *   initials     — string (fallback)
 *   color        — hex bg color
 *   rightElement — React node (checkbox circle, invite button, etc.)
 *   onClick
 *   className
 */
const ContactRow = ({ name, subtitle, avatar, initials, color, rightElement, onClick, className = '' }) => {
    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-4 px-4 py-3 hover:bg-bg-hover cursor-pointer active:bg-bg-hover/80 transition-colors border-b border-border-main/20 ${className}`}
        >
            {/* Avatar */}
            <Avatar
                src={avatar}
                name={name}
                initials={initials}
                color={color}
                size={48}
            />

            {/* Text */}
            <div className="flex-1 min-w-0">
                <p className="text-[16px] text-text-primary font-medium truncate">{name}</p>
                {subtitle && <p className="text-[13px] text-text-secondary truncate">{subtitle}</p>}
            </div>

            {/* Right slot */}
            {rightElement && (
                <div className="shrink-0 mr-1">{rightElement}</div>
            )}
        </div>
    );
};

export default React.memo(ContactRow);
