// src/app/navigation/AppNavigator.jsx — Master Controller
// Owns ALL layout state: tabs, chat selection, resize, right panel.
// Decides what renders in each slot.
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ROUTES } from '@core/constants/routes';
import { useResizable } from '@shared/hooks';
import { useTheme } from '@app/providers/ThemeContext';
import logger from '@core/utils/logger';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveChat } from '@core/store/slices/chatSlice';
import { selectChatSettings } from '@core/store/slices/settingsSlice';

// Layout shells (slots)
import PrimarySidebar    from '@app/layouts/sidebars/PrimarySidebar';
import MainSidebar       from '@features/chat/components/MainSidebar';
import SecondarySidebar  from '@app/layouts/sidebars/SecondarySidebar';

// Skeleton fallbacks for lazy-loaded routes
import {
  RouteFallbackSettings,
  RouteFallbackStatus,
  RouteFallbackCalls,
  RouteFallbackCommunities,
  RouteFallbackChatDetail,
} from '@shared/ui/display/Skeletons';

// Feature screens
import { WelcomeScreen } from '@features/chat';
import { ProfileScreen } from '@features/profile';

const ChatDetail        = React.lazy(() => import('@features/chat/sub-features/direct-chat/ChatDetail'));
const SettingsScreen    = React.lazy(() => import('@features/settings').then(m => ({ default: m.SettingsScreen })));
const StatusScreen      = React.lazy(() => import('@features/status').then(m => ({ default: m.StatusScreen })));
const CallsScreen       = React.lazy(() => import('@features/calls').then(m => ({ default: m.CallsScreen })));
const CommunitiesScreen = React.lazy(() => import('@features/community').then(m => ({ default: m.CommunitiesScreen })));
// Injected into MainSidebar as props to break chat↔calls and chat↔community coupling [H-02, V-6]
const AddFavoriteHub    = React.lazy(() => import('@features/calls/components/AddFavoriteHub'));
const NewCommunityModal = React.lazy(() => import('@features/community').then(m => ({ default: m.NewCommunityModal })));

const TABS_SEQUENCE = [ROUTES.CHATS, ROUTES.STATUS, ROUTES.COMMUNITIES, ROUTES.CALLS, ROUTES.SETTINGS];

