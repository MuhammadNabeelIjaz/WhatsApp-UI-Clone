import React, { useState, useCallback, useEffect } from 'react';
import { useTheme } from '@app/providers/ThemeContext';
import { CHAT_FILTERS } from '@constants/routes';
import { useScrollRestore } from '@shared/hooks/useScrollRestore';
import { useChipDrag, useFakeLoading } from '@shared/hooks';
import useChatFilter from '@features/chat/hooks/useChatFilter';
import logger from '@core/utils/logger';
import ConfirmDialog from '@shared/ui/feedback/ConfirmDialog';
import ChatContextMenu from './ChatContextMenu';
import NewListScreen from './panels/NewListScreen';
import LinkedDevices from './panels/LinkedDevices';
import StarredMessages from './panels/StarredMessages';
import BroadcastsView from './panels/BroadcastsView';

import { NewGroupScreen, SelectContactScreen } from '../sub-features/group-chat';
import ArchivedView from './panels/ArchivedView';
import LockedView from './panels/LockedView';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectChats, selectStarredMessages, selectFilteredChats,
    addGroupChat, archiveChat, unarchiveChat, muteChat, unmuteChat,
    markAsRead, markAsUnread, pinChat, deleteChat, toggleChatFavorite,
} from '@core/store/slices/chatSlice';
import {
    selectLists, selectToast, showToast, setSearchQuery as setReduxSearch,
    addList, reorderLists, addChatToLists,
} from '@core/store/slices/uiSlice';
import { addCommunityThunk } from '@core/store/slices/communitySlice';
import Toast from '@shared/ui/feedback/Toast';
import CameraOverlay from './CameraOverlay';
import ProfilePictureOverlay from '@shared/ui/display/ProfilePictureOverlay';

import {
    SidebarHeader,
    SidebarSearch,
    SidebarFilterChips,
    SidebarChatList,
    SidebarFAB,
} from './sidebar';
import { ChooseListSheet } from '@shared/ui/sheets';

/**
 * MainSidebar — the chat list panel.
 *
 * Cross-feature components (AddFavoriteHub, NewCommunityModal) are injected as
 * props from AppNavigator so this file has zero feature→feature imports.
 * [H-02] Fix: removed @features/calls import
 * [V-6]  Fix: removed @features/community import
 */
