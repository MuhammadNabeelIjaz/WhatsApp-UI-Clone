// src/components/chat/ChatListItem.jsx
// Shows pin icon, mute bell, unread badge, read receipts — fully wired to store state

import React from 'react';
import { Icons } from '@constants/icons';
import useLongPress from '@shared/hooks/useLongPress';

const ChatListItem = ({
    chat,
    isSelected,
    isCurrentChat,
    onSelect,
    onLongPress,
    isAnySelected,
    onAvatarClick,
}) => {
    const longPressProps = useLongPress(onLongPress);

    const msgObj = typeof chat.lastMessage === 'object' ? chat.lastMessage : null;
    const lastMsgText = msgObj ? (msgObj.text ?? '') : (chat.lastMessage ?? '');
    const msgType = msgObj?.type; // 'image', 'document' etc.
    const senderPrefix = msgObj?.from && msgObj.from !== 'me' && chat.isGroup ? `${msgObj.from}: ` : '';

    const timeText = chat.time ?? msgObj?.time ?? '';

    const initials = (chat.initials ||
        (chat.name || '?').split(' ').map(w => w[0]).join('')).slice(0, 2).toUpperCase();
    const isCommunityChat = chat.isCommunity || chat.type === 'community' || chat.isCommunityAnnouncement;
    const avatarShapeClass = isCommunityChat ? 'rounded-xl' : 'rounded-full';

    return (
        <div
            {...longPressProps}
            onClick={onSelect}
            className={`flex items-center px-4 py-3 cursor-pointer transition-all duration-150 relative mx-2 rounded-xl my-0.5
                ${isSelected
                    ? 'bg-accent/10 shadow-sm'
                    : isCurrentChat ? 'bg-bg-hover/80'
                        : 'hover:bg-bg-hover active:bg-bg-hover/70'}
            `}
        >
            {/* ── Avatar ── */}
            <div
                className="relative flex-shrink-0"
                onClick={(e) => {
                    if (!isAnySelected && onAvatarClick) {
                        e.stopPropagation();
                        onAvatarClick(chat);
                    }
                }}
            >
                {chat.avatar ? (
                    <img
                        src={chat.avatar}
                        alt={chat.name}
                        className={`w-[52px] h-[52px] ${avatarShapeClass} object-cover transition-transform ${isSelected ? 'scale-90' : ''}`}
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                ) : null}

                {/* Initials fallback */}
                <div
                    className={`w-[52px] h-[52px] ${avatarShapeClass} flex items-center justify-center text-white font-bold text-lg
                        ${isSelected ? 'scale-90' : ''}
                        ${chat.avatar ? 'hidden' : 'flex'}`}
                    style={{ backgroundColor: chat.avatarColor || '#6b7280' }}
                >
                    {initials}
                </div>

                {/* Selection checkmark */}
                {isSelected && (
                    <div className="absolute inset-0 bg-accent/40 rounded-full flex items-center justify-center">
                        <Icons.Check size={26} className="text-white" strokeWidth={3} />
                    </div>
                )}

                {/* Pin badge (bottom-right of avatar) */}
                {chat.isPinned && !isSelected && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] bg-bg-surface rounded-full flex items-center justify-center border border-bg-surface">
                        <Icons.Pin size={10} className="text-text-secondary" />
                    </div>
                )}

                {/* Group badge */}
                {chat.isGroup && !chat.isPinned && !isSelected && !chat.isCommunity && !chat.isCommunityAnnouncement && (
                    <div className="absolute -bottom-0.5 -right-0.5 bg-bg-surface p-[3px] rounded-md border border-bg-surface">
                        <Icons.Users size={10} className="text-accent" strokeWidth={2.5} />
                    </div>
                )}
                {/* Community badge */}
                {chat.isCommunity && !isSelected && (
                    <div className="absolute -bottom-0.5 -right-0.5 bg-bg-surface p-[3px] rounded-md border border-bg-surface">
                        <Icons.Users2 size={10} className="text-accent" strokeWidth={2.5} />
                    </div>
                )}
                {/* Announcement badge */}
                {chat.isCommunityAnnouncement && !isSelected && (
                    <div className="absolute -bottom-0.5 -right-0.5 bg-accent rounded-full w-[16px] h-[16px] flex items-center justify-center border-2 border-bg-surface">
                        <Icons.Bell size={8} className="text-white" />
                    </div>
                )}
            </div>

            {/* ── Text content ── */}
            <div className="flex-1 ml-[14px] overflow-hidden">
                {/* Row 1: name + time */}
                <div className="flex justify-between items-baseline gap-2">
                    <span className={`text-[16px] font-semibold truncate flex-1
                        ${isSelected ? 'text-accent' : 'text-text-primary'}`}>
                        {chat.name}
                    </span>
                    <span className={`text-[12px] whitespace-nowrap shrink-0
                        ${(chat.unreadCount > 0 || chat.isManuallyUnread) && !chat.isMuted ? 'text-accent' : 'text-text-secondary'}`}>
                        {timeText}
                    </span>
                </div>

                {/* Row 2: last message + badges */}
                <div className="flex justify-between items-center mt-[2px] gap-2">
                    <div className="flex items-center gap-1 text-[13.5px] text-text-secondary truncate flex-1 min-w-0">
                        {chat.isTyping ? (
                            <span className="text-accent font-medium tracking-wide">typing...</span>
                        ) : (
                            <>
                                {/* Read receipt for sent messages */}
                                {chat.status === 'read' && !chat.isGroup && (
                                    <Icons.CheckCheck size={15} className="text-[#53bdeb] shrink-0" />
                                )}
                                {chat.status === 'delivered' && !chat.isGroup && (
                                    <Icons.CheckCheck size={15} className="text-text-secondary/60 shrink-0" />
                                )}
                                {chat.status === 'sent' && !chat.isGroup && (
                                    <Icons.Check size={15} className="text-text-secondary/60 shrink-0" />
                                )}
                                <span className="truncate flex items-center gap-1">
                                    {senderPrefix && <span>{senderPrefix}</span>}
                                    {msgType === 'image' && <Icons.Image size={14} className="text-text-secondary shrink-0" />}
                                    {msgType === 'document' && <Icons.FileText size={14} className="text-text-secondary shrink-0" />}
                                    {lastMsgText}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Right badges */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        {/* Mute bell icon */}
                        {chat.isMuted && !isSelected && (
                            <Icons.BellOff size={13} className="text-text-secondary/50" />
                        )}
                        {/* Mention badge */}
                        {chat.isMentioned && !isSelected && (
                            <div className="w-[20px] h-[20px] rounded-full bg-bg-surface flex items-center justify-center text-accent text-[14px] font-bold">
                                @
                            </div>
                        )}
                        {/* Unread count */}
                        {(chat.unreadCount > 0 || chat.isManuallyUnread) && !isSelected && (() => {
                            const isManualOnly  = chat.isManuallyUnread && !(chat.unreadCount > 0);
                            const badgeColor    = chat.isMuted ? 'bg-text-secondary/40' : 'bg-accent';
                            if (isManualOnly) {
                                return <span className={`w-[10px] h-[10px] rounded-full ${badgeColor} block`} />;
                            }
                            return (
                                <span className={`text-white text-[11px] font-bold min-w-[20px] h-[20px] flex items-center justify-center rounded-full px-1 ${badgeColor}`}>
                                    {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                                </span>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ChatListItem);
