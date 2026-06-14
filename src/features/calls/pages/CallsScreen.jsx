import React, { useState, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFakeLoading } from '@shared/hooks';
import { createPortal } from 'react-dom';
import { showToast } from '@core/store/slices/uiSlice';
import { startCall, endCall, clearCallHistory, removeCallHistoryEntry, selectActiveCall, selectCallHistory } from '@core/store/slices/callsSlice';
import SearchInput from '@shared/ui/inputs/SearchInput';
import { Icons } from '@constants/icons';
import EmptyState from '@shared/ui/display/EmptyState';
import MenuButton from '@shared/ui/modals/MenuButton';
import { NewGroupScreen, SelectContactScreen } from '@features/chat';
import CallHistoryItem from '../components/CallHistoryItem';
import ProfilePictureOverlay from '@shared/ui/display/ProfilePictureOverlay';
import useAvatarZoom from '@shared/hooks/useAvatarZoom';
import logger from '@core/utils/logger';
import CallKeypad from '../components/CallKeypad';
import NewContactScreen from '@shared/ui/contact/NewContactScreen';
import { CallsScreenSkeleton } from '@shared/ui/display/Skeletons';
import ScheduleCallScreen from '../components/ScheduleCallScreen';
import ScheduledCallsScreen from '../components/ScheduledCallsScreen';
import CreateCallLinkScreen from '../components/CreateCallLinkScreen';
import ActiveCallScreen from './ActiveCallScreen';

import CallInfoScreen from './CallInfoScreen';

import ConfirmDialog from '@shared/ui/feedback/ConfirmDialog';
import AddFavoriteHub from '../components/AddFavoriteHub';

// Module-level constant so the full list can be restored via setState([...CALL_LOGS_DATA])
const CALL_LOGS_DATA = [
    { id: 1, name: 'Laiba Jax (2)', time: 'Yesterday, 2:37 pm', type: 'audio', direction: 'incoming', status: 'connected', avatar: '' },
    { id: 2, name: 'Tahir Yr', time: 'Yesterday, 10:23 am', type: 'audio', direction: 'incoming', status: 'connected', avatar: '' },
    { id: 3, name: 'Usman', time: 'Yesterday, 10:05 am', type: 'audio', direction: 'incoming', status: 'connected', avatar: '' },
    { id: 4, name: 'Tahir Yr', time: '8 March, 12:35 pm', type: 'audio', direction: 'incoming', status: 'missed', avatar: '' },
    { id: 5, name: 'Anam Masood Api', time: '5 March, 10:25 pm', type: 'audio', direction: 'incoming', status: 'missed', avatar: '' },
    { id: 6, name: 'Heart Beat Jani', time: '1 June, 1:24 pm', type: 'audio', direction: 'incoming', status: 'missed', avatar: '' },
];

