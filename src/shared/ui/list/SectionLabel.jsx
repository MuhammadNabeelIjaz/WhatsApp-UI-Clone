import React from 'react';

/**
 * SectionLabel — small uppercase section label used in contact list screens.
 * Used in SelectContactScreen, NewGroupScreen, NewBroadcastScreen,
 * InviteSettingsScreen, AddFavoriteHub, ForwardPicker, etc.
 *
 * Props:
 *   label     — string
 *   className — extra classes
 */
const SectionLabel = ({ label, className = '' }) => (
    <p className={`px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-text-secondary ${className}`}>
        {label}
    </p>
);

export default React.memo(SectionLabel);
