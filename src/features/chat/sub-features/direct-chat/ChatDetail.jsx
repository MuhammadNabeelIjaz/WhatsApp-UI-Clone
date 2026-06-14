import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { INITIAL_MESSAGES, messagesByChat, normalizeMessage } from '@data/messages';
import { Icons } from '@constants/icons';
import { AnimatePresence } from 'framer-motion';
import logger from '@core/utils/logger';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '@core/store/slices/uiSlice';
import { selectStarredMessages, markAsRead, starMessage, unstarMessage, muteChat } from '@core/store/slices/chatSlice';
import { startCall, endCall, selectActiveCall } from '@core/store/slices/callsSlice';
import { selectChannels } from '@core/store/slices/channelSlice';
import { selectSettings } from '@core/store/slices/settingsSlice';
import { blockContactThunk } from '@core/store/slices/contactSlice';
import { ChatDetailSkeleton } from '@shared/ui/display/Skeletons';

// Shared hooks
import { useOutsideClick, usePinnedMessages, useMessageSelection, useFakeLoading } from '@shared/hooks';
import useChatSearch from '@features/chat/hooks/useChatSearch';

// Feature hooks (extracted state groups)
import { useChatOverlays }  from './hooks/useChatOverlays';
import { useChatDropdown }  from './hooks/useChatDropdown';

// Component Imports
import SelectionHeader from '@features/chat/components/SelectionHeader';
import SwipeableMessage from '@features/chat/components/SwipeableMessage';
import UserInfoPanel from '@features/chat/pages/UserInfoPanel';
import { CommunityInfoScreen } from '@features/community';
import { ChannelInfoScreen } from '@features/status';
import { BroadcastInfo } from '@features/chat/sub-features/broadcast';
import MediaGalleryScreen from '@features/chat/pages/MediaGalleryScreen';
import ChatInputBar from '@features/chat/components/ChatInputBar';
import ChatSearchBar from '@features/chat/components/ChatSearchBar';
import MuteSheet from '@features/chat/components/MuteSheet';
import AttachmentMenu from '@features/chat/components/AttachmentMenu';
import ReactionPopup from '@features/chat/components/ReactionPopup';
import PollCreation from '@features/chat/components/bubbles/PollCreation';
import EventCreation from '@features/chat/components/bubbles/EventCreation';
import ActiveCallScreen from '@features/calls/pages/ActiveCallScreen';
import { ChooseListSheet } from '@shared/ui/sheets';
import MediaLinksDocsPanel from '@features/chat/components/MediaLinksDocsPanel';
import KeptMessagesScreen from '@features/chat/components/KeptMessagesScreen';
import ChatDetailHeader from './components/ChatDetailHeader';
import ForwardPicker from './components/ForwardPicker';
import { DeleteConfirmDialog, BlockConfirmDialog, DisappearingMsgDialog } from './components/ChatDetailDialogs';

// Bubble Imports
import TextBubble     from '@features/chat/components/bubbles/TextBubble';
import ImageBubble    from '@features/chat/components/bubbles/ImageBubble';
import VoiceBubble    from '@features/chat/components/bubbles/VoiceBubble';
import PollBubble     from '@features/chat/components/bubbles/PollBubble';
import CallBubble     from '@features/chat/components/bubbles/CallBubble';
import ReplyBubble    from '@features/chat/components/bubbles/ReplyBubble';
import LocationBubble from '@features/chat/components/bubbles/LocationBubble';
import AudioBubble    from '@features/chat/components/bubbles/AudioBubble';
import ContactBubble  from '@features/chat/components/bubbles/ContactBubble';
import EventBubble    from '@features/chat/components/bubbles/EventBubble';

/**
 * ChatDetail — the main message thread view.
 *
 * State is split across purpose-built hooks:
 *   useChatOverlays  — overlay/panel visibility (attachment, mute, galleries, forward, etc.)
 *   useChatDropdown  — header dropdown + confirmation dialogs (delete, block, disappearing msgs)
 *   usePinnedMessages — pinned message stack + cycling
 *   useMessageSelection — multi-select, context menu, reactions, reply target
 *   useChatSearch    — in-thread search with scroll + highlight
 *   useFakeLoading   — skeleton guard while messages "load"
 */