const AppNavigator = () => {
    const { isDarkMode } = useTheme();
    const dispatch = useDispatch();
    const chatSettings = useSelector(selectChatSettings);

    // ── Apply accent color from settings to CSS variable ────────────────
    useEffect(() => {
        const color = chatSettings?.chatColor || '#00a884';
        document.documentElement.style.setProperty('--accent', color);
        // Derive soft accent (15% opacity)
        document.documentElement.style.setProperty('--accent-soft', color + '26');
    }, [chatSettings?.chatColor]);

    // ── Apply fontSize setting ───────────────────────────────────────────
    useEffect(() => {
        const sizeMap = { Small: '13px', Medium: '15px', Large: '17px', 'Extra Large': '19px' };
        document.documentElement.style.setProperty('--chat-font-size', sizeMap[chatSettings?.fontSize] || '15px');
    }, [chatSettings?.fontSize]);

    // ── State ─────────────────────────────────────────────────────────────
    const [activeTab,          setActiveTabRaw]      = useState(ROUTES.CHATS);
    const [selectedChat,       setSelectedChat]      = useState(null);
    const [isDesktop,          setIsDesktop]         = useState(window.innerWidth >= 768);
    const [showRightPanel,     setShowRightPanel]    = useState(false);
    const [rightPanelContent,  setRightPanelContent] = useState(null);
    const [scrollToMessageId,  setScrollToMessageId] = useState(null);
    const [openToStarred,      setOpenToStarred]      = useState(false);

    // ── Resize ────────────────────────────────────────────────────────────
    const sidebar    = useResizable({ initial: 400, min: 220, max: 560, edge: 'right', offset: 64 });
    const rightPanel = useResizable({ initial: 360, min: 250, max: 600, edge: 'left' });

    // ── Touch swipe ───────────────────────────────────────────────────────
    const touchStartX  = useRef(null);
    const touchEndX    = useRef(null);
    const currentIndex = TABS_SEQUENCE.indexOf(activeTab);

    // ── Effects ───────────────────────────────────────────────────────────
    useEffect(() => {
        const onResize = () => {
            const desktop = window.innerWidth >= 768;
            setIsDesktop(desktop);
            if (!desktop) setShowRightPanel(false);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    useEffect(() => {
        // Only clear a community panel override when the new chat is NOT a community type.
        // This preserves the panel when navigating between sub-groups of the same community.
        if (rightPanelContent?.type === 'community') {
            const isCommunityChat =
                selectedChat?.isCommunity ||
                selectedChat?.isCommunityGroup ||
                selectedChat?.isCommunityAnnouncement ||
                selectedChat?.type === 'community';
            if (!isCommunityChat) {
                setRightPanelContent(null);
                setShowRightPanel(false);
            }
        }
    }, [selectedChat?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    // R-17: Unify dual source of truth — mirror local selectedChat into store.activeChat
    // so any feature can read the currently open chat via useSelector(selectActiveChat)
    // without needing prop-drilling from AppNavigator.
    useEffect(() => {
        dispatch(setActiveChat(selectedChat));
    }, [selectedChat, dispatch]);

    useEffect(() => {
        logger.debug('AppNavigator', 'mount', { isDarkMode, activeTab });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Handlers ──────────────────────────────────────────────────────────
    const handleTabChange = useCallback((tab) => {
        logger.nav('AppNavigator', `tab: ${activeTab} → ${tab}`);
        setActiveTabRaw(tab);
        setSelectedChat(null);
        setShowRightPanel(false);
        setRightPanelContent(null);
    }, [activeTab]);

    const handleChatSelect = useCallback((chat) => {
        logger.nav('AppNavigator', `chat selected → ${chat?.name}`);
        setSelectedChat(chat);
        // Info Panel Fix: don't close panel on chat switch — let useEffect handle community-only reset
        // Panel stays open so SecondarySidebar auto-updates to new chat's info
    }, []);

    const openRightPanel = useCallback((type, data) => {
        setRightPanelContent({ type, data });
        setShowRightPanel(true);
    }, []);

    const closeRightPanel = useCallback(() => {
        setRightPanelContent(null);
        setShowRightPanel(false);
    }, []);

    // Info Panel Fix: dedicated handler — selects chat, opens panel, clears stale override
    const openInfoPanel = useCallback((chat) => {
        if (chat) setSelectedChat(chat);
        setRightPanelContent(null);   // let SecondarySidebar auto-detect type from chat
        setShowRightPanel(true);
    }, []);

    
    const handleOpenStarredMessage = useCallback((chat, messageId) => {
        logger.nav('AppNavigator', `starred message → chat: ${chat?.name}, msg: ${messageId}`);
        setActiveTabRaw(ROUTES.CHATS);
        setSelectedChat(chat);
        setScrollToMessageId(messageId);
    }, []);

    // R-11: Called from StatusScreen "Starred messages" menu — switches to Chats tab and opens starred view
    const handleOpenStarredFromStatus = useCallback(() => {
        logger.nav('AppNavigator', 'open starred from status tab');
        setActiveTabRaw(ROUTES.CHATS);
        setOpenToStarred(true);
    }, []);

    const handleTouchStart = (e) => {
        if (!isDesktop && !selectedChat) touchStartX.current = e.targetTouches[0].clientX;
    };
    const handleTouchMove = (e) => {
        if (!isDesktop && !selectedChat) touchEndX.current = e.targetTouches[0].clientX;
    };
    const handleTouchEnd = () => {
        if (isDesktop || !touchStartX.current || !touchEndX.current || selectedChat) return;
        const dist = touchStartX.current - touchEndX.current;
        if (dist > 50 && currentIndex < TABS_SEQUENCE.length - 1) handleTabChange(TABS_SEQUENCE[currentIndex + 1]);
        if (dist < -50 && currentIndex > 0)                       handleTabChange(TABS_SEQUENCE[currentIndex - 1]);
        touchStartX.current = null;
        touchEndX.current   = null;
    };

    // ── Slot: MainSidebar content ─────────────────────────────────────────
    const renderSidebarSlot = () => {
        logger.nav('AppNavigator', `render tab: ${activeTab}`);
        switch (activeTab) {
            case ROUTES.SETTINGS:
                return <React.Suspense fallback={<RouteFallbackSettings />}><SettingsScreen onBack={() => handleTabChange(ROUTES.CHATS)} /></React.Suspense>;
            case ROUTES.PROFILE:
                return <ProfileScreen onBack={() => handleTabChange(ROUTES.CHATS)} />;
            case ROUTES.STATUS:
                return <React.Suspense fallback={<RouteFallbackStatus />}><StatusScreen onChatOpen={handleChatSelect} onNavigateToSettings={() => handleTabChange(ROUTES.SETTINGS)} onOpenStarred={handleOpenStarredFromStatus} /></React.Suspense>;
            case ROUTES.COMMUNITIES:
                return (
                    <React.Suspense fallback={<RouteFallbackCommunities />}>
                        <CommunitiesScreen
                            onChatOpen={handleChatSelect}
                            onCommunityInfo={isDesktop ? (c) => openRightPanel('community', c) : undefined}
                            onNavigateToSettings={() => handleTabChange(ROUTES.SETTINGS)}
                        />
                    </React.Suspense>
                );
            case ROUTES.CALLS:
                return <React.Suspense fallback={<RouteFallbackCalls />}><CallsScreen onChatOpen={handleChatSelect} isDesktop={isDesktop} onNavigateToSettings={() => handleTabChange(ROUTES.SETTINGS)} /></React.Suspense>;
            case ROUTES.AI:
                return (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
                        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                            <span className="text-3xl">✦</span>
                        </div>
                        <h2 className="text-[18px] font-semibold text-text-primary">Meta AI</h2>
                        <p className="text-[14px] text-text-secondary leading-relaxed">Meta AI is not available in this version.</p>
                    </div>
                );
            default:
                return (
                    <MainSidebar
                        isDesktop={isDesktop}
                        sidebarWidth={sidebar.size}
                        selectedChat={selectedChat}
                        onChatSelect={handleChatSelect}
                        onOpenInfoPanel={openInfoPanel}
                        onOpenStarredMessage={handleOpenStarredMessage}
                        onNavigateToSettings={() => handleTabChange(ROUTES.SETTINGS)}
                        openToStarred={openToStarred}
                        onStarredOpened={() => setOpenToStarred(false)}
                        AddFavoriteHubComponent={AddFavoriteHub}
                        NewCommunityModalComponent={NewCommunityModal}
                    />
                );
        }
    };

    // ── Slot: MainContent ─────────────────────────────────────────────────
    const renderContentSlot = () => {
        if (!selectedChat) return <WelcomeScreen />;
        return (
            <React.Suspense fallback={<RouteFallbackChatDetail />}>
                <ChatDetail
                    chat={selectedChat}
                    onBack={() => { logger.nav('AppNavigator', 'chat closed'); setSelectedChat(null); }}
                    isDesktop={isDesktop}
                    sidebarWidth={sidebar.size}
                    toggleSidebar={sidebar.resetSize}
                    showRightPanel={showRightPanel}
                    setShowRightPanel={setShowRightPanel}
                    scrollToMessageId={scrollToMessageId}
                    onScrollToMessageConsumed={() => setScrollToMessageId(null)}
                />
            </React.Suspense>
        );
    };

    // ── Visibility flags ──────────────────────────────────────────────────
    const showSidebarArea  = isDesktop || (!isDesktop && !selectedChat);
    const showSecondary    = isDesktop && showRightPanel && (selectedChat || rightPanelContent);

    // ── Render ────────────────────────────────────────────────────────────
    return (
        <div className="flex h-screen w-full overflow-hidden bg-bg-surface">

            {/* Slot 1 — PrimarySidebar (icon rail, desktop only) */}
            {isDesktop && (
                <PrimarySidebar
                    isDesktop={true}
                    activeTab={activeTab}
                    setActiveTab={handleTabChange}
                />
            )}

            {/* Slot 2 — MainSidebar (tab content) */}
            {showSidebarArea && (
                <div
                    style={{ width: isDesktop ? `${sidebar.size}px` : '100%' }}
                    className={`h-full border-r border-border-main relative flex flex-col min-w-0 transition-[width] duration-300 ${sidebar.isResizing ? 'select-none' : ''}`}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className="flex-1 overflow-hidden relative w-full bg-bg-surface">
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.18, ease: 'easeOut' }}
                                className="absolute inset-0 w-full h-full"
                            >
                                {renderSidebarSlot()}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Mobile bottom nav */}
                    {!isDesktop && !selectedChat && (
                        <PrimarySidebar
                            isDesktop={false}
                            activeTab={activeTab}
                            setActiveTab={handleTabChange}
                        />
                    )}

                    {/* Left sidebar resize handle */}
                    {isDesktop && (
                        <div
                            onMouseDown={sidebar.startResizing}
                            className="absolute top-0 right-0 w-2 h-full cursor-col-resize hover:bg-accent/30 z-[100]"
                        />
                    )}
                </div>
            )}

            {/* Slot 3 — MainContent */}
            <main className="flex-1 h-full relative overflow-hidden bg-bg-surface flex">
                <div className="flex-1 h-full relative overflow-hidden">
                    {renderContentSlot()}
                </div>

                {/* Slot 4 — SecondarySidebar (right panel) */}
                {showSecondary && (
                    <SecondarySidebar
                        panelContent={rightPanelContent}
                        selectedChat={selectedChat}
                        width={rightPanel.size}
                        isResizing={rightPanel.isResizing}
                        onClose={closeRightPanel}
                        onChatSelect={handleChatSelect}
                        startResizing={rightPanel.startResizing}
                    />
                )}
            </main>
        </div>
    );
};

export default AppNavigator;
