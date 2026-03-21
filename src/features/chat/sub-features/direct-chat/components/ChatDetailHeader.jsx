/**
 * ChatDetailHeader
 * Top bar for an open chat: back button, avatar, name/status,
 * video call, voice call, search, and overflow menu.
 *
 * All dropdown menu items are passed in so the parent owns state.
 */
import React, { useState } from 'react';
import { Icons } from '@constants/icons';
import { ImageViewer } from '@shared/ui/display';

const ChatDetailHeader = ({
    chat,
    avatarShapeClass,
    isDesktop,
    onBack,
    toggleSidebar,
    sidebarWidth,
    onOpenUserInfo,
    onVideoCall,
    onVoiceCall,
    onSearch,
    menuItems,          // [{ label, action, danger? }]
    showDropdown,
    setShowDropdown,
    dropdownRef,
}) => {
    // Track avatar load failure so fallback shows correctly even when chat.avatar is set but broken/null
    const [avatarFailed, setAvatarFailed] = useState(false);
    const [showImageViewer, setShowImageViewer] = useState(false);
    const showImage = chat.avatar && !avatarFailed;

    const isGroup     = chat?.isGroup || chat?.isCommunityGroup;
    // Channels and communities must open their dedicated info screens, not just the image viewer
    const isChannel   = chat?.isChannel;
    const isCommunity = chat?.isCommunity || chat?.isCommunityGroup || chat?.type === 'community';
    const needsInfoOnAvatarClick = isChannel || isCommunity || isGroup;

    return (
    <header
        className="px-4 py-5 flex items-center shadow-md relative z-[600] border-b"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'rgba(255,255,255,0.05)' }}
    >
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
            {!isDesktop && (
                <button
                    onClick={onBack}
                    className="p-2 -ml-2 rounded-full transition-all hover:bg-bg-hover"
                    style={{ color: 'var(--text-secondary)' }}
                >
                    <Icons.ArrowLeft size={22} />
                </button>
            )}
            {isDesktop && sidebarWidth === 0 && (
                <button
                    onClick={toggleSidebar}
                    className="p-2 -ml-2 rounded-full transition-all hover:bg-bg-hover"
                    style={{ color: 'var(--text-secondary)' }}
                >
                    <Icons.PanelLeftOpen size={22} />
                </button>
            )}

            {/* Avatar — groups/channels/communities: click opens info panel.
                        DMs: click opens full-screen ImageViewer (WhatsApp-accurate). */}
            <div
                className="relative cursor-pointer group shrink-0"
                onClick={() => needsInfoOnAvatarClick ? onOpenUserInfo?.() : setShowImageViewer(true)}
            >
                {showImage ? (
                    <img
                        src={chat.avatar}
                        className={`w-10 h-10 ${avatarShapeClass} object-cover transition-all group-hover:ring-2`}
                        style={{ '--tw-ring-color': 'var(--accent)' }}
                        alt={chat.name}
                        onError={() => setAvatarFailed(true)}
                    />
                ) : (
                    <div
                        className={`w-10 h-10 ${avatarShapeClass} flex items-center justify-center text-white font-bold text-[14px] transition-all group-hover:ring-2`}
                        style={{ backgroundColor: chat.avatarColor || '#00a884', '--tw-ring-color': 'var(--accent)' }}
                    >
                        {chat.initials || chat.name?.slice(0, 2).toUpperCase()}
                    </div>
                )}
                <div
                    className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
                    style={{ backgroundColor: 'var(--status-success)', borderColor: 'var(--bg-surface)' }}
                />
            </div>

            {/* Name + status — clicking opens UserInfo panel */}
            <div
                className="flex flex-col cursor-pointer overflow-hidden min-w-0"
                onClick={onOpenUserInfo}
            >
                <h3
                    className="font-semibold text-[15px] truncate leading-tight"
                    style={{ color: 'var(--text-primary)' }}
                >
                    {chat.name}
                </h3>
                <p
                    className="text-[12px] font-medium tracking-wide"
                    style={{ color: 'var(--status-typing)' }}
                >
                    {isGroup
                        ? `${(chat?.members?.length || chat?.memberCount) ? `${chat.members?.length || chat.memberCount} members` : 'tap here for group info'}`
                        : 'online'
                    }
                </p>
            </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2" style={{ color: 'var(--text-secondary)' }}>
            <button className="p-2 rounded-full hover:bg-bg-hover" onClick={onVideoCall}>
                <Icons.Video size={20} />
            </button>
            <button className="p-2 rounded-full hover:bg-bg-hover" onClick={onVoiceCall}>
                <Icons.Phone size={19} />
            </button>
            <div className="w-[1px] h-6 mx-1" style={{ backgroundColor: 'var(--border)' }} />
            <button className="p-2 rounded-full hover:bg-bg-hover" onClick={onSearch}>
                <Icons.Search size={20} />
            </button>

            {/* Overflow dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button
                    className="p-2 rounded-full hover:bg-bg-hover transition-all"
                    onClick={() => setShowDropdown(p => !p)}
                >
                    <Icons.MoreVertical size={20} />
                </button>
                {showDropdown && (
                    <div
                        className="absolute right-0 top-full mt-1 w-56 rounded-xl shadow-2xl z-[9999] overflow-hidden animate-fade-in"
                        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                        {menuItems.map(({ label, action, danger }) => (
                            <button
                                key={label}
                                onClick={action}
                                className="w-full text-left px-4 py-3 text-[14px] hover:bg-bg-hover transition-all"
                                style={{ color: danger ? 'var(--status-error, #ef4444)' : 'var(--text-primary)' }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Full-screen avatar viewer */}
        <ImageViewer
            open={showImageViewer}
            onClose={() => setShowImageViewer(false)}
            src={showImage ? chat.avatar : null}
            name={chat.name}
            color={chat.avatarColor}
            initials={chat.initials}
            shape={isGroup ? 'rounded' : 'circle'}
            actions={[
                {
                    icon: <Icons.Info size={26} className="text-white" />,
                    label: 'Info',
                    onClick: () => onOpenUserInfo?.(),
                },
            ]}
        />
    </header>
    );
};

export default ChatDetailHeader;
