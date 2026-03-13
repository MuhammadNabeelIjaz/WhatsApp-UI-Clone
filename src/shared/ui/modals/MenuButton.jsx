import React from 'react';

/**
 * MenuButton — dropdown menu item with icon and label.
 * Used in MainSidebar, CallsScreen, StatusScreen, CommunitiesScreen — identical pattern.
 *
 * Props:
 *   icon    — React node
 *   label   — string
 *   onClick — handler
 *   danger  — shows red color
 */
const MenuButton = ({ icon, label, onClick, danger = false }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-4 py-2.5 hover:bg-bg-hover transition-colors group
            ${danger ? 'text-red-500' : 'text-text-primary'}
        `}
    >
        <span className={`flex shrink-0 ${danger ? 'text-red-500' : 'text-text-secondary group-hover:text-text-primary'}`}>
            {icon}
        </span>
        <span className="text-[14.5px] font-normal whitespace-nowrap overflow-hidden text-ellipsis flex-1 text-left">
            {label}
        </span>
    </button>
);

export default MenuButton;
