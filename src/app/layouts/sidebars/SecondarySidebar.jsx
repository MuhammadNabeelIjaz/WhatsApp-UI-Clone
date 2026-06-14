import React from 'react';
import { UserInfoPanel, BroadcastInfo } from '@features/chat';
import { CommunityInfoScreen } from '@features/community';
import { ChannelInfoScreen } from '@features/status';

/**
 * RightPanel — desktop-only detail panel (chat info, community info, channel info).
 *
 * Extracted from AppNavigator where it was inlined as a 70-line IIFE.
 * Owns its own content routing based on `panelContent` type and `selectedChat`.
 *
 * @param {object}   panelContent   - { type: 'community'|null, data: any }
 * @param {object}   selectedChat   - currently open chat
 * @param {number}   width          - panel width in px
 * @param {Function} onClose        - close/back handler
 * @param {Function} onChatSelect   - navigate to a chat from within the panel
 * @param {Function} startResizing  - mousedown handler for the left-edge drag handle
 */
const SecondarySidebar = ({
    panelContent,
    selectedChat,
    width,
    isResizing,
    onClose,
    onChatSelect,
    startResizing,
}) => {
    const renderContent = () => {
        // Priority 1: explicit panel override (e.g. community opened from CommunitiesScreen)
        if (panelContent?.type === 'community') {
            return (
                <CommunityInfoScreen
                    community={panelContent.data}
                    onBack={onClose}
                    onGroupClick={(group) => {
                        onChatSelect({
                            id: group.id,
                            name: group.name,
                            isGroup: true,
                            isCommunityGroup: true,
                            lastMessage: group.lastMsg || '',
                            time: group.time || '',
                        });
                        onClose();
                    }}
                />
            );
        }

        // Priority 2: contact info opened from Calls/Archive without switching chat thread
        if (panelContent?.type === 'contact') {
            return (
                <UserInfoPanel
                    chat={panelContent.data}
                    onBack={onClose}
                    onStartChat={() => { onChatSelect(panelContent.data); onClose(); }}
                />
            );
        }

        if (!selectedChat) return null;

        const chatType = selectedChat.isChannel
            ? 'channel'
            : (selectedChat.isCommunityGroup ||
               selectedChat.isCommunityAnnouncement ||
               selectedChat.isCommunity ||
               selectedChat.type === 'community')
            ? 'community'
            : selectedChat.isGroup
            ? 'group'
            : selectedChat.isBroadcast || selectedChat.type === 'broadcast'
            ? 'broadcast'
            : 'dm';

        if (chatType === 'channel') {
            return (
                <ChannelInfoScreen
                    channel={{
                        id: selectedChat.id,
                        name: selectedChat.name,
                        avatar: selectedChat.avatar,
                        avatarColor: selectedChat.avatarColor,
                        initials: selectedChat.initials,
                        isFollowed: true,
                        followerCount: selectedChat.followerCount,
                        description: selectedChat.description,
                    }}
                    onBack={onClose}
                    onUnfollow={onClose}
                />
            );
        }

        if (chatType === 'community') {
            return (
                <CommunityInfoScreen
                    community={{
                        id: selectedChat.id,
                        name: selectedChat.name,
                        image: selectedChat.avatar,
                        avatarColor: selectedChat.avatarColor,
                    }}
                    onBack={onClose}
                />
            );
        }

        if (chatType === 'broadcast') {
            return (
                <BroadcastInfo
                    chat={selectedChat}
                    onBack={onClose}
                />
            );
        }

        return (
            <UserInfoPanel
                chat={selectedChat}
                onBack={onClose}
                onStartChat={onClose}
            />
        );
    };

    return (
        <aside
            className={`h-full border-l border-border-main/20 bg-bg-surface flex-shrink-0 overflow-hidden relative flex flex-col${isResizing ? ' select-none' : ''}`}
            style={{
                width: `${width || 360}px`,
                animation: 'slideInRight 0.22s ease-out',
                minWidth: '250px',
                maxWidth: '600px',
            }}
        >
            {/* Drag handle — left edge (matches MainSidebar right-edge handle) */}
            <div
                onMouseDown={startResizing}
                className="absolute top-0 left-0 w-2 h-full cursor-col-resize hover:bg-accent/30 z-[100]"
            />

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                {renderContent()}
            </div>
        </aside>
    );
};

export default SecondarySidebar;
