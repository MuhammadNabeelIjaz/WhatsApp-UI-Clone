/**
 * SidebarFAB
 * Floating action button with speed-dial options:
 * New contact, New community, New group.
 */
import React from 'react';
import { Icons } from '@constants/icons';

const FabItem = ({ label, icon, onClick }) => (
    <div className="flex items-center gap-3">
        <span className="px-3 py-1.5 bg-bg-surface rounded-lg shadow-lg text-[13px] font-medium text-text-primary border border-border-main/20 whitespace-nowrap">
            {label}
        </span>
        <button
            onClick={onClick}
            className="w-12 h-12 rounded-full bg-bg-surface shadow-xl flex items-center justify-center text-accent border border-border-main/20 active:scale-90 transition-all"
        >
            {icon}
        </button>
    </div>
);

const SidebarFAB = ({ isVisible, onNewContact, onNewCommunity, onNewGroup }) => {
    const [open, setOpen] = React.useState(false);
    if (!isVisible) return null;

    return (
        <>
            {/* Backdrop */}
            {open && <div className="absolute inset-0 z-[99]" onClick={() => setOpen(false)} />}

            <div className="absolute bottom-6 right-5 flex flex-col items-end gap-3 z-[100]">
                {open && (
                    <div className="flex flex-col items-end gap-2 animate-fade-in">
                        <FabItem label="New contact"   icon={<Icons.UserPlus size={20} />} onClick={() => { onNewContact();   setOpen(false); }} />
                        <FabItem label="New community" icon={<Icons.Users2   size={20} />} onClick={() => { onNewCommunity(); setOpen(false); }} />
                        <FabItem label="New group"     icon={<Icons.Users    size={20} />} onClick={() => { onNewGroup();     setOpen(false); }} />
                    </div>
                )}

                {/* Main FAB */}
                <button
                    onClick={() => setOpen(v => !v)}
                    className={`w-14 h-14 rounded-full bg-accent shadow-2xl flex items-center justify-center text-white active:scale-90 transition-all ${open ? 'rotate-45' : ''}`}
                    style={{ transition: 'transform 0.2s, background 0.2s' }}
                >
                    <Icons.Pencil size={24} />
                </button>
            </div>
        </>
    );
};

export default SidebarFAB;
