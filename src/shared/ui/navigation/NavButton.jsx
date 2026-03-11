import React from 'react';

/**
 * NavButton — Desktop sidebar rail + Mobile bottom tab button.
 * Used in AppNavigation for tab switching.
 *
 * Props:
 *   icon      — React node
 *   active    — boolean
 *   onClick
 *   label     — shown on mobile
 *   isMobile  — boolean (default false)
 */
const NavButton = ({ icon, active, onClick, label, isMobile = false }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center transition-all duration-300 relative group
            ${isMobile ? 'flex-1 py-1' : 'w-[50px] h-[50px] mx-auto mb-2 rounded-full hover:bg-bg-hover'}
            ${active ? 'text-text-accent' : 'text-text-secondary hover:text-white-hover'}
        `}
    >
        {/* Desktop active indicator */}
        {!isMobile && active && (
            <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-[3px] h-6 bg-accent rounded-r-full shadow-[0_0_8px_rgba(0,168,132,0.4)]" />
        )}

        {/* Icon */}
        <div className={`flex items-center justify-center rounded-full transition-all duration-300
            ${active && isMobile ? 'bg-accent/10 w-12 h-7' : ''}
            ${active ? 'scale-110' : 'group-hover:scale-105'}
        `}>
            {icon}
        </div>

        {/* Mobile label */}
        {isMobile && (
            <span className={`text-[11px] mt-1.5 font-medium tracking-tight transition-colors
                ${active ? 'text-text-accent' : 'text-text-secondary'}
            `}>
                {label}
            </span>
        )}
    </button>
);

export default NavButton;
