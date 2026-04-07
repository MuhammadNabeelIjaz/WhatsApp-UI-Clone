import React from 'react';

/**
 * SidebarTooltip — hover tooltip for the desktop primary sidebar nav buttons.
 * Appears to the right of the button using CSS group-hover.
 *
 * Usage:
 *   <div className="relative group flex items-center">
 *     <NavButton ... />
 *     <SidebarTooltip text="Chats" />
 *   </div>
 */
const SidebarTooltip = ({ text }) => (
    <div className="absolute left-[110%] invisible group-hover:visible opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-2 transition-all duration-300 bg-bg-hover text-text-primary text-[11px] font-medium py-1.5 px-3 rounded-lg whitespace-nowrap z-[300] shadow-xl border border-border-main/20 pointer-events-none">
        {text}
        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-bg-hover rotate-45 border-l border-b border-border-main/20" />
    </div>
);

export default SidebarTooltip;