const CallsScreen = ({ onChatOpen, isDesktop, onNavigateToSettings, onOpenInfoPanel }) => {
    const dispatch = useDispatch();

    const isLoading = useFakeLoading(500);

    const [isKeypadOpen, setIsKeypadOpen] = useState(false);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const { zoomChat, openZoom, closeZoom } = useAvatarZoom();
    const menuRef = useRef(null);
    const [view, setView] = useState('main');
    const activeCall = useSelector(selectActiveCall);
    const callHistory = useSelector(selectCallHistory);
    const [selectedCallInfo, setSelectedCallInfo] = useState(null);
    const [prefillPhone, setPrefillPhone] = useState('');

    // State-managed so individual entries can be removed and the list can be cleared
    const [callLogs, setCallLogs] = useState(CALL_LOGS_DATA);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    // Search state
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef(null);

    const combinedCallLogs = useMemo(() => {
        const fromHistory = callHistory.map((c) => ({
            id: `hist-${c.startedAt}`,
            name: c.name || 'Unknown',
            time: 'Just now',
            type: c.type || 'audio',
            direction: 'outgoing',
            status: 'connected',
            avatar: c.avatar || '',
            __historyKey: c.startedAt,
        }));
        return [...fromHistory, ...callLogs];
    }, [callHistory, callLogs]);

    const filteredCallLogs = combinedCallLogs.filter(call =>
        call.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAvatarClick = useCallback((c) =>
        openZoom({ name: c.name, avatar: c.avatar || null, avatarColor: '#374151' }),
    [openZoom]);

    const handleSearchToggle = () => {
        if (showSearch) {
            setSearchQuery('');
            setShowSearch(false);
        } else {
            setShowSearch(true);
            setTimeout(() => searchInputRef.current?.focus(), 50);
        }
    };

    if (isLoading) return <CallsScreenSkeleton />;
    if (isScheduleOpen) return <ScheduleCallScreen onBack={() => setIsScheduleOpen(false)} />;
    if (isKeypadOpen) return <CallKeypad
        onBack={() => setIsKeypadOpen(false)}
        onAddContact={(prefillPhone) => { setIsKeypadOpen(false); setView('new-contact'); setPrefillPhone(prefillPhone || ''); }}
        onCall={(contact) => { dispatch(startCall(contact || { name: 'Unknown' })); setIsKeypadOpen(false); setView('active-call'); }}
        onMessage={(phoneNumber) => {
            
            setIsKeypadOpen(false);
            if (onChatOpen) {
                // Find existing chat by phone number, or open a new one
                onChatOpen({
                    id: `dialer-${phoneNumber}-${Date.now()}`,
                    name: phoneNumber,
                    avatar: '',
                    initials: phoneNumber.replace(/\D/g, '').slice(0, 2) || '?',
                    avatarColor: '#607d8b',
                    lastMessage: { text: '', time: '' },
                    time: '',
                    type: 'direct',
                    isGroup: false,
                });
            }
        }}
    />;
    
    if (view === 'active-call') {
        const callScreen = (
            <ActiveCallScreen
                call={activeCall}
                onEnd={() => { dispatch(endCall()); setView('main'); }}
                isDesktop={isDesktop}
            />
        );
        if (isDesktop) {
            return createPortal(
                <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                    
                    <div
                        className="relative w-[80vw] max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                        style={{ height: 'min(80vh, 600px)', animation: 'zoomIn 0.22s ease-out forwards' }}
                    >
                        {callScreen}
                    </div>
                </div>,
                document.body
            );
        }
        return callScreen;
    };
    if (view === 'scheduled-calls') return <ScheduledCallsScreen onBack={() => setView('main')} />;
    if (view === 'create-call-link') return <CreateCallLinkScreen onBack={() => setView('main')} />;
    if (view === 'add-favorite') return <AddFavoriteHub onBack={() => setView('main')} />
    if (view === 'new-contact') return <NewContactScreen onBack={() => setView('main')} prefillPhone={prefillPhone} />;
    if (view === 'select-contact') return <SelectContactScreen onBack={() => setView('main')} onSelect={(c) => { dispatch(startCall(c)); setView('active-call'); }} />;
    if (view === 'new-group') return <NewGroupScreen onBack={() => setView('main')} onCallGroup={(contacts, name) => { dispatch(startCall({ name: name || contacts.map(c => c.name.split(' ')[0]).join(', ') })); setView('active-call'); }} />;

    // Opens the contact's chat in the main window rather than navigating to a call sub-screen
    
    if (view === 'call-info') return (
        <CallInfoScreen
            call={selectedCallInfo}
            onBack={() => setView('main')}
            onCall={() => { dispatch(startCall(selectedCallInfo)); setView('active-call'); }}
            onVideoCall={() => { dispatch(startCall({ ...selectedCallInfo, type: 'video' })); setView('active-call'); }}
            onMessage={() => {
                if (selectedCallInfo && onChatOpen) {
                    logger.nav('CallsScreen', `message → chat: ${selectedCallInfo.name}`);
                    onChatOpen({
                        id: selectedCallInfo.id || Date.now(),
                        name: selectedCallInfo.name,
                        avatar: selectedCallInfo.avatar || '',
                        lastMessage: 'Tap to message',
                        time: '',
                    });
                }
                setView('main');
            }}
            onRemoveCall={(callId) => {
                // Filter by ID to remove only this entry; all other logs are preserved
                setCallLogs(prev => prev.filter(c => c.id !== callId));
                if (selectedCallInfo?.__historyKey) dispatch(removeCallHistoryEntry(selectedCallInfo.__historyKey));
                logger.event('CallsScreen', 'remove_call_log', { callId });
            }}
            onInfo={(chat) => onOpenInfoPanel?.(chat)}
        />
    );

    return (
        <div className="flex flex-col h-full relative overflow-hidden bg-bg-surface">
            <header className="px-5 py-5 flex justify-between items-center shrink-0">
                <h1 className="text-2xl font-bold text-text-primary">Calls</h1>
                <div className="relative flex items-center gap-3" ref={menuRef}>
                    <button
                        onClick={handleSearchToggle}
                        className={`p-2 rounded-full transition-colors ${showSearch ? 'bg-accent/20 text-accent' : 'text-text-primary hover:bg-bg-hover opacity-80'}`}
                        title="Search calls"
                    >
                        {showSearch ? <Icons.X size={22} /> : <Icons.Search size={22} />}
                    </button>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className={`p-2 hover:bg-bg-hover rounded-full text-text-secondary ${showMenu ? 'bg-bg-hover' : ''}`}
                    >
                        <Icons.MoreVertical size={20} />
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 top-full mt-2 w-52 bg-bg-surface border border-border-main rounded-lg shadow-xl z-[210] py-2 animate-zoom-in origin-top-right">
                            {/* PART 12: Clear call log now shows confirm dialog */}
                            <MenuButton
                                icon={<Icons.Trash2 size={20} />}
                                label="Clear call log"
                                onClick={() => { setShowClearConfirm(true); setShowMenu(false); }}
                            />
                            <MenuButton
                                icon={<Icons.Calendar size={20} />}
                                label="Scheduled calls"
                                onClick={() => { setView('scheduled-calls'); setShowMenu(false); }}
                            />
                            <MenuButton
                                icon={<Icons.Settings size={20} />}
                                label="Settings"
                                onClick={() => { onNavigateToSettings?.(); setShowMenu(false); }}
                            />
                            <MenuButton icon={<Icons.UserRound size={20} />} label="Switch account" onClick={() => { setShowMenu(false); dispatch(showToast('Switch account feature coming soon', 'info')); }} />
                        </div>
                    )}
                </div>
            </header>

            {/* ── Search bar (expandable) ── */}
            {showSearch && (
                <div className="px-4 pb-3 shrink-0 animate-fade-in">
                    <SearchInput ref={searchInputRef} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onClear={() => setSearchQuery("")} placeholder="Search in calls..." className="border border-border-main/20 focus-within:border-accent/40 transition-all shadow-sm" />
                </div>
            )}

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Add Favorite — hidden during search */}
                {!showSearch && (
                <div
                    onClick={() => setView('add-favorite')}
                    className="px-4 py-3 flex items-center gap-4 hover:bg-bg-hover cursor-pointer group"
                >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-accent shadow-sm group-active:scale-95 transition-transform">
                        <Icons.Heart size={22} className="text-white" fill="currentColor" />
                    </div>
                    <span className="text-[17px] font-medium text-text-primary">Add favorite</span>
                </div>
                )}

                {/* Call Link — hidden during search */}
                {!showSearch && (
                <div
                    onClick={() => setView('create-call-link')}
                    className="px-4 py-3 flex items-center gap-4 hover:bg-bg-hover cursor-pointer group"
                >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-accent/10 group-active:scale-95 transition-transform">
                        <Icons.Paperclip size={24} className="text-accent -rotate-45" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[17px] font-medium text-text-primary">Create call link</span>
                        <span className="text-[14px] opacity-70 text-text-secondary">Share a link for your WhatsApp call</span>
                    </div>
                </div>
                )}

                <h2 className="px-4 py-4 text-[14px] font-bold uppercase tracking-wide text-text-primary">
                    {showSearch && searchQuery ? `Results for "${searchQuery}"` : 'Recent'}
                </h2>

                <div className="flex flex-col pb-32">
                    {filteredCallLogs.length === 0 ? (
                        <EmptyState
                            icon={<Icons.Phone size={48} />}
                            title={searchQuery ? `No calls found for "${searchQuery}"` : 'No recent calls'}
                        />
                    ) : (
                        filteredCallLogs.map(call => (
                            <CallHistoryItem
                                key={call.id}
                                call={call}
                                onRowClick={() => { setSelectedCallInfo(call); setView('call-info'); }}
                                onCallClick={() => { dispatch(startCall(call)); setView('active-call'); }}
                                onAvatarClick={handleAvatarClick}
                            />
                        ))
                    )}
                </div>
            </div>

            <div className="absolute bottom-6 right-4 flex flex-col items-center gap-3 z-[100]">
                <button
                    onClick={() => setIsScheduleOpen(true)}
                    className="w-[48px] h-[48px] rounded-2xl shadow-lg flex items-center justify-center transition-all active:scale-90 bg-bg-surface hover:brightness-110 border border-border-main/10"
                >
                    <Icons.Calendar size={22} className="text-accent" />
                </button>
                <button
                    onClick={() => setIsKeypadOpen(true)}
                    className="w-[60px] h-[60px] rounded-2xl shadow-2xl flex items-center justify-center transition-all active:scale-90 bg-accent hover:opacity-90"
                >
                    <div className="relative">
                        <Icons.Phone size={24} className="text-white fill-current" />
                        <span className="absolute -top-1 -right-1 text-[18px] font-bold text-white">+</span>
                    </div>
                </button>
            </div>

            {/* PART 12: Clear call log confirm dialog */}
            {showClearConfirm && (
                <ConfirmDialog
                    isOpen={showClearConfirm}
                    title="Clear call log?"
                    message="This will permanently clear your call log."
                    confirmLabel="Clear"
                    confirmColor="red"
                    onConfirm={() => { setCallLogs([]); dispatch(clearCallHistory()); setShowClearConfirm(false); }}
                    onCancel={() => setShowClearConfirm(false)}
                />
            )}

            {zoomChat && <ProfilePictureOverlay chat={zoomChat} onClose={closeZoom} />}
        </div>
    );
};

export default CallsScreen;