const ChatDetail = ({
    chat, onBack, isDesktop, sidebarWidth, toggleSidebar, chatType,
    showRightPanel, setShowRightPanel, onOpenInfoPanel,
    pendingInfoOpen, onInfoOpenConsumed,
    scrollToMessageId, onScrollToMessageConsumed,
}) => {
    const resolvedType = chatType || (
        chat?.isCommunityAnnouncement ? 'announcement'
        : chat?.isChannel ? 'channel'
        : chat?.isGroup  ? 'group'
        : (chat?.isBroadcast || chat?.type === 'broadcast') ? 'broadcast'
        : 'dm'
    );

    // ── Feature hooks ─────────────────────────────────────────────────────────
    const overlays = useChatOverlays();
    const dropdown = useChatDropdown();

    // ── Core state ────────────────────────────────────────────────────────────
    // Per-chat message initialization: use chat-specific messages when available,
    // fall back to INITIAL_MESSAGES for the demo.
    const getInitialMessages = useCallback((chatId) => {
        const raw = messagesByChat[chatId] ? [...messagesByChat[chatId]] : [...INITIAL_MESSAGES];
        return raw.map(normalizeMessage);
    }, []);
    const [messages, setMessages] = useState(() => getInitialMessages(chat?.id));
    const isMessagesLoading = useFakeLoading(380, chat?.id);
    const scrollRef = useRef(null);

    // Reset messages when the active chat changes
    useEffect(() => {
        setMessages(getInitialMessages(chat?.id));
        // Reset scroll position on chat change
        setTimeout(() => {
            const scrollContainer = scrollRef.current;
            if (scrollContainer) scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }, 50);
    }, [chat?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Shared hooks ──────────────────────────────────────────────────────────
    useOutsideClick(dropdown.dropdownRef, dropdown.closeDropdown, dropdown.showDropdown);

    const {
        selectedMessages,
        replyingTo, setReplyingTo,
        highlightedMessageId, highlightMessage,
        activeReactionId, setActiveReactionId,
        popupPos,
        selectionModeActive,
        toggleMessageSelection,
        clearSelection,
        handleContextMenu: handleContextMenuBase,
    } = useMessageSelection();

    const {
        pinnedMessages, pinnedIndex, pinToast,
        handlePin: addPin, handleUnpin, cyclePin,
    } = usePinnedMessages();

    const {
        isSearchOpen:       showChatSearch,
        searchQuery:        chatSearchQuery,
        resultCount:        searchResultCount,
        currentMatchIndex:  searchCurrentIndex,
        openSearch:         openChatSearch,
        closeSearch:        closeChatSearch,
        handleQueryChange:  handleSearchQueryChange,
        goToNextMatch:      searchGoNext,
        goToPrevMatch:      searchGoPrev,
    } = useChatSearch(messages, scrollRef, highlightMessage);

    const handleContextMenu = useCallback((e, msgId) => {
        logger.event('ChatDetail', 'context_menu_open', { msgId });
        handleContextMenuBase(e, msgId, scrollRef);
    }, [handleContextMenuBase]);

    useEffect(() => {
        if (!scrollToMessageId || isMessagesLoading) return;
        const timer = setTimeout(() => {
            const el = scrollRef.current?.querySelector(`[data-msg-id="${scrollToMessageId}"]`);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                highlightMessage(scrollToMessageId);
            }
            onScrollToMessageConsumed?.();
        }, 120);
        return () => clearTimeout(timer);
    }, [scrollToMessageId, isMessagesLoading]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Store ─────────────────────────────────────────────────────────────────
    const dispatch = useDispatch();
    const starredMessages = useSelector(selectStarredMessages);
    const channels        = useSelector(selectChannels);
    const settings        = useSelector(selectSettings);
    const liveChannel    = channels?.find(c => c.id === chat?.id);
    const isChannelOwner = resolvedType === 'channel' && (liveChannel?.isOwner || chat?.isOwner);
    const isReadOnly     = (resolvedType === 'announcement') || (resolvedType === 'channel' && !isChannelOwner);
    const chatWallpaper  = settings?.chats?.chatWallpaper;

    const starredMessageIds = useMemo(
        () => new Set(starredMessages.filter((item) => item.chatId === chat?.id).map((item) => item.messageId)),
        [starredMessages, chat?.id]
    );

    // Mark chat as read whenever it is opened (clears unread badge + manual-unread flag)
    useEffect(() => {
        if (chat?.id) dispatch(markAsRead(chat.id));
    }, [chat?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    // Cross-screen info panel: when Calls/Archive/Communities fires onOpenInfoPanel,
    // AppNavigator sets pendingInfoOpen. On mobile (no SecondarySidebar) we open the
    // overlay inside ChatDetail once the chat is mounted/switched.
    useEffect(() => {
        if (!pendingInfoOpen) return;
        // Small delay lets the chat render settle before overlaying
        const t = setTimeout(() => {
            if (!isDesktop) overlays.openUserInfo();
            onInfoOpenConsumed?.();
        }, 80);
        return () => clearTimeout(t);
    }, [pendingInfoOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Message action handlers ───────────────────────────────────────────────

    // Extract plain text from a message (single canonical schema: props.*)
    const getMessageText = useCallback((rawMsg) => {
        return rawMsg.props?.text || rawMsg.props?.caption || '';
    }, []);

    // Build a normalised payload for starMessage (already canonical schema)
    const buildStarPayload = useCallback((rawMsg) => rawMsg, []);

    const handleStar = useCallback((ids) => {
        logger.event('ChatDetail', 'star_messages', { count: ids.length });
        ids.forEach((id) => {
            const message = messages.find((m) => m.id === id);
            if (!message) return;
            if (starredMessageIds.has(id)) dispatch(unstarMessage(chat.id, id));
            else dispatch(starMessage(chat, buildStarPayload(message)));
        });
        clearSelection();
    }, [chat, messages, dispatch, starredMessageIds, clearSelection, buildStarPayload]);

    const handleDelete = useCallback(() => {
        logger.event('ChatDetail', 'delete_messages', { count: selectedMessages.length });
        dropdown.openDeleteConfirm();
    }, [selectedMessages.length, dropdown]);

    const confirmDelete = useCallback(() => {
        logger.event('ChatDetail', 'delete_confirmed', { count: selectedMessages.length });
        setMessages((prev) => prev.filter((m) => !selectedMessages.includes(m.id)));
        dropdown.closeDeleteConfirm();
        clearSelection();
        dispatch(showToast('Message deleted'));
    }, [selectedMessages, clearSelection, dropdown, dispatch]);

    const handleCopy = useCallback((ids) => {
        logger.event('ChatDetail', 'copy_messages', { count: ids.length });
        const texts = messages
            .filter((m) => ids.includes(m.id))
            .map((m) => getMessageText(m))
            .filter(Boolean)
            .join('\n');
        if (texts) {
            navigator.clipboard.writeText(texts).then(() => overlays.showCopyFeedback());
        }
        clearSelection();
    }, [messages, clearSelection, overlays, getMessageText]);

    const handleForward = useCallback((ids) => {
        logger.event('ChatDetail', 'forward_messages', { count: ids.length });
        overlays.openForward(ids);
        clearSelection();
    }, [clearSelection, overlays]);

    const handleReactionSelect = useCallback((emoji) => {
        logger.event('ChatDetail', 'reaction_select', { emoji, msgId: activeReactionId });
        if (!activeReactionId) return;
        setMessages((prev) =>
            prev.map((m) => {
                if (m.id !== activeReactionId) return m;
                return { ...m, props: { ...m.props, reaction: emoji } };
            })
        );
        setActiveReactionId(null);
    }, [activeReactionId, setActiveReactionId]);

    const handleReplyMessage = useCallback((msgId) => {
        logger.event('ChatDetail', 'reply_to_message', { msgId });
        setReplyingTo(msgId);
        clearSelection();
    }, [setReplyingTo, clearSelection]);

    const handlePinMessage = useCallback((id) => {
        const msg = messages.find((m) => m.id === id);
        if (msg) {
            logger.event('ChatDetail', 'pin_message', { id });
            addPin(msg);
        }
        clearSelection();
    }, [messages, addPin, clearSelection]);

    const activeCall = useSelector(selectActiveCall);

    const handleVideoCallClick = useCallback(() => {
        logger.event('ChatDetail', 'video_call_click');
        dispatch(startCall({ name: chat?.name || 'Unknown', type: 'video', color: chat?.avatarColor }));
    }, [chat, dispatch]);

    const handleVoiceCallClick = useCallback(() => {
        logger.event('ChatDetail', 'voice_call_click');
        dispatch(startCall({ name: chat?.name || 'Unknown', type: 'audio', color: chat?.avatarColor }));
    }, [chat, dispatch]);

    const handleSendPoll = useCallback((poll) => {
        if (!poll?.question?.trim() || poll.options.filter((o) => o.trim()).length < 2) return;
        const options = poll.options
            .filter((o) => o.trim())
            .map((text) => ({ text, votes: '0', percentage: '0%' }));
        setMessages((prev) => [
            ...prev,
            {
                id: `poll-${Date.now()}`,
                type: 'poll',
                align: 'right',
                props: { question: poll.question.trim(), options, time: 'Now', isMine: true },
            },
        ]);
        overlays.closePollCreation();
    }, [overlays]);

    const handleSendEvent = useCallback((event) => {
        if (!event?.name?.trim()) return;
        setMessages((prev) => [
            ...prev,
            {
                id: `event-${Date.now()}`,
                type: 'event',
                align: 'right',
                props: {
                    name: event.name,
                    date: event.date,
                    month: event.month,
                    time: event.time,
                    goingCount: '1',
                    isMine: true,
                },
            },
        ]);
        overlays.closeEventCreation();
    }, [overlays]);

    const handleAttach = useCallback((item) => {
        if (!item) return;
        overlays.closeAttachment();
        const id   = `attach-${Date.now()}`;
        const base = { id, align: 'right', props: { time: 'Now', isMine: true } };
        if (item.type === 'image' || item.type === 'video') {
            setMessages((prev) => [...prev, { ...base, type: 'image', props: { ...base.props, src: item.src, caption: item.name || '', reaction: undefined } }]);
        } else if (item.type === 'location') {
            setMessages((prev) => [...prev, { ...base, type: 'location', props: { ...base.props, address: item.address || item.name || 'Shared location' } }]);
        } else if (item.type === 'document') {
            setMessages((prev) => [...prev, { ...base, type: 'document', props: { ...base.props, fileName: item.name || 'Document', fileSize: item.size ? `${Math.round(item.size / 1024)} KB` : '' } }]);
        } else if (item.type === 'audio') {
            setMessages((prev) => [...prev, { ...base, type: 'audio', props: { ...base.props, fileName: item.name || 'Audio file', fileSize: item.size ? `${item.size} KB` : 'Unknown' } }]);
        } else if (item.type === 'contact') {
            setMessages((prev) => [...prev, { ...base, type: 'contact', props: { ...base.props, name: item.name || 'Contact', phone: item.phone, initials: item.initials, avatarColor: item.avatarColor } }]);
        }
    }, [overlays]);

    const replyingToMessage = useMemo(
        () => messages.find((m) => m.id === replyingTo) || null,
        [messages, replyingTo]
    );

    const handleSendMessage = useCallback((text) => {
        if (!text?.trim()) return;
        // Safely extract reply-to fields regardless of message schema
        const replyText = replyingToMessage
            ? (replyingToMessage.props?.text
                || replyingToMessage.props?.caption
                || replyingToMessage.props?.message
                || replyingToMessage.props?.name
                || 'Replied message')
            : null;
        const replySender = replyingToMessage
            ? (replyingToMessage.props?.sender
                || replyingToMessage.props?.name
                || (replyingToMessage.props?.isMine ? 'You' : 'Contact')
                || 'Contact')
            : null;

        const newMessage = replyingToMessage
            ? {
                id: `msg-${Date.now()}`,
                type: 'reply',
                align: 'right',
                props: {
                    sender: 'You',
                    replyTo: {
                        id:   replyingToMessage.id,
                        name: replySender,
                        text: replyText,
                    },
                    message: text.trim(),
                    time: 'Now',
                    isMine: true,
                    color: replyingToMessage.props?.color || '#34b7f1',
                },
            }
            : {
                id: `msg-${Date.now()}`,
                type: 'text',
                align: 'right',
                props: {
                    text: text.trim(),
                    time: 'Now',
                    isMine: true,
                    status: 'sent',
                    isUrdu: /[\u0600-\u06FF]/.test(text),
                },
            };
        setMessages((prev) => [...prev, newMessage]);
        setReplyingTo(null);
        setTimeout(() => {
            const scrollContainer = document.querySelector('[data-chat-scroll]');
            if (scrollContainer)
                scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
        }, 10);
    }, [replyingToMessage, setReplyingTo]);

    const scrollToMessage = useCallback((id) => {
        logger.debug('ChatDetail', 'scroll_to_message', { id });
        const el = scrollRef.current?.querySelector(`[data-msg-id="${id}"]`);
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        highlightMessage(id);
    }, [highlightMessage]);

    const handleOpenUserInfo = useCallback(() => {
        if (isDesktop && setShowRightPanel) {
            logger.nav('ChatDetail', `right panel ${showRightPanel ? 'close' : 'open'}`);
            if (onOpenInfoPanel) {
                // Use the dedicated handler that clears stale rightPanelContent
                onOpenInfoPanel(chat);
            } else {
                setShowRightPanel((p) => !p);
            }
        } else {
            logger.nav('ChatDetail', 'user info overlay open');
            overlays.openUserInfo();
        }
    }, [isDesktop, showRightPanel, setShowRightPanel, onOpenInfoPanel, overlays, chat]);

    // Normalization now lives in @data/messages (normalizeMessage) and is applied
    // at load time (getInitialMessages), so `messages` state is already single-schema.

    if (!chat) return <div className="flex-1" style={{ backgroundColor: 'var(--bg-chat-canvas)' }} />;

    const isCommunityChat = chat?.isCommunity || chat?.type === 'community' || chat?.isCommunityAnnouncement;
    const avatarShapeClass = isCommunityChat ? 'rounded-xl' : 'rounded-full';

    const renderBubble = (rawMsg) => {
        const msg = rawMsg; // already single-schema (normalized at load time)
        const chatAvatar = chat.avatar;
        const sq = chatSearchQuery;
        // Upgrade 4F: respect privacy.readReceipts — downgrade 'read' to 'delivered' display when disabled
        const readReceipts = settings?.privacy?.readReceipts ?? true;
        const props = (!readReceipts && msg.props?.status === 'read')
            ? { ...msg.props, status: 'delivered' }
            : msg.props;
        switch (msg.type) {
            case 'call':     return <CallBubble     {...props} />;
            case 'reply':    return <ReplyBubble    {...props} searchQuery={sq} onQuoteClick={() => props?.replyTo?.id && scrollToMessage(props.replyTo.id)} />;
            case 'image':    return <ImageBubble    {...props} />;
            case 'poll':     return <PollBubble     {...props} />;
            case 'voice':    return <VoiceBubble    {...props} avatar={chatAvatar} />;
            case 'audio':    return <AudioBubble    {...props} />;
            case 'location': return <LocationBubble {...props} />;
            case 'contact':  return <ContactBubble  {...props} avatar={chatAvatar} />;
            case 'event':    return <EventBubble    {...props} />;
            case 'text':
            default:         return <TextBubble     {...props} searchQuery={sq} />;
        }
    };

    // Sub-screen renders (must be after all hooks)
    if (overlays.showMediaGallery)  return <MediaGalleryScreen  chat={chat} onBack={overlays.closeMediaGallery} />;
    if (overlays.showMediaLinksDoc) return <MediaLinksDocsPanel chat={chat} onClose={overlays.closeMediaLinksDoc} />;
    if (overlays.showKeptMessages)  return <KeptMessagesScreen  chat={chat} onBack={overlays.closeKeptMessages} />;

    if (isMessagesLoading) return <ChatDetailSkeleton />;

    return (
        <div
            className="flex-1 flex flex-col h-full overflow-hidden relative"
            style={{ backgroundColor: 'var(--bg-chat-canvas)' }}
            onClick={() => { if (activeReactionId) setActiveReactionId(null); }}
        >
            {/* Reaction Popup */}
            <AnimatePresence>
                {activeReactionId && (
                    <ReactionPopup
                        isOpen={true}
                        position={popupPos}
                        onReactionSelect={handleReactionSelect}
                        onClose={() => setActiveReactionId(null)}
                    />
                )}
            </AnimatePresence>

            {/* Header */}
            {selectionModeActive ? (
                <SelectionHeader
                    selectedCount={selectedMessages.length}
                    selectedMessages={selectedMessages}
                    messages={messages}
                    onClearSelection={clearSelection}
                    onStar={handleStar}
                    onDelete={handleDelete}
                    onCopy={handleCopy}
                    onForward={handleForward}
                    onPin={handlePinMessage}
                    onReply={handleReplyMessage}
                />
            ) : (
                <ChatDetailHeader
                    chat={chat}
                    avatarShapeClass={avatarShapeClass}
                    isDesktop={isDesktop}
                    onBack={onBack}
                    toggleSidebar={toggleSidebar}
                    sidebarWidth={sidebarWidth}
                    onOpenUserInfo={handleOpenUserInfo}
                    onVideoCall={handleVideoCallClick}
                    onVoiceCall={handleVoiceCallClick}
                    onSearch={() => { openChatSearch(); logger.event('ChatDetail', 'search_open'); }}
                    menuItems={[
                        { label: 'View contact',           action: () => { handleOpenUserInfo();              dropdown.closeDropdown(); } },
                        { label: 'Media, links, and docs', action: () => { overlays.openMediaLinksDoc();     dropdown.closeDropdown(); } },
                        { label: 'Search',                 action: () => { openChatSearch();                 dropdown.closeDropdown(); } },
                        { label: 'Kept messages',          action: () => { overlays.openKeptMessages();      dropdown.closeDropdown(); } },
                        { label: 'Mute notifications',     action: () => { overlays.openMuteSheet();         dropdown.closeDropdown(); } },
                        { label: 'Disappearing messages',  action: () => { dropdown.openDisappearing();                               } },
                        { label: 'Clear chat',             action: () => { setMessages([]);                  dropdown.closeDropdown(); }, danger: true },
                        { label: 'Block',                  action: () => { dropdown.openBlockConfirm();                               }, danger: true },
                        { label: 'Report',                 action: () => { dispatch(showToast(`${chat?.name || 'Contact'} reported`, 'info')); dropdown.closeDropdown(); }, danger: true },
                    ]}
                    showDropdown={dropdown.showDropdown}
                    setShowDropdown={dropdown.setShowDropdown}
                    dropdownRef={dropdown.dropdownRef}
                />
            )}

            {/* Pinned Messages Bar */}
            {pinnedMessages.length > 0 && (() => {
                const current = pinnedMessages[pinnedIndex];
                return (
                    <div
                        className="px-4 py-2 flex items-center gap-3 bg-bg-surface border-b border-border-main/20 cursor-pointer shrink-0 z-[350]"
                        onClick={() => { scrollToMessage(current.id); if (pinnedMessages.length > 1) cyclePin(); }}
                    >
                        <div className="flex flex-col gap-[3px] shrink-0">
                            {pinnedMessages.map((_, i) => (
                                <div
                                    key={i}
                                    className="w-[3px] rounded-full transition-all"
                                    style={{
                                        height: i === pinnedIndex ? '16px' : '8px',
                                        backgroundColor: i === pinnedIndex ? 'var(--accent)' : 'var(--border)',
                                    }}
                                />
                            ))}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] text-accent font-semibold">
                                {pinnedMessages.length > 1
                                    ? `Pinned Message ${pinnedIndex + 1} of ${pinnedMessages.length}`
                                    : 'Pinned Message'}
                            </p>
                            <p className="text-[13px] text-text-secondary truncate">
                                {current.props?.text || current.props?.caption || current.text || current.type}
                            </p>
                        </div>
                        <button
                            className="p-1 text-text-secondary hover:text-text-primary rounded-full hover:bg-bg-hover"
                            onClick={(e) => { e.stopPropagation(); handleUnpin(pinnedIndex); logger.event('ChatDetail', 'unpin_message'); }}
                        >
                            <Icons.X size={16} />
                        </button>
                    </div>
                );
            })()}

            {overlays.showPollCreation && (
                <PollCreation onClose={overlays.closePollCreation} onSend={handleSendPoll} />
            )}
            {overlays.showEventCreation && (
                <EventCreation onClose={overlays.closeEventCreation} onSend={handleSendEvent} />
            )}
            {overlays.showChooseList && (
                <ChooseListSheet onClose={overlays.closeChooseList} onDone={overlays.closeChooseList} />
            )}

            {/* Toast: copy feedback */}
            {overlays.copyFeedback && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[9000] bg-bg-surface border border-border-main/30 px-4 py-2 rounded-full text-[13px] text-text-primary shadow-xl animate-fade-in">
                    ✓ Copied to clipboard
                </div>
            )}
            {/* Toast: pin limit */}
            {pinToast && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[9000] bg-bg-surface border border-border-main/30 px-4 py-2 rounded-full text-[13px] text-text-primary shadow-xl animate-fade-in">
                    📌 Max 3 messages can be pinned
                </div>
            )}

            {showChatSearch && (
                <ChatSearchBar
                    query={chatSearchQuery}
                    onChange={handleSearchQueryChange}
                    onClose={closeChatSearch}
                    resultCount={searchResultCount}
                    currentIndex={searchCurrentIndex}
                    onNext={searchGoNext}
                    onPrev={searchGoPrev}
                />
            )}

            {overlays.showMuteSheet && (
                <MuteSheet
                    chatName={chat.name}
                    onMute={(duration) => {
                        dispatch(muteChat(chat.id, duration));
                        dispatch(showToast(`${chat.name} muted`));
                        overlays.closeMuteSheet();
                    }}
                    onClose={overlays.closeMuteSheet}
                />
            )}

            <DeleteConfirmDialog
                show={dropdown.showDeleteConfirm}
                count={selectedMessages.length}
                onDeleteForEveryone={() => confirmDelete(true)}
                onDeleteForMe={() => confirmDelete(false)}
                onCancel={dropdown.closeDeleteConfirm}
            />

            <BlockConfirmDialog
                show={dropdown.showBlockConfirm}
                contactName={chat?.name}
                onBlock={() => {
                    if (chat?.contactId) dispatch(blockContactThunk(chat.contactId));
                    dispatch(showToast(`${chat?.name || 'Contact'} blocked`, 'info'));
                    dropdown.closeBlockConfirm();
                }}
                onCancel={dropdown.closeBlockConfirm}
            />

            <DisappearingMsgDialog
                show={dropdown.showDisappearingMsg}
                value={dropdown.disappearingTimer}
                onChange={dropdown.setDisappearingTimer}
                onSave={() => {
                    dispatch(showToast(`Disappearing messages: ${dropdown.disappearingTimer === 'off' ? 'Off' : dropdown.disappearingTimer}`, 'success'));
                    dropdown.closeDisappearing();
                }}
                onCancel={dropdown.closeDisappearing}
            />

            {/* Forward Picker */}
            {overlays.forwardingMessages && (
                <ForwardPicker
                    count={overlays.forwardingMessages.length}
                    onClose={overlays.closeForward}
                    onForward={(contacts) => {
                        logger.event('ChatDetail', 'forward_sent', { to: contacts.map((c) => c.name), count: overlays.forwardingMessages.length });
                        overlays.closeForward();
                    }}
                />
            )}

            {/* Message Thread */}
            <div
                ref={scrollRef}
                data-chat-scroll
                className="flex-1 overflow-y-auto pt-4 pb-12 custom-scrollbar relative z-10"
                style={{
                    backgroundColor: chatWallpaper?.type === 'solid' ? chatWallpaper.color : 'var(--bg-chat-canvas)',
                    backgroundImage: chatWallpaper?.type === 'image' ? `url(${chatWallpaper.src})` : 'none',
                    backgroundSize: chatWallpaper?.type === 'image' ? 'cover' : undefined,
                    backgroundPosition: chatWallpaper?.type === 'image' ? 'center' : undefined,
                }}
            >
                <div className="absolute inset-0 pointer-events-none -z-10" style={{ backgroundColor: 'var(--bg-chat-canvas)', opacity: chatWallpaper ? 0 : 0.97 }} />

                <div className="flex flex-col gap-1.5 md:gap-2 w-full pb-6 relative">
                    <div
                        className="self-center text-[11px] font-medium px-4 py-1.5 rounded-lg my-4 uppercase tracking-widest border shadow-sm"
                        style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)', borderColor: 'var(--border)' }}
                    >
                        Today
                    </div>

                    {messages.map((rawMsg) => {
                        const msg        = normalizeMessage(rawMsg);
                        const isStarred     = starredMessageIds.has(msg.id);
                        const isHighlighted = highlightedMessageId === msg.id;
                        return (
                            <div
                                key={msg.id}
                                data-msg-id={msg.id}
                                className={isHighlighted ? 'rounded-2xl border border-accent/30 bg-accent/10 transition-all duration-300' : ''}
                            >
                                <SwipeableMessage
                                    id={msg.id}
                                    align={msg.align}
                                    isSelected={selectedMessages.includes(msg.id)}
                                    selectionModeActive={selectionModeActive}
                                    onToggleSelect={toggleMessageSelection}
                                    onSwipeToReply={() => { logger.debug('ChatDetail', 'swipe_to_reply', { msgId: msg.id }); setReplyingTo(msg.id); }}
                                    onContextMenu={handleContextMenu}
                                >
                                    <div className="relative">
                                        {renderBubble(rawMsg)}
                                        {isStarred && (
                                            <div className="absolute top-2 right-3 text-accent opacity-90 z-[10]">
                                                <Icons.Star size={16} />
                                            </div>
                                        )}
                                    </div>
                                </SwipeableMessage>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <footer
                className="z-[500] relative border-t"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'rgba(255,255,255,0.05)' }}
            >
                <AttachmentMenu
                    isOpen={overlays.isAttachmentOpen}
                    onClose={overlays.closeAttachment}
                    onAttach={handleAttach}
                    onPoll={overlays.openPollCreation}
                    onEvent={overlays.openEventCreation}
                    onLabels={overlays.openChooseList}
                />
                {isReadOnly ? (
                    <div className="px-4 py-3 flex items-center justify-center gap-2 border-t border-border-main">
                        <Icons.Lock size={14} className="text-text-secondary opacity-60" />
                        <span className="text-[13px] text-text-secondary opacity-70">
                            {resolvedType === 'announcement'
                                ? 'Only admins can send messages'
                                : 'Only channel admins can send messages'}
                        </span>
                    </div>
                ) : (
                    <ChatInputBar
                        onSendMessage={handleSendMessage}
                        onAttachToggle={overlays.toggleAttachment}
                        replyingTo={replyingToMessage}
                        onCancelReply={() => setReplyingTo(null)}
                        enterSend={settings?.chats?.enterSend ?? false}
                    />
                )}
            </footer>

            {/* Active call overlay */}
            {activeCall && (
                <ActiveCallScreen call={activeCall} onEnd={() => dispatch(endCall())} />
            )}

            {/* Mobile info overlay */}
            {overlays.showUserInfo && !isDesktop && (
                resolvedType === 'channel' || chat?.isChannel
                    ? <ChannelInfoScreen
                        channel={{
                            id: chat.id, name: chat.name, avatar: chat.avatar,
                            avatarColor: chat.avatarColor, initials: chat.initials,
                            isFollowed: true, followerCount: chat.followerCount, description: chat.description,
                        }}
                        onBack={overlays.closeUserInfo}
                        onUnfollow={overlays.closeUserInfo}
                    />
                    : (chat?.isCommunityGroup || resolvedType === 'community')
                        ? <CommunityInfoScreen
                            community={{ id: chat.id, name: chat.name, image: chat.avatar, avatarColor: chat.avatarColor }}
                            onBack={overlays.closeUserInfo}
                        />
                        : (resolvedType === 'broadcast' || chat?.isBroadcast)
                            ? <BroadcastInfo
                                chat={chat}
                                onBack={overlays.closeUserInfo}
                              />
                            : <UserInfoPanel
                                chat={chat}
                                onBack={overlays.closeUserInfo}
                                onStartChat={overlays.closeUserInfo}
                              />
            )}
        </div>
    );
};

export default ChatDetail;
