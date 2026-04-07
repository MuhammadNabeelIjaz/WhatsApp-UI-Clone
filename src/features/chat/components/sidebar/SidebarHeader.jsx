/**
 * SidebarHeader
 * Renders the Chats top-bar: title, theme toggle, camera button,
 * three-dot overflow menu, and the multi-select action bar.
 */
import React, { useRef, useEffect } from 'react';
import { Icons } from '@constants/icons';
import MenuButton from '@shared/ui/modals/MenuButton';

const SidebarHeader = ({
    isDarkMode,
    toggleTheme,
    showCamera,
    showTheme,
    isSelectionMode,
    selectedItems,
    onClearSelection,
    onMuteSelected,
    onPinSelected,
    onReadSelected,
    onArchiveSelected,
    onDeleteSelected,
    onOpenCamera,
    // menu actions
    onNewGroup,
    onNewCommunity,
    onBroadcast,
    onLinkedDevices,
    onStarredMessages,
    onMarkAllRead,
    onSettings,
    onSwitchAccount,
    onLogOut,
    isDesktop,
}) => {
    const [showMenu, setShowMenu] = React.useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target))
                setShowMenu(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <header className="bg-bg-surface px-4 py-4 relative z-[150] min-h-[64px]">
            {/* ── Normal header ── */}
            <div className={`flex justify-between items-center mb-1 transition-opacity ${isSelectionMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <h1 className="text-[22px] font-semibold text-text-primary">Chats</h1>
                <div className="flex items-center gap-1">
                    {(showTheme || !isDesktop) && (
                        <button
                            onClick={toggleTheme}
                            title={isDarkMode ? 'Light mode' : 'Dark mode'}
                            className="p-2 hover:bg-bg-hover rounded-full text-text-secondary transition-colors"
                        >
                            {isDarkMode ? <Icons.Sun size={20} /> : <Icons.Moon size={20} />}
                        </button>
                    )}
                    {(showCamera || !isDesktop) && (
                        <button
                            title="Camera"
                            className="p-2 hover:bg-bg-hover rounded-full text-text-secondary transition-colors"
                            onClick={onOpenCamera}
                        >
                            <Icons.Camera size={20} />
                        </button>
                    )}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowMenu(v => !v)}
                            className={`p-2 hover:bg-bg-hover rounded-full text-text-secondary ${showMenu ? 'bg-bg-hover' : ''}`}
                        >
                            <Icons.MoreVertical size={20} />
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-52 bg-bg-surface border border-border-main rounded-lg shadow-xl z-[210] py-2 animate-zoom-in origin-top-right">
                                <MenuButton icon={<Icons.Users size={20} />}     label="New group"        onClick={() => { onNewGroup();       setShowMenu(false); }} />
                                <MenuButton icon={<Icons.Users2 size={20} />}    label="New community"    onClick={() => { onNewCommunity();    setShowMenu(false); }} />
                                <MenuButton icon={<Icons.Megaphone size={20} />} label="Broadcast list"   onClick={() => { onBroadcast();       setShowMenu(false); }} />
                                <MenuButton icon={<Icons.Laptop size={20} />}    label="Linked devices"   onClick={() => { onLinkedDevices();   setShowMenu(false); }} />
                                <MenuButton icon={<Icons.Star size={20} />}      label="Starred messages" onClick={() => { onStarredMessages(); setShowMenu(false); }} />
                                <MenuButton icon={<Icons.MessageSquare size={20} />} label="Mark all as read" onClick={() => { onMarkAllRead(); setShowMenu(false); }} />
                                <MenuButton icon={<Icons.Settings size={20} />}  label="Settings"         onClick={() => { onSettings();       setShowMenu(false); }} />
                                <MenuButton icon={<Icons.UserRound size={20} />} label="Switch account"   onClick={() => { onSwitchAccount?.();  setShowMenu(false); }} />
                                <button
                                    onClick={() => { onLogOut?.(); setShowMenu(false); }}
                                    className="w-full flex items-center gap-4 px-4 py-2.5 hover:bg-bg-hover text-red-500 text-left transition-colors"
                                >
                                    <Icons.LogOut size={20} />
                                    <span>Log out</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Multi-select action bar ── */}
            {isSelectionMode && (
                <div className="absolute inset-0 bg-bg-surface flex items-center px-4 z-[160] animate-fade-in">
                    <button onClick={onClearSelection} className="p-2 text-text-primary hover:bg-bg-hover rounded-full">
                        <Icons.X size={24} />
                    </button>
                    <span className="ml-4 text-[19px] font-medium text-text-primary flex-1">
                        {selectedItems.length} selected
                    </span>
                    <div className="flex items-center gap-1">
                        <button title="Mute"    className="p-2 text-text-primary hover:bg-bg-hover rounded-full" onClick={onMuteSelected}>    <Icons.BellOff      size={20} /></button>
                        <button title="Pin"     className="p-2 text-text-primary hover:bg-bg-hover rounded-full" onClick={onPinSelected}>     <Icons.Pin          size={20} /></button>
                        <button title="Read"    className="p-2 text-text-primary hover:bg-bg-hover rounded-full" onClick={onReadSelected}>    <Icons.MessageSquare size={20} /></button>
                        <button title="Archive" className="p-2 text-text-primary hover:bg-bg-hover rounded-full" onClick={onArchiveSelected}> <Icons.Archive      size={20} /></button>
                        <button title="Delete"  className="p-2 text-red-500     hover:bg-bg-hover rounded-full" onClick={onDeleteSelected}>  <Icons.Trash2       size={20} /></button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default SidebarHeader;
