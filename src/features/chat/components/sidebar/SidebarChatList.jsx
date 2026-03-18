/**
 * SidebarChatList — virtualized (Session 14, Upgrade 1: @tanstack/react-virtual)
 */
import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import EmptyState from '@shared/ui/display/EmptyState';
import { Icons } from '@constants/icons';
import ChatListItem from '../ChatListItem';
import { ChatItemSkeleton } from '@shared/ui/display/Skeletons';

const ROW_HEIGHT = 72;

const SidebarChatList = ({
    isLoading,
    chats,
    selectedChat,
    selectedItems,
    isSelectionMode,
    searchQuery,
    activeFilter,
    archivedCount,
    lockedCount,
    scrollRef,
    onChatSelect,
    onContextMenu,
    onLongPress,
    onAvatarClick,
    onOpenArchived,
    onOpenLocked,
}) => {
    const internalRef = useRef(null);
    const setRefs = (node) => {
        internalRef.current = node;
        if (typeof scrollRef === 'function') scrollRef(node);
        else if (scrollRef) scrollRef.current = node;
    };

    const rowVirtualizer = useVirtualizer({
        count: chats.length,
        getScrollElement: () => internalRef.current,
        estimateSize: () => ROW_HEIGHT,
        overscan: 5,
    });

    return (
        <div ref={setRefs} className="flex-1 overflow-y-auto custom-scrollbar">
            {isLoading ? (
                Array(9).fill(0).map((_, i) => <ChatItemSkeleton key={i} />)
            ) : (
                <>
                    {!searchQuery && activeFilter === 'all' && (
                        <>
                            <div
                                onClick={onOpenLocked}
                                className="flex items-center px-6 py-3 hover:bg-bg-hover cursor-pointer group transition-colors"
                            >
                                <Icons.Lock size={18} className="text-text-secondary mr-6 group-hover:text-accent transition-colors" />
                                <span className="text-[16px] font-medium text-text-primary flex-1">Locked chats</span>
                                {lockedCount > 0 && (
                                    <span className="text-accent text-xs font-bold px-1.5 py-0.5 rounded">{lockedCount}</span>
                                )}
                            </div>
                            <div
                                onClick={onOpenArchived}
                                className="flex items-center px-6 py-3 hover:bg-bg-hover cursor-pointer group transition-colors"
                            >
                                <Icons.Archive size={18} className="text-text-secondary mr-6 group-hover:text-accent transition-colors" />
                                <span className="text-[16px] font-medium text-text-primary flex-1">Archived</span>
                                {archivedCount > 0 && <span className="text-accent text-xs font-bold px-1.5 py-0.5 rounded">{archivedCount}</span>}
                            </div>
                        </>
                    )}

                    {chats.length > 0 ? (
                        <div style={{ position: 'relative', width: '100%', height: rowVirtualizer.getTotalSize() }}>
                            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                const chat = chats[virtualRow.index];
                                if (!chat) return null;
                                return (
                                    <div
                                        key={chat.id}
                                        data-index={virtualRow.index}
                                        ref={rowVirtualizer.measureElement}
                                        onContextMenu={(e) => onContextMenu(e, chat)}
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${virtualRow.start}px)` }}
                                    >
                                        <ChatListItem
                                            chat={chat}
                                            isSelected={selectedItems.includes(chat.id)}
                                            isCurrentChat={selectedChat?.id === chat.id}
                                            onSelect={() => onChatSelect(chat)}
                                            onLongPress={e => onLongPress(e || { clientX: 100, clientY: 200 }, chat)}
                                            isAnySelected={isSelectionMode}
                                            onAvatarClick={c => onAvatarClick(c)}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyState title="No chats found" />
                    )}
                </>
            )}
        </div>
    );
};

export default SidebarChatList;
