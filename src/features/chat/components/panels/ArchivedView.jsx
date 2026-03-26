// src/components/sidebar/panels/ArchivedView.jsx
import React, { useState, useCallback } from 'react';
import { useFakeLoading } from '@shared/hooks';
import { Icons } from '@constants/icons';
import ChatListItem from '../ChatListItem';
import ChatContextMenu from '../ChatContextMenu';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectChats,
    unarchiveChat, muteChat, unmuteChat,
    pinChat, markAsRead, markAsUnread, deleteChat,
} from '@core/store/slices/chatSlice';
import { showToast } from '@core/store/slices/uiSlice';
import { ArchivedViewSkeleton } from '@shared/ui/display/Skeletons';
import ConfirmDialog from '@shared/ui/feedback/ConfirmDialog';
import ProfilePictureOverlay from '@shared/ui/display/ProfilePictureOverlay';

const ArchivedView = ({ onBack, onChatSelect, selectedChat }) => {
    const dispatch = useDispatch();
    const chats = useSelector(selectChats);

    const archivedChats = chats.filter(c => c.isArchived);

    // ── Loading skeleton ──────────────────────────────────────────────────
    const isLoading = useFakeLoading(320);

    // ── Context menu state ────────────────────────────────────────────────
    const [contextMenu, setContextMenu] = useState(null); // {chat, x, y}
    const [selectedItems, setSelectedItems] = useState([]);
    const [deleteModal, setDeleteModal] = useState(null); // { chat } | { bulk: true, ids: [] }
    const [avatarOverlayChat, setAvatarOverlayChat] = useState(null);
    const isSelectionMode = selectedItems.length > 0;

    const toggleSelection = useCallback((id) =>
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        ), []);

    const handleContextMenu = useCallback((e, chat) => {
        e.preventDefault();
        const x = e.clientX ?? e.touches?.[0]?.clientX ?? 100;
        const y = e.clientY ?? e.touches?.[0]?.clientY ?? 200;
        setContextMenu({ chat, x, y });
    }, []);

    const handleAction = useCallback((action, chat) => {
        if (!chat) return;
        switch (action) {
            case 'archive':   // in archived view this means UNARCHIVE
                dispatch(unarchiveChat(chat.id));
                dispatch(showToast('Unarchived'));
                break;
            case 'mute':
                if (chat.isMuted) { dispatch(unmuteChat(chat.id)); dispatch(showToast('Unmuted')); }
                else              { dispatch(muteChat(chat.id, 'always')); dispatch(showToast('Muted')); }
                break;
            case 'pin':
                dispatch(pinChat(chat.id));
                dispatch(showToast(chat.isPinned ? 'Unpinned' : 'Pinned'));
                break;
            case 'unread':
                if (chat.unreadCount > 0) { dispatch(markAsRead(chat.id));   dispatch(showToast('Marked as read')); }
                else                      { dispatch(markAsUnread(chat.id)); dispatch(showToast('Marked as unread')); }
                break;
            case 'delete':
                setDeleteModal({ chat });
                break;
            default: break;
        }
        setContextMenu(null);
    }, [dispatch]);

    // ── Bulk selection actions ────────────────────────────────────────────
    const handleBulkUnarchive = () => {
        selectedItems.forEach(id => dispatch(unarchiveChat(id)));
        dispatch(showToast(`${selectedItems.length} chat${selectedItems.length > 1 ? 's' : ''} unarchived`));
        setSelectedItems([]);
    };
    const handleBulkDelete = () => {
        setDeleteModal({ bulk: true, ids: [...selectedItems] });
    };

    if (isLoading) return <ArchivedViewSkeleton />;

    return (
        <div className="flex flex-col h-full bg-bg-surface animate-fade-in relative">

            {/* ── Header ── */}
            <header className="bg-bg-surface px-4 py-[18px] flex items-center gap-4 min-h-[64px] relative z-10">
                {isSelectionMode ? (
                    // Selection mode header
                    <>
                        <button
                            onClick={() => setSelectedItems([])}
                            className="p-1.5 hover:bg-bg-hover rounded-full text-text-secondary transition-colors"
                        >
                            <Icons.X size={22} />
                        </button>
                        <span className="text-[18px] font-semibold text-text-primary flex-1">
                            {selectedItems.length} selected
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                title="Unarchive selected"
                                onClick={handleBulkUnarchive}
                                className="p-2 hover:bg-bg-hover rounded-full text-text-primary transition-colors"
                            >
                                <Icons.ArchiveRestore size={20} />
                            </button>
                            <button
                                title="Delete selected"
                                onClick={handleBulkDelete}
                                className="p-2 hover:bg-bg-hover rounded-full text-red-500 transition-colors"
                            >
                                <Icons.Trash2 size={20} />
                            </button>
                        </div>
                    </>
                ) : (
                    // Normal header
                    <>
                        <button
                            onClick={onBack}
                            className="p-1.5 hover:bg-bg-hover rounded-full text-text-secondary transition-colors"
                        >
                            <Icons.ArrowLeft size={24} />
                        </button>
                        <h1 className="text-[19px] font-semibold text-text-primary flex-1">Archived</h1>
                    </>
                )}
            </header>

            {/* ── Info banner ── */}
            {!isSelectionMode && (
                <div className="px-6 py-3 border-b border-border-main/10">
                    <p className="text-[12.5px] text-text-secondary leading-relaxed text-center">
                        Archived chats stay archived when new messages arrive.
                        <span className="text-accent cursor-pointer hover:underline ml-1">Change</span>
                    </p>
                </div>
            )}

            {/* ── Chat list ── */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {archivedChats.length > 0 ? (
                    archivedChats.map((chat) => (
                        <div
                            key={chat.id}
                            onContextMenu={(e) => handleContextMenu(e, chat)}
                        >
                            <ChatListItem
                                chat={chat}
                                isSelected={selectedItems.includes(chat.id)}
                                isCurrentChat={selectedChat?.id === chat.id}
                                onSelect={() => {
                                    if (isSelectionMode) { toggleSelection(chat.id); return; }
                                    onChatSelect(chat);
                                }}
                                onLongPress={(e) => handleContextMenu(
                                    e || { clientX: 100, clientY: 200 }, chat
                                )}
                                isAnySelected={isSelectionMode}
                                onAvatarClick={(c) => setAvatarOverlayChat(c)}
                            />
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <div className="w-16 h-16 bg-bg-hover rounded-full flex items-center justify-center mb-4">
                            <Icons.Archive size={28} className="text-text-secondary opacity-40" />
                        </div>
                        <p className="text-text-secondary text-sm">No archived chats</p>
                    </div>
                )}
            </div>

            {/* ── Footer ── */}
            <div className="py-4 flex items-center justify-center gap-1.5 opacity-50">
                <Icons.Lock size={10} className="text-text-secondary" />
                <span className="text-[11px] text-text-secondary">
                    Your messages are <span className="text-accent">end-to-end encrypted</span>
                </span>
            </div>

            {/* ── Context menu ── */}
            {contextMenu && (
                <ChatContextMenu
                    chat={contextMenu.chat}
                    position={{ x: contextMenu.x, y: contextMenu.y }}
                    onClose={() => setContextMenu(null)}
                    onAction={(action) => handleAction(action, contextMenu.chat)}
                />
            )}

            <ConfirmDialog
                isOpen={!!deleteModal}
                title={deleteModal?.bulk ? `Delete ${deleteModal?.ids?.length} chat(s)?` : `Delete chat with ${deleteModal?.chat?.name}?`}
                message="This action cannot be undone. The chat and its message history will be removed."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                confirmColor="red"
                onCancel={() => setDeleteModal(null)}
                onConfirm={() => {
                    if (deleteModal?.bulk) {
                        deleteModal.ids.forEach(id => dispatch(deleteChat(id)));
                        dispatch(showToast('Chats deleted'));
                        setSelectedItems([]);
                    } else {
                        dispatch(deleteChat(deleteModal.chat.id));
                        dispatch(showToast('Chat deleted'));
                    }
                    setDeleteModal(null);
                }}
            />
            {avatarOverlayChat && (
                <ProfilePictureOverlay
                    chat={avatarOverlayChat}
                    onClose={() => setAvatarOverlayChat(null)}
                    onMessage={() => { setAvatarOverlayChat(null); onChatSelect(avatarOverlayChat); }}
                />
            )}
        </div>
    );
};

export default ArchivedView;