const MainSidebar = ({
    isDesktop, sidebarWidth, selectedChat, onChatSelect, onOpenInfoPanel,
    onOpenStarredMessage, onNavigateToSettings, openToStarred, onStarredOpened,
    // Injected cross-feature components [H-02, V-6]
    AddFavoriteHubComponent,
    NewCommunityModalComponent,
}) => {
    const { isDarkMode, toggleTheme } = useTheme();

    const isInitialLoading = useFakeLoading(1200);
    const [selectedItems, setSelectedItems]         = useState([]);
    const dispatch = useDispatch();
    const [searchQuery, setSearchQueryLocal]             = useState('');
    const setSearchQuery = useCallback((q) => {
        setSearchQueryLocal(q);
        dispatch(setReduxSearch(q));
    }, [dispatch]);
    const [activeFilter, setActiveFilter]           = useState('all');
    const [isNewListOpen, setIsNewListOpen]         = useState(false);
    const [view, setView]                           = useState('main');
    const [isCommunityOpen, setIsCommunityOpen]     = useState(false);
    const [showCameraOverlay, setShowCameraOverlay] = useState(false);
    const [, setCapturedPhoto]                      = useState(null);
    const [avatarOverlayChat, setAvatarOverlayChat] = useState(null);
    const [contextMenu, setContextMenu]             = useState(null);
    const [addToListChat, setAddToListChat]         = useState(null);
    const [deleteModal, setDeleteModal]             = useState(null); // { chat } | { bulk: true, ids: [] }

    // R-11: When AppNavigator signals "open starred from another tab", switch to starred view
    useEffect(() => {
        if (openToStarred) {
            setView('starred');
            onStarredOpened?.();
        }
    }, [openToStarred, onStarredOpened]);

    const chatListScrollRef = useScrollRestore('sidebar-chats');

    const storeChats      = useSelector(selectChats); // full list for counters
    const filteredChats   = useSelector(selectFilteredChats); // memoized, full-dataset search
    const storeLists      = useSelector(selectLists);
    const starredMessages = useSelector(selectStarredMessages);
    const toast           = useSelector(selectToast);

    // ── Filtered chat list ────────────────────────────────────────────────────
    // filteredChats now comes directly from memoized Redux selector (selectFilteredChats)
    // Local filter still applied for chip filters (unread/favorites/groups/lists)
    const chipFiltered = useChatFilter(filteredChats, '', activeFilter, storeLists || []);

    // ── Chip drag ─────────────────────────────────────────────────────────────
    const { draggedChipId, dragOverChipId, handlers: chipDragHandlers } = useChipDrag(
        (newLists) => dispatch(reorderLists(newLists)),
        () => storeLists || CHAT_FILTERS
    );

    const isSelectionMode = selectedItems.length > 0;

    const toggleSelection = useCallback((id) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    }, []);

    const handleChatSelect = useCallback((chat) => {
        if (selectedItems.length > 0) { toggleSelection(chat.id); return; }
        logger.nav('MainSidebar', `chat open → ${chat.name}`);
        // Immediately clear unread badge — ChatDetail also calls markAsRead on mount,
        // but firing here prevents the one-render flicker on the list item.
        if (chat.unreadCount > 0 || chat.isManuallyUnread) {
            dispatch(markAsRead(chat.id));
        }
        onChatSelect(chat);
    }, [selectedItems.length, toggleSelection, onChatSelect, dispatch]);

    const handleContextMenu = useCallback((e, chat) => {
        e.preventDefault();
        const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
        const y = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
        setContextMenu({ chat, x, y });
    }, []);

    const handleContextAction = useCallback((action, chat) => {
        if (!chat) return;
        switch (action) {
            case 'multiselect': toggleSelection(chat.id); break;
            case 'addtolist':   setAddToListChat(chat); break;
            case 'archive':
                if (chat.isArchived) { dispatch(unarchiveChat(chat.id)); dispatch(showToast('Unarchived')); }
                else { dispatch(archiveChat(chat.id)); dispatch(showToast('Archived')); }
                break;
            case 'mute':
                if (chat.isMuted) { dispatch(unmuteChat(chat.id)); dispatch(showToast('Unmuted')); }
                else { dispatch(muteChat(chat.id, 'always')); dispatch(showToast('Muted')); }
                break;
            case 'pin':
                dispatch(pinChat(chat.id));
                dispatch(showToast(chat.isPinned ? 'Unpinned' : 'Pinned to top'));
                break;
            case 'unread':
                if (chat.unreadCount > 0) { dispatch(markAsRead(chat.id)); dispatch(showToast('Marked as read')); }
                else { dispatch(markAsUnread(chat.id)); dispatch(showToast('Marked as unread')); }
                break;
            case 'delete':
                setDeleteModal({ chat });
                break;
            default: break;
        }
        setContextMenu(null);
    }, [dispatch, toggleSelection]);

    const showCamera       = sidebarWidth > 380;
    const showTheme        = sidebarWidth > 340;
    const chatFilters      = storeLists || CHAT_FILTERS;
    // Dynamic sort: 'all' always first, active filter moves to index 1
    const sortedFilters = React.useMemo(() => {
        const allChip   = chatFilters.find(f => f.id === 'all');
        const rest      = chatFilters.filter(f => f.id !== 'all');
        if (!allChip) return chatFilters;
        if (activeFilter === 'all') return [allChip, ...rest];
        const activeChip = rest.find(f => f.id === activeFilter);
        const others     = rest.filter(f => f.id !== activeFilter);
        return activeChip ? [allChip, activeChip, ...others] : [allChip, ...rest];
    }, [chatFilters, activeFilter]);
    const visibleThreshold = sidebarWidth < 250 ? 1 : sidebarWidth < 320 ? 2 : sidebarWidth < 420 ? 3 : 5;
    const archivedCount    = storeChats.filter((c) => c.isArchived && (c.unreadCount > 0 || c.isManuallyUnread === true)).length;
    const lockedCount      = storeChats.filter((c) => c.isLocked).length;
    const unreadCount      = storeChats.filter((c) => (c.unreadCount > 0 || c.isManuallyUnread === true) && !c.isArchived).length;

    // ── Sub-view routing ─────────────────────────────────────────────────────
    if (view === 'new-group')
        return (
            <NewGroupScreen
                onBack={() => setView('main')}
                onCallGroup={(contacts, groupName) => {
                    const action = dispatch(addGroupChat(contacts, groupName));
                    setView('main');
                    onChatSelect(action.payload);
                }}
            />
        );
    if (view === 'select-contact')
        return (
            <SelectContactScreen
                onBack={() => setView('main')}
                mode="default"
                onSelect={(contact) => {
                    if (!contact) return;
                    if (contact.__action === 'new-contact')   { setView('new-contact'); return; }
                    if (contact.__action === 'new-community') { setView('main'); setIsCommunityOpen(true); return; }
                    const chat = { id: contact.id, name: contact.name, avatar: contact.avatar || '', initials: contact.initials, color: contact.color, lastMessage: '', unreadCount: 0, isGroup: false };
                    setView('main');
                    onChatSelect(chat);
                }}
            />
        );
    if (view === 'new-contact') return AddFavoriteHubComponent
        ? <AddFavoriteHubComponent onBack={() => setView('main')} NewCommunityModalComponent={NewCommunityModalComponent} />
        : <div className="flex-1 flex items-center justify-center text-text-secondary text-sm">Contact hub unavailable</div>;
    if (view === 'select-contact-photo')
        return (
            <SelectContactScreen
                onBack={() => { setCapturedPhoto(null); setView('main'); }}
                mode="forward"
                headerLabel="Send photo to"
                onSelect={(contacts) => {
                    // In forward mode, onSelect receives array of selected contacts
                    const arr = Array.isArray(contacts) ? contacts : (contacts ? [contacts] : []);
                    if (!arr.length) return;
                    // Navigate to first selected chat; photo has been captured
                    const first = arr[0];
                    const chat = { id: first.id, name: first.name, avatar: first.avatar || '', initials: first.initials, avatarColor: first.color, lastMessage: '[Photo]', unreadCount: 0, isGroup: false };
                    setCapturedPhoto(null);
                    setView('main');
                    onChatSelect(chat);
                }}
            />
        );
    if (view === 'archived')      return <ArchivedView      onBack={() => setView('main')} onChatSelect={onChatSelect} selectedChat={selectedChat} onOpenInfoPanel={onOpenInfoPanel} />;
    if (view === 'locked')        return <LockedView        onBack={() => setView('main')} onChatSelect={onChatSelect} selectedChat={selectedChat} onOpenInfoPanel={onOpenInfoPanel} />;
    if (view === 'linked-devices') return <LinkedDevices    onBack={() => setView('main')} />;
    if (view === 'starred')       return <StarredMessages   onBack={() => setView('main')} starredMessages={starredMessages} onOpenChat={(chatId, messageId) => { setView('main'); onOpenStarredMessage?.({ id: chatId }, messageId); }} />;
    if (view === 'broadcasts')    return <BroadcastsView    onBack={() => setView('main')} />;

    return (
        <div className="flex flex-col w-full h-full bg-bg-chat-list select-none relative transition-all duration-300">

            <SidebarHeader
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                showCamera={showCamera}
                showTheme={showTheme}
                isSelectionMode={isSelectionMode}
                selectedItems={selectedItems}
                onClearSelection={() => setSelectedItems([])}
                onMuteSelected={() => { selectedItems.forEach((id) => dispatch(muteChat(id, 'always'))); dispatch(showToast(`${selectedItems.length} muted`)); setSelectedItems([]); }}
                onPinSelected={() => { selectedItems.forEach((id) => dispatch(pinChat(id))); dispatch(showToast('Pinned')); setSelectedItems([]); }}
                onReadSelected={() => { selectedItems.forEach((id) => dispatch(markAsRead(id))); dispatch(showToast('Marked as read')); setSelectedItems([]); }}
                onArchiveSelected={() => { selectedItems.forEach((id) => dispatch(archiveChat(id))); dispatch(showToast('Archived')); setSelectedItems([]); }}
                onDeleteSelected={() => setDeleteModal({ bulk: true, ids: [...selectedItems] })}
                onOpenCamera={() => setShowCameraOverlay(true)}
                onNewGroup={() => setView('new-group')}
                onNewCommunity={() => setIsCommunityOpen(true)}
                onBroadcast={() => setView('broadcasts')}
                onLinkedDevices={() => setView('linked-devices')}
                onStarredMessages={() => setView('starred')}
                onMarkAllRead={() => { storeChats.forEach((c) => dispatch(markAsRead(c.id))); dispatch(showToast('All marked as read')); }}
                onSettings={() => onNavigateToSettings?.()}
                onSwitchAccount={() => dispatch(showToast('Switch account feature coming soon', 'info'))}
                onLogOut={() => dispatch(showToast('You have been logged out', 'info'))}
                isDesktop={isDesktop}
            />

            <SidebarSearch
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <SidebarFilterChips
                chips={sortedFilters}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                unreadCount={unreadCount}
                isDesktop={isDesktop}
                visibleCount={visibleThreshold}
                draggedChipId={draggedChipId}
                dragOverChipId={dragOverChipId}
                onDragStart={chipDragHandlers.onDragStart}
                onDragOver={chipDragHandlers.onDragOver}
                onDrop={chipDragHandlers.onDrop}
                onDragEnd={chipDragHandlers.onDragEnd}
                onNewList={() => setIsNewListOpen(true)}
            />

            <SidebarChatList
                isLoading={isInitialLoading}
                chats={chipFiltered}
                selectedChat={selectedChat}
                selectedItems={selectedItems}
                isSelectionMode={isSelectionMode}
                searchQuery={searchQuery}
                activeFilter={activeFilter}
                archivedCount={archivedCount}
                lockedCount={lockedCount}
                scrollRef={chatListScrollRef}
                onChatSelect={handleChatSelect}
                onContextMenu={handleContextMenu}
                onLongPress={(e, chat) => handleContextMenu(e || { clientX: 100, clientY: 200 }, chat)}
                onAvatarClick={(c) => setAvatarOverlayChat(c)}
                onOpenArchived={() => setView('archived')}
                onOpenLocked={() => setView('locked')}
            />

            <SidebarFAB
                isVisible={!isSelectionMode}
                onNewContact={() => setView('new-contact')}
                onNewCommunity={() => setIsCommunityOpen(true)}
                onNewGroup={() => setView('new-group')}
            />

            {contextMenu && (
                <ChatContextMenu
                    chat={contextMenu.chat}
                    position={{ x: contextMenu.x, y: contextMenu.y }}
                    onClose={() => setContextMenu(null)}
                    onAction={(action) => handleContextAction(action, contextMenu.chat)}
                />
            )}

            {addToListChat && (
                <ChooseListSheet
                    lists={(storeLists || []).filter(l => l.id !== 'all').map(l => ({
                        id: l.id,
                        label: l.label || l.name,
                        type: l.id === 'favorites' ? 'heart' : 'label',
                    }))}
                    selected={(storeLists || []).filter(l => !l.preset && Array.isArray(l.chatIds) && l.chatIds.includes(addToListChat?.id)).map(l => l.id).concat(addToListChat?.isFavorite ? ['favorites'] : [])}
                    onNewList={() => { setAddToListChat(null); setIsNewListOpen(true); }}
                    onDone={(selectedListIds) => {
                        if (!addToListChat) return;
                        const nowFav = Array.isArray(selectedListIds) && selectedListIds.includes('favorites');
                        if (nowFav !== (addToListChat.isFavorite === true)) dispatch(toggleChatFavorite(addToListChat.id));
                        dispatch(addChatToLists({ chatId: addToListChat.id, listIds: (selectedListIds || []).filter(id => id !== 'favorites') }));
                        dispatch(showToast('List updated'));
                        setAddToListChat(null);
                    }}
                    onClose={() => setAddToListChat(null)}
                />
            )}

            <NewListScreen
                isOpen={isNewListOpen}
                onClose={() => setIsNewListOpen(false)}
                chats={storeChats || []}
                lists={storeLists || []}
                onCreateList={(name, memberIds) => {
                    dispatch(addList(name, memberIds || []));
                    dispatch(showToast(`List "${name}" created!`));
                }}
            />
            {NewCommunityModalComponent && (
            <React.Suspense fallback={null}>
            <NewCommunityModalComponent
                isOpen={isCommunityOpen}
                onClose={() => setIsCommunityOpen(false)}
                onCreateCommunity={(data) => { dispatch(addCommunityThunk(data)); setIsCommunityOpen(false); dispatch(showToast('Community created!')); }}
            />
            </React.Suspense>
            )}

            {toast && <Toast message={toast.message} visible={!!toast} type={toast.type} />}

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
                        deleteModal.ids.forEach((id) => dispatch(deleteChat(id)));
                        dispatch(showToast('Deleted'));
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
                    onInfo={() => { setAvatarOverlayChat(null); onChatSelect(avatarOverlayChat); onOpenInfoPanel?.(avatarOverlayChat); }}
                    onMessage={() => { setAvatarOverlayChat(null); onChatSelect(avatarOverlayChat); }}
                />
            )}

            {showCameraOverlay && (
                <div className="absolute inset-0 z-[2000]">
                    <CameraOverlay
                        onClose={() => setShowCameraOverlay(false)}
                        onCapture={(dataUrl) => {
                            setCapturedPhoto(dataUrl);
                            setShowCameraOverlay(false);
                            setView('select-contact-photo');
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default MainSidebar;
