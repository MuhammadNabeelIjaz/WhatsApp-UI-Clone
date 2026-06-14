// src/features/status/pages/StatusScreen.jsx
// Orchestrator — ~160 lines. Sub-components handle all rendering.
// Phase 3 decomposition: MyStatusSection | StatusList | StatusCreator | ChannelSection

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useFakeLoading } from '@shared/hooks';
import { Icons } from '@constants/icons';
import MenuButton from '@shared/ui/modals/MenuButton';
import { useScrollRestore } from '@shared/hooks/useScrollRestore';
import useAvatarZoom from '@shared/hooks/useAvatarZoom';
import logger from '@core/utils/logger';
import StatusPlayer from '../components/StatusPlayer';
import ProfilePictureOverlay from '@shared/ui/display/ProfilePictureOverlay';
import MyStatusSection from '../components/MyStatusSection';
import StatusList from '../components/StatusList';
import StatusCreator from '../components/StatusCreator';
import ChannelSection from '../components/ChannelSection';
const StatusPrivacy = React.lazy(() => import('@features/settings').then(m => ({ default: m.StatusPrivacy })));
const AdPreferences = React.lazy(() => import('@features/settings').then(m => ({ default: m.AdPreferences })));
import CreateChannelScreen from './CreateChannelScreen';
import ExploreChannelsScreen from './ExploreChannelsScreen';
import ChannelInfoScreen from './ChannelInfoScreen';
import { useSelector, useDispatch } from 'react-redux';
import { selectChannels } from '@core/store/slices/channelSlice';
import { followChannel, hideChannel, addChannel } from '@core/store/slices/channelSlice';
import { showToast } from '@core/store/slices/uiSlice';
import {
    selectContactStatuses,
    selectMyStatuses,
    selectMyStatusSeenCount,
    postTextStatus,
    postMediaStatus,
    deleteAllMyStatuses,
    updateSeenCount,
} from '@core/store/slices/statusSlice';
import { StatusScreenSkeleton } from '@shared/ui/display/Skeletons';

const STATUS_BG_DEFAULT = '#075e54';

