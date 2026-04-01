import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFakeLoading } from '@shared/hooks';
import logger from '@core/utils/logger';
import { Icons } from '@constants/icons';
import { selectCommunities } from '@core/store/slices/communitySlice';
import { addCommunityThunk, updateCommunity } from '@core/store/slices/communitySlice';
import { showToast } from '@core/store/slices/uiSlice';
import MenuButton from '@shared/ui/modals/MenuButton';
import CommunityDetailScreen from '../components/CommunityDetailScreen';
import CommunityInfoScreen from './CommunityInfoScreen';
import { NewCommunityModal } from '@features/community';
import ProfilePictureOverlay from '@shared/ui/display/ProfilePictureOverlay';
import useAvatarZoom from '@shared/hooks/useAvatarZoom';
import { CommunitiesScreenSkeleton } from '@shared/ui/display/Skeletons';

const CommunitiesScreen = ({ onChatOpen, onCommunityInfo, onNavigateToSettings }) => {
    const dispatch    = useDispatch();
    const communities = useSelector(selectCommunities);
    const isLoading = useFakeLoading(550);
    const [selectedCommunity, setSelectedCommunity] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const { zoomChat, openZoom, closeZoom } = useAvatarZoom();
    const [showNewCommunity, setShowNewCommunity] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const menuRef = useRef(null);
    const [communityInfoTarget, setCommunityInfoTarget] = useState(null);
    const [newlyAddedId, setNewlyAddedId] = useState(null);
    const listRef = useRef(null);

    // Highlight and scroll to newly created community
    useEffect(() => {
        if (newlyAddedId) {
            const timer = setTimeout(() => setNewlyAddedId(null), 3000);
            // scroll top so user sees it
            listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            return () => clearTimeout(timer);
        }
    }, [newlyAddedId]);

    const handleSubGroupClick = (sub, community) => {
        logger.nav('CommunitiesScreen', `subgroup clicked: ${sub.name}`);
        onChatOpen?.({
            id: sub.id,
            name: sub.name,
            avatar: sub.image || community.image || null,
            isGroup: true,
            isCommunityGroup: true,
            isCommunityAnnouncement: sub.type === 'announcement',
            lastMessage: sub.lastMsg || '',
            time: sub.time || '',
        });
    };

    const handleCreateCommunity = (data) => {
        if (editTarget) {
            dispatch(updateCommunity(editTarget.id, { name: data.name, description: data.description, image: data.image }));
            setCommunityInfoTarget(prev => prev?.id === editTarget.id ? { ...prev, name: data.name, description: data.description, image: data.image } : prev);
            dispatch(showToast(`Community updated: "${data.name}"`));
            logger.event('CommunitiesScreen', 'community_updated', { id: editTarget.id, name: data.name });
            setEditTarget(null);
            return;
        }

        const result = dispatch(addCommunityThunk(data));
        const newId = result?.id || `comm-${Date.now()}`;
        setNewlyAddedId(newId);
        dispatch(showToast(`"${data.name}" community created! 🎉`));
        logger.event('CommunitiesScreen', 'community_created', { name: data.name });
    };

    if (isLoading) return <CommunitiesScreenSkeleton />;

    if (communityInfoTarget) {
        return (
            <CommunityInfoScreen
                community={communityInfoTarget}
                onBack={() => setCommunityInfoTarget(null)}
                onGroupClick={(group) => handleSubGroupClick(group, communityInfoTarget)}
                onEdit={(c) => { setCommunityInfoTarget(c); setEditTarget(c); setShowNewCommunity(true); }}
            />
        );
    }

    if (selectedCommunity) {
        return (
            <CommunityDetailScreen
                community={selectedCommunity}
                onBack={() => setSelectedCommunity(null)}
                onInfo={() => setCommunityInfoTarget(selectedCommunity)}
                onGroupChatOpen={onChatOpen}
            />
        );
    }

    if (showNewCommunity || editTarget) return (
        <NewCommunityModal
            isOpen={true}
            editData={editTarget}
            onClose={() => { setShowNewCommunity(false); setEditTarget(null); }}
            onCreateCommunity={(data) => {
                handleCreateCommunity(data);
                setShowNewCommunity(false);
                setEditTarget(null);
            }}
        />
    );


    return (
        <div className="flex flex-col h-full select-none overflow-hidden bg-bg-surface transition-colors duration-300">

            {/* Header */}
            <header className="px-5 py-5 flex justify-between items-center shrink-0">
                <h1 className="text-2xl font-bold text-text-primary">Communities</h1>
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className={`p-2 hover:bg-bg-hover rounded-full text-text-secondary ${showMenu ? 'bg-bg-hover' : ''}`}
                    >
                        <Icons.MoreVertical size={20} />
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-52 bg-bg-surface border border-border-main rounded-lg shadow-xl z-[210] py-2 animate-zoom-in origin-top-right">
                            <MenuButton icon={<Icons.Settings size={20} />} label="Settings" onClick={() => { onNavigateToSettings?.(); setShowMenu(false); }} />
                            <MenuButton icon={<Icons.UserRound size={20} />} label="Switch account" onClick={() => { setShowMenu(false); dispatch(showToast('Switch account feature coming soon', 'info')); }} />
                        </div>
                    )}
                </div>
            </header>

            {/* Scrollable content */}
            <div ref={listRef} className="flex-1 overflow-y-auto custom-scrollbar">

                {/* New Community Button */}
                <div
                    className="flex items-center p-4 hover:bg-bg-hover cursor-pointer transition-all group"
                    onClick={() => setShowNewCommunity(true)}
                >
                    <div className="relative">
                        <div className="w-[48px] h-[48px] rounded-xl flex items-center justify-center bg-text-secondary/20">
                            <Icons.Users size={28} className="text-text-secondary" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 rounded-full border-2 border-bg-surface w-5 h-5 flex items-center justify-center bg-accent text-white text-[14px] font-bold shadow-sm">
                            <Icons.Plus size={12} strokeWidth={4} />
                        </div>
                    </div>
                    <span className="ml-4 font-medium text-[17px] text-text-primary">New community</span>
                </div>

                <div className="h-2.5 w-full bg-bg-surface border-y border-border-main/20" />

                {/* Communities list */}
                {communities.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                            <Icons.Users2 size={28} className="text-accent" />
                        </div>
                        <p className="text-[16px] font-semibold text-text-primary mb-2">No communities yet</p>
                        <p className="text-[13px] text-text-secondary">Tap "New community" to get started.</p>
                    </div>
                )}

                {communities.map((community) => {
                    const isNew = community.id === newlyAddedId;
                    const subGroups = community.subGroups || [];
                    const announcementGroup = subGroups.find(sg => sg.type === 'announcement' || sg.name === 'Announcements');
                    const otherGroups = subGroups.filter(sg => sg !== announcementGroup);

                    return (
                        <div key={community.id} className="group">
                            {/* Community header row */}
                            <div
                                onClick={() => onCommunityInfo ? onCommunityInfo(community) : setSelectedCommunity(community)}
                                className={`flex items-center p-4 hover:bg-bg-hover transition-colors border-b border-border-main/30 relative
                                    ${isNew ? 'bg-accent/5 animate-pulse-once' : ''}`}
                            >
                                {/* New badge */}
                                {isNew && (
                                    <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-full bg-accent" />
                                )}
                                <div className="w-[48px] h-[48px] rounded-xl overflow-hidden border border-border-main/50 shrink-0 shadow-sm cursor-pointer"
                                    onClick={(e) => { e.stopPropagation(); openZoom({ name: community.name, avatar: community.image, avatarColor: '#00a884' }); }}
                                >
                                    <img
                                        src={community.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(community.name)}&background=random`}
                                        alt=""
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(community.name)}&background=00a884&color=fff&size=128`; }}
                                    />
                                </div>
                                <div className="ml-4 flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-[17px] truncate text-text-primary">{community.name}</span>
                                        {isNew && (
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-accent text-white shrink-0">NEW</span>
                                        )}
                                    </div>
                                    <p className="text-[12px] text-text-secondary">{subGroups.length} group{subGroups.length !== 1 ? 's' : ''}</p>
                                </div>
                                <Icons.ChevronRight size={18} className="text-text-secondary/50 shrink-0" />
                            </div>

                            {/* Announcements sub-group — always shown */}
                            {announcementGroup && (
                                <div
                                    className="flex items-center p-3 px-4 hover:bg-bg-hover/50 cursor-pointer"
                                    onClick={() => handleSubGroupClick(announcementGroup, community)}
                                >
                                    <div className="flex-shrink-0 w-[48px] h-[48px] flex items-center justify-center">
                                        <div className="w-[40px] h-[40px] rounded-lg flex items-center justify-center bg-accent/10 text-accent">
                                            <Icons.Bell size={18} />
                                        </div>
                                    </div>
                                    <div className="ml-3 flex-1 flex flex-col border-b border-border-main/20 pb-3">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-[16px] text-text-primary">Announcements</span>
                                            <span className="text-[12px] text-text-secondary">{announcementGroup.time || 'Now'}</span>
                                        </div>
                                        <p className="text-[14px] truncate mt-0.5 text-text-secondary">
                                            {announcementGroup.lastMsg || 'Welcome to the community!'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Other sub-groups (up to 2 shown) */}
                            {otherGroups.slice(0, 2).map((sub) => (
                                <div
                                    key={sub.id}
                                    className="flex items-center p-3 px-4 hover:bg-bg-hover/50 cursor-pointer"
                                    onClick={() => handleSubGroupClick(sub, community)}
                                >
                                    <div className="flex-shrink-0 w-[48px] h-[48px] flex items-center justify-center">
                                        <div className="w-[40px] h-[40px] rounded-lg flex items-center justify-center bg-bg-input text-text-secondary">
                                            <Icons.Users size={18} />
                                        </div>
                                    </div>
                                    <div className="ml-3 flex-1 flex flex-col border-b border-border-main/20 pb-3">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-[16px] text-text-primary">{sub.name}</span>
                                            <span className="text-[12px] text-text-secondary">{sub.time || ''}</span>
                                        </div>
                                        <p className="text-[14px] truncate mt-0.5 text-text-secondary">{sub.lastMsg || ''}</p>
                                    </div>
                                </div>
                            ))}

                            {/* View all */}
                            <div
                                className="flex items-center p-3 px-4 pl-[76px] hover:bg-bg-hover/50 cursor-pointer group"
                                onClick={() => onCommunityInfo ? onCommunityInfo(community) : setSelectedCommunity(community)}
                            >
                                <div className="flex items-center w-full pb-2">
                                    <Icons.ChevronRight size={20} className="mr-6 text-accent group-hover:translate-x-1 transition-transform" />
                                    <span className="text-[15px] text-accent font-medium">View all</span>
                                </div>
                            </div>

                            <div className="h-2.5 w-full bg-bg-surface border-y border-border-main/20" />
                        </div>
                    );
                })}

                <div className="h-24" />
            </div>

            {zoomChat && (
                <ProfilePictureOverlay chat={zoomChat} onClose={closeZoom} />
            )}
        </div>
    );
};

export default CommunitiesScreen;