const StatusScreen = ({ onChatOpen, onNavigateToSettings, onOpenStarred }) => {

    // ─── All hooks first (Rules of Hooks) ────────────────────────────────────
    const [view,             setView]             = useState('main');
    const [showMenu,         setShowMenu]         = useState(false);
    const { zoomChat, openZoom, closeZoom }       = useAvatarZoom();
    const [showSearch,       setShowSearch]       = useState(false);
    const [searchQuery,      setSearchQuery]      = useState('');
    const menuRef  = useRef(null);
    const searchRef = useRef(null);
    const fileInputRef = useRef(null);
    const scrollRef = useScrollRestore('status-main');
    const [activeUserIndex, setActiveUserIndex]   = useState(null);

    // My status state
    const [showStatusPicker,  setShowStatusPicker]  = useState(false);
    const [statusCreatorType, setStatusCreatorType] = useState(null);
    const [textStatusContent, setTextStatusContent] = useState('');
    const [textStatusBg,      setTextStatusBg]      = useState(STATUS_BG_DEFAULT);
    const [showMyStatusView,  setShowMyStatusView]  = useState(false);
    const [showStatusDotMenu, setShowStatusDotMenu] = useState(false);

    // Store
    const dispatch = useDispatch();
    const channels = useSelector(selectChannels);
    const [selectedChannel, setSelectedChannel]   = useState(null);
    const isLoading = useFakeLoading(600);

    // Status updates — owned by `statusSlice` so "My Status" persists across
    // remounts/navigation instead of being lost as local component state.
    const myStatuses        = useSelector(selectMyStatuses);
    const myStatusSeenCount = useSelector(selectMyStatusSeenCount);
    const statuses          = useSelector(selectContactStatuses);

    // Derived
    const myStatusEntry = useMemo(() => {
        if (!myStatuses.length) return null;
        return { id: 'me', name: 'My Status', image: 'https://i.pravatar.cc/150?u=me',
            totalSlides: myStatuses.length, seenCount: myStatusSeenCount,
            slides: myStatuses.map(s => s.type === 'text' ? { type: 'text', content: s.content } : { type: s.mediaType || 'image', url: s.url }) };
    }, [myStatuses, myStatusSeenCount]);

    const statusUsers = useMemo(() => {
        const unseen = statuses.filter(s => s.seenCount < s.totalSlides);
        const seen   = statuses.filter(s => s.seenCount >= s.totalSlides);
        const ordered = [...unseen, ...seen];
        return myStatusEntry ? [myStatusEntry, ...ordered] : ordered;
    }, [statuses, myStatusEntry]);

    const displayStatuses = useMemo(() => statusUsers.filter(u => u.id !== 'me'), [statusUsers]);

    const filteredStatuses = (showSearch && searchQuery)
        ? displayStatuses.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : displayStatuses;

    const visibleChannels    = channels.filter(c => !c.isHidden);
    const followedChannels   = (showSearch && searchQuery)
        ? visibleChannels.filter(c => c.isFollowed && c.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : visibleChannels.filter(c => c.isFollowed);
    const discoverChannels   = (showSearch && searchQuery)
        ? visibleChannels.filter(c => !c.isFollowed && c.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : visibleChannels.filter(c => !c.isFollowed);

    // ─── Callbacks ───────────────────────────────────────────────────────────
    const goBack = useCallback(() => setView('main'), []);

    const openStatus = useCallback((id) => {
        if (id === 'me' && myStatusEntry) { setActiveUserIndex(0); return; }
        const index = statusUsers.findIndex(u => u.id === id);
        if (index !== -1) setActiveUserIndex(index);
    }, [statusUsers, myStatusEntry]);

    const handleMyStatusClick = useCallback(() => {
        logger.event('StatusScreen', 'my_status_click');
        if (myStatuses.length) setShowMyStatusView(true);
        else setShowStatusPicker(true);
    }, [myStatuses.length]);

    const handlePostTextStatus = useCallback(() => {
        if (!textStatusContent.trim()) { logger.skip('StatusScreen', 'empty text status'); return; }
        logger.event('StatusScreen', 'post_text_status', { bg: textStatusBg });
        dispatch(postTextStatus(textStatusContent, textStatusBg));
        setStatusCreatorType(null); setTextStatusContent(''); setShowStatusPicker(false);
    }, [textStatusContent, textStatusBg, dispatch]);

    const handleFileSelect = useCallback((e) => {
        const file = e.target.files?.[0];
        if (!file) { logger.skip('StatusScreen', 'no file selected'); return; }
        const mediaType = file.type.startsWith('video') ? 'video' : 'image';
        const reader = new FileReader();
        reader.onload = (ev) => {
            dispatch(postMediaStatus(mediaType, ev.target.result));
            setStatusCreatorType(null); setShowStatusPicker(false);
        };
        reader.readAsDataURL(file);
    }, [dispatch]);

    const handleUpdateSeen = useCallback((userId, seenCount) => {
        dispatch(updateSeenCount({ userId, seenCount }));
    }, [dispatch]);

    // ─── Effects ─────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!showMenu) return;
        const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [showMenu]);

    useEffect(() => {
        if (showSearch) setTimeout(() => searchRef.current?.focus(), 50);
    }, [showSearch]);

    // ─── Early returns (sub-screens) ─────────────────────────────────────────
    if (isLoading) return <StatusScreenSkeleton />;

    if (statusCreatorType === 'text')
        return <StatusCreator textContent={textStatusContent} setTextContent={setTextStatusContent}
                    bgColor={textStatusBg} setBgColor={setTextStatusBg}
                    onPost={handlePostTextStatus} onBack={() => setStatusCreatorType(null)} />;

    if (view === 'privacy')
        return <React.Suspense fallback={<div className="absolute inset-0 bg-bg-surface" />}><StatusPrivacy onBack={goBack} /></React.Suspense>;

    if (view === 'ad-preferences')
        return <React.Suspense fallback={<div className="absolute inset-0 bg-bg-surface" />}><AdPreferences onBack={goBack} /></React.Suspense>;

    if (view === 'create-channel')
        return <CreateChannelScreen onBack={goBack} onCreate={(ch) => { dispatch(addChannel(ch)); goBack(); }} />;

    if (view === 'explore')
        return <ExploreChannelsScreen onBack={goBack} onChatOpen={onChatOpen} />;

    if (selectedChannel)
        return <ChannelInfoScreen channel={selectedChannel} onBack={() => setSelectedChannel(null)} onUnfollow={() => setSelectedChannel(null)} />;

    // ─── Main view ────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col h-full bg-bg-surface transition-colors duration-300 relative">
            <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileSelect} />

            {/* Status type picker modal */}
            {showStatusPicker && (
                <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center px-6" onClick={() => setShowStatusPicker(false)}>
                    <div className="w-full max-w-xs bg-bg-surface rounded-2xl shadow-2xl overflow-hidden animate-zoom-in" onClick={e => e.stopPropagation()}>
                        <div className="px-6 pt-6 pb-4">
                            <p className="text-[17px] font-semibold text-text-primary text-center mb-1">Add to status</p>
                            <p className="text-[13px] text-text-secondary text-center">Choose what you'd like to share</p>
                        </div>
                        <div className="h-px bg-border-main/20" />
                        <div className="flex flex-col">
                            <button onClick={() => { setShowStatusPicker(false); setStatusCreatorType('text'); }}
                                className="flex items-center gap-4 px-5 py-4 hover:bg-bg-hover transition-all border-b border-border-main/10">
                                <div className="w-11 h-11 rounded-full bg-accent/20 flex items-center justify-center shrink-0"><Icons.Type size={22} className="text-accent" /></div>
                                <div className="text-left"><p className="text-[15px] font-medium text-text-primary">Text</p><p className="text-[12px] text-text-secondary">Share a thought or quote</p></div>
                            </button>
                            <button onClick={() => { setShowStatusPicker(false); fileInputRef.current?.click(); }}
                                className="flex items-center gap-4 px-5 py-4 hover:bg-bg-hover transition-all">
                                <div className="w-11 h-11 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0"><Icons.Image size={22} className="text-blue-400" /></div>
                                <div className="text-left"><p className="text-[15px] font-medium text-text-primary">Photo or video</p><p className="text-[12px] text-text-secondary">Share from your gallery</p></div>
                            </button>
                        </div>
                        <div className="h-px bg-border-main/20" />
                        <button onClick={() => setShowStatusPicker(false)} className="w-full py-4 text-[15px] text-text-secondary hover:bg-bg-hover transition-colors">Cancel</button>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="px-5 py-5 flex justify-between items-center shrink-0">
                {showSearch ? (
                    <div className="flex items-center gap-2 flex-1">
                        <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="p-2 hover:bg-bg-hover rounded-full text-text-secondary"><Icons.ArrowLeft size={22} /></button>
                        <div className="flex-1 flex items-center gap-2 bg-bg-input rounded-full px-4 py-2">
                            <Icons.Search size={16} className="text-text-secondary" />
                            <input ref={searchRef} type="text" placeholder="Search status or channel..." value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent text-[14px] text-text-primary outline-none placeholder:text-text-secondary" />
                            {searchQuery && <button onClick={() => setSearchQuery('')}><Icons.X size={16} className="text-text-secondary" /></button>}
                        </div>
                    </div>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold text-text-primary">Updates</h1>
                        <div className="relative flex items-center gap-3" ref={menuRef}>
                            <button onClick={() => setShowSearch(true)} className="p-2 hover:bg-bg-hover rounded-full text-text-secondary transition-colors"><Icons.Search size={22} /></button>
                            <button onClick={() => setShowMenu(prev => !prev)} className={`p-2 rounded-full text-text-secondary transition-colors ${showMenu ? 'bg-bg-hover text-text-primary' : 'hover:bg-bg-hover'}`}><Icons.MoreVertical size={20} /></button>
                            {showMenu && (
                                <div className="absolute right-0 top-full mt-1 w-56 bg-bg-surface border border-border-main/30 rounded-xl shadow-2xl z-300 py-1.5 animate-zoom-in origin-top-right overflow-hidden">
                                    <MenuButton icon={<Icons.Plus size={19} />} label="Create channel" onClick={() => { setView('create-channel'); setShowMenu(false); }} />
                                    <MenuButton icon={<Icons.EyeOff size={19} />} label="Status privacy" onClick={() => { setView('privacy'); setShowMenu(false); }} />
                                    <MenuButton icon={<Icons.Star size={19} />} label="Starred messages" onClick={() => { onOpenStarred?.(); setShowMenu(false); }} />
                                    <MenuButton icon={<Icons.Megaphone size={19} />} label="Ad preferences" onClick={() => { setView('ad-preferences'); setShowMenu(false); }} />
                                    <div className="h-px bg-border-main/20 my-1" />
                                    <MenuButton icon={<Icons.Settings size={19} />} label="Settings" onClick={() => { onNavigateToSettings?.(); setShowMenu(false); }} />
                                    <MenuButton icon={<Icons.UserRound size={19} />} label="Switch account" onClick={() => { setShowMenu(false); dispatch(showToast('Switch account feature coming soon', 'info')); }} />
                                </div>
                            )}
                        </div>
                    </>
                )}
            </header>

            {/* Scrollable body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 pb-20">
                {showMyStatusView ? (
                    <MyStatusSection
                        myStatuses={myStatuses} myStatusSeenCount={myStatusSeenCount} myStatusEntry={myStatusEntry}
                        showMyStatusView={true} setShowMyStatusView={setShowMyStatusView}
                        showDotMenu={showStatusDotMenu} setShowDotMenu={setShowStatusDotMenu}
                        onOpenStatus={openStatus} onDeleteAll={() => { dispatch(deleteAllMyStatuses()); setShowMyStatusView(false); }}
                        onMyStatusClick={handleMyStatusClick} showToast={(msg, type) => dispatch(showToast(msg, type))}
                    />
                ) : (
                    <>
                        {/* Status section */}
                        <section className="shrink-0 px-6 overflow-visible">
                            <h2 className="text-[17px] font-semibold text-text-primary mb-3">Status</h2>
                            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pt-2 pb-2" style={{ overflowY: 'visible' }}>
                                <MyStatusSection
                                    myStatuses={myStatuses} myStatusSeenCount={myStatusSeenCount} myStatusEntry={myStatusEntry}
                                    showMyStatusView={false} setShowMyStatusView={setShowMyStatusView}
                                    showDotMenu={showStatusDotMenu} setShowDotMenu={setShowStatusDotMenu}
                                    onOpenStatus={openStatus} onDeleteAll={() => dispatch(deleteAllMyStatuses())}
                                    onMyStatusClick={handleMyStatusClick} showToast={(msg, type) => dispatch(showToast(msg, type))}
                                />
                                <StatusList statuses={filteredStatuses} onOpenStatus={openStatus} />
                            </div>
                        </section>

                        <ChannelSection
                            followedChannels={followedChannels} discoverChannels={discoverChannels}
                            onOpenChat={onChatOpen} onOpenZoom={openZoom}
                            onSelectChannel={setSelectedChannel}
                            onFollowChannel={(id) => { dispatch(followChannel(id)); logger.event('StatusScreen', 'follow_channel', { id }); }}
                            onHideChannel={(id)   => { dispatch(hideChannel(id));   logger.event('StatusScreen', 'hide_channel',   { id }); }}
                            onExplore={() => setView('explore')}
                        />
                    </>
                )}
            </div>

            {/* Status player overlay */}
            {activeUserIndex !== null && (
                <StatusPlayer users={statusUsers} currentUserIndex={activeUserIndex}
                    onUserChange={setActiveUserIndex} onUpdateSeen={handleUpdateSeen}
                    onClose={() => setActiveUserIndex(null)} />
            )}

            {zoomChat && <ProfilePictureOverlay chat={zoomChat} onClose={closeZoom} />}

            {/* FABs — hidden when status player is open */}
            <div className={`absolute bottom-6 right-5 flex flex-col items-center gap-3 z-[50] ${activeUserIndex !== null ? 'hidden' : ''}`}>
                <button onClick={() => setStatusCreatorType('text')}
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all"
                    style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Icons.Pencil size={20} style={{ color: 'var(--text-primary)' }} />
                </button>
                <button onClick={() => fileInputRef.current?.click()}
                    className="w-14 h-14 rounded-full bg-accent flex items-center justify-center shadow-2xl active:scale-90 transition-all hover:opacity-90">
                    <Icons.Camera size={24} className="text-white" strokeWidth={2} />
                </button>
            </div>
        </div>
    );
};

export default StatusScreen;
