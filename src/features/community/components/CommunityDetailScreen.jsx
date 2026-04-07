import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFakeLoading } from '@shared/hooks';
import { Icons } from '@constants/icons';
import AnnouncementChatScreen from './AnnouncementChatScreen';
import CommunityLinkScreen from './CommunityLinkScreen';
import CommunityQRScreen from './CommunityQRScreen';
import { NewGroupScreen } from '@features/chat';
import { CommunityDetailSkeleton } from '@shared/ui/display/Skeletons';
import ConfirmDialog from '@shared/ui/feedback/ConfirmDialog';
import { showToast } from '@core/store/slices/uiSlice';

const CommunityDetailScreen = ({ community, onBack, onInfo, onGroupChatOpen }) => {
    const isLoading = useFakeLoading();
    const dispatch  = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [showMembers, setShowMembers] = useState(false);
    const [showCommunityLink, setShowCommunityLink] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [showNewGroup, setShowNewGroup] = useState(false);
    const [showExitConfirm, setShowExitConfirm] = useState(false);

    // Show sub-screens
    if (showCommunityLink) return <CommunityLinkScreen community={community} onBack={() => setShowCommunityLink(false)} />;
    if (showQR) return <CommunityQRScreen community={community} onBack={() => setShowQR(false)} />;

    // Fallback: if no onGroupChatOpen prop, render inline (mobile compat)
    if (selectedGroup && !onGroupChatOpen) return <AnnouncementChatScreen group={selectedGroup} onBack={() => setSelectedGroup(null)} />;

    const handleGroupClick = (group) => {
        const chatObj = {
            ...group,
            isGroup: true,
            isCommunityGroup: true,
            avatar: group.image || community.image,
            lastMessage: group.lastMsg || 'Tap to view group',
            time: group.time || '',
            isCommunityAnnouncement: group.type === 'announcement',
        };
        if (onGroupChatOpen) {
            onGroupChatOpen(chatObj);
        } else {
            setSelectedGroup(chatObj);
        }
    };

    // Split subgroups: announcements first, rest after
    const allSubGroups = community.subGroups || [];
    const announcementGroup = allSubGroups.find(sg => sg.type === 'announcement' || sg.name === 'Announcements');
    const otherGroups = allSubGroups.filter(sg => sg !== announcementGroup);
    const joinedGroups = otherGroups.filter(sg => sg.isJoined === true);
    const joinableGroups = otherGroups.filter(sg => sg.isJoined !== true);

    if (isLoading) return <CommunityDetailSkeleton />;

    return (
        <div className="flex flex-col h-full w-full select-none overflow-hidden bg-bg-surface transition-colors duration-300">

            {/* Header */}
            <header className="px-3 py-3 flex items-center justify-between shrink-0 z-[100] bg-bg-surface">
                <button
                    onClick={onBack}
                    className="p-2 rounded-full hover:bg-bg-hover active:scale-95 transition-all text-text-primary"
                >
                    <Icons.ArrowLeft size={24} />
                </button>

                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className={`p-2 rounded-full transition-all text-text-primary ${showMenu ? 'bg-bg-hover' : 'hover:bg-bg-hover'}`}
                    >
                        <Icons.MoreVertical size={22} />
                    </button>

                    {showMenu && (
                        <>
                            <div className="fixed inset-0 z-[150]" onClick={() => setShowMenu(false)} />
                            <div className="absolute right-2 mt-2 w-52 rounded-lg shadow-2xl py-2 z-[200] animate-zoom-in bg-bg-surface border border-border-main/50">
                                <div className="px-5 py-3 text-[15px] hover:bg-bg-hover cursor-pointer text-text-primary transition-colors"
                                    onClick={() => { setShowMenu(false); onInfo?.(); }}>
                                    Community info
                                </div>
                                <div className="px-5 py-3 text-[15px] hover:bg-bg-hover cursor-pointer text-text-primary transition-colors"
                                    onClick={() => { setShowMenu(false); setShowMembers(true); }}>
                                    View members
                                </div>
                                <div className="px-5 py-3 text-[15px] hover:bg-bg-hover cursor-pointer text-text-primary transition-colors"
                                    onClick={() => { setShowMenu(false); setShowCommunityLink(true); }}>
                                    Community link
                                </div>
                                <div className="px-5 py-3 text-[15px] hover:bg-bg-hover cursor-pointer text-text-primary transition-colors"
                                    onClick={() => { setShowMenu(false); setShowQR(true); }}>
                                    QR code
                                </div>
                                <div className="px-5 py-3 text-[15px] hover:bg-bg-hover cursor-pointer text-red-500 transition-colors border-t border-border-main/30 mt-1"
                                    onClick={() => { setShowMenu(false); setShowExitConfirm(true); }}>
                                    Exit community
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Community Identity Header */}
                <div className="px-5 py-4 flex items-center gap-4">
                    <div className="w-[60px] h-[60px] rounded-xl overflow-hidden border border-border-main/20 shadow-sm shrink-0">
                        <img
                            src={community.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(community.name)}&background=00a884&color=fff&size=128`}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(community.name)}&background=00a884&color=fff&size=128`; }}
                        />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold text-text-primary leading-tight">{community.name}</h1>
                        <p className="text-[14px] text-text-secondary mt-0.5">Community · {allSubGroups.length} group{allSubGroups.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>

                {/* Description */}
                {community.description ? (
                    <div className="px-5 pb-4">
                        <p className="text-[14px] text-text-secondary leading-relaxed">{community.description}</p>
                    </div>
                ) : null}

                {/* Announcements group — always shown at top */}
                {announcementGroup && (
                    <div className="mt-2">
                        <h2 className="px-6 py-2 text-[13px] font-semibold uppercase tracking-wider text-accent opacity-90">Announcements</h2>
                        <div
                            className="flex items-center p-4 px-6 hover:bg-bg-hover cursor-pointer transition-colors group"
                            onClick={() => handleGroupClick(announcementGroup)}
                        >
                            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 border border-accent/20">
                                <Icons.Bell size={22} />
                            </div>
                            <div className="ml-4 flex-1 border-b border-border-main/20 pb-4">
                                <div className="flex justify-between items-center">
                                    <p className="font-medium text-text-primary group-hover:text-accent transition-colors">Announcements</p>
                                    <Icons.Pin size={16} className="text-text-secondary rotate-45" />
                                </div>
                                <p className="text-[13px] text-text-secondary">{announcementGroup.lastMsg || 'Stay updated with latest news'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* If no Announcements group exists yet (shouldn't happen after fix, but defensive) */}
                {!announcementGroup && (
                    <div className="mt-4 mx-5 p-4 rounded-xl bg-accent/5 border border-accent/20 flex items-center gap-3">
                        <Icons.Bell size={20} className="text-accent shrink-0" />
                        <p className="text-[13px] text-text-secondary">Announcements group will be created automatically.</p>
                    </div>
                )}

                {/* Groups you're in */}
                {joinedGroups.length > 0 && (
                    <div className="mt-4">
                        <h2 className="px-6 py-2 text-[13px] text-text-secondary">
                            Groups you're in
                        </h2>
                        {joinedGroups.map((sub) => (
                            <div
                                key={sub.id}
                                className="flex items-center p-4 px-6 hover:bg-bg-hover cursor-pointer transition-colors group"
                                onClick={() => handleGroupClick(sub)}
                            >
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-border-main/30 shrink-0 bg-bg-hover flex items-center justify-center">
                                    {sub.image
                                        ? <img src={sub.image} alt="" className="w-full h-full object-cover" />
                                        : <span className="text-[15px] font-bold text-text-secondary">{sub.name?.slice(0, 2).toUpperCase()}</span>
                                    }
                                </div>
                                <div className="ml-4 flex-1 border-b border-border-main/20 pb-4">
                                    <div className="flex justify-between items-center">
                                        <p className="font-medium text-text-primary group-hover:text-accent transition-colors">{sub.name}</p>
                                        <span className="text-[12px] text-text-secondary">{sub.time || ''}</span>
                                    </div>
                                    <p className="text-[13px] text-text-secondary truncate">{sub.lastMsg || 'Tap to open'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Groups you can join */}
                {joinableGroups.length > 0 && (
                    <div className="mt-4">
                        <h2 className="px-6 py-2 text-[13px] text-text-secondary">
                            Groups you can join
                        </h2>
                        {joinableGroups.map((sub) => (
                            <div
                                key={sub.id}
                                className="flex items-center p-4 px-6 hover:bg-bg-hover cursor-pointer transition-colors group"
                                onClick={() => dispatch(showToast(sub.requestToJoin ? 'Request to join sent' : `Opening ${sub.name}...`))}
                            >
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-border-main/30 shrink-0 bg-bg-hover flex items-center justify-center">
                                    {sub.image
                                        ? <img src={sub.image} alt="" className="w-full h-full object-cover" />
                                        : <span className="text-[15px] font-bold text-text-secondary">{sub.name?.slice(0, 2).toUpperCase()}</span>
                                    }
                                </div>
                                <div className="ml-4 flex-1 border-b border-border-main/20 pb-4">
                                    <p className="font-medium text-text-primary group-hover:text-accent transition-colors">{sub.name}</p>
                                    <p className="text-[13px] text-text-secondary truncate">
                                        {sub.memberCount ? `${sub.memberCount} members` : sub.requestToJoin ? 'Request to join' : sub.lastMsg || ''}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Fallback: show all non-announcement groups if none have isJoined flag */}
                {joinedGroups.length === 0 && joinableGroups.length === 0 && otherGroups.length > 0 && (
                    <div className="mt-4">
                        <h2 className="px-6 py-2 text-[13px] text-text-secondary">
                            Groups ({otherGroups.length})
                        </h2>
                        {otherGroups.map((sub) => (
                            <div
                                key={sub.id}
                                className="flex items-center p-4 px-6 hover:bg-bg-hover cursor-pointer transition-colors group"
                                onClick={() => handleGroupClick(sub)}
                            >
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-border-main/30 shrink-0 bg-bg-hover flex items-center justify-center">
                                    {sub.image
                                        ? <img src={sub.image} alt="" className="w-full h-full object-cover" />
                                        : <span className="text-[15px] font-bold text-text-secondary">{sub.name?.slice(0, 2).toUpperCase()}</span>
                                    }
                                </div>
                                <div className="ml-4 flex-1 border-b border-border-main/20 pb-4">
                                    <div className="flex justify-between items-center">
                                        <p className="font-medium text-text-primary">{sub.name}</p>
                                        <span className="text-[12px] text-text-secondary">{sub.time || ''}</span>
                                    </div>
                                    <p className="text-[13px] text-text-secondary truncate">{sub.lastMsg || 'Tap to open'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add group button */}
                <div className="mt-4 mx-5 mb-6">
                    <button
                        className="w-full flex items-center gap-3 p-4 rounded-xl border border-dashed border-accent/40 hover:bg-accent/5 transition-colors text-accent"
                        onClick={() => setShowNewGroup(true)}
                    >
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                            <Icons.Plus size={18} />
                        </div>
                        <span className="text-[15px] font-medium">Add group</span>
                    </button>
                </div>

                <div className="h-20" />
            </div>

            {/* Members panel overlay */}
            {showMembers && (
                <div className="absolute inset-0 z-[600] bg-bg-surface flex flex-col animate-fade-in">
                    <header className="px-4 py-4 flex items-center gap-4 shrink-0 border-b border-border-main/10">
                        <button onClick={() => setShowMembers(false)} className="p-2 hover:bg-bg-hover rounded-full text-text-secondary active:scale-90 transition-all">
                            <Icons.ArrowLeft size={24} />
                        </button>
                        <h2 className="text-[18px] font-semibold text-text-primary flex-1">Groups in community</h2>
                    </header>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {allSubGroups.map((sub, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 px-5 py-3 hover:bg-bg-hover cursor-pointer"
                                onClick={() => { setShowMembers(false); handleGroupClick(sub); }}
                            >
                                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                    {sub.type === 'announcement'
                                        ? <Icons.Bell size={18} className="text-accent" />
                                        : <Icons.Users size={18} className="text-text-secondary" />
                                    }
                                </div>
                                <div className="flex-1 border-b border-border-main/10 pb-3">
                                    <span className="text-text-primary text-[15px] font-medium">{sub.name}</span>
                                    {sub.type === 'announcement' && (
                                        <p className="text-[12px] text-accent">Announcements</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        {allSubGroups.length === 0 && (
                            <p className="text-text-secondary text-center py-10 text-[14px]">No groups in this community yet</p>
                        )}
                    </div>
                </div>
            )}

            {showNewGroup && (
                <NewGroupScreen
                    onBack={() => setShowNewGroup(false)}
                />
            )}

            <ConfirmDialog
                isOpen={showExitConfirm}
                title="Exit this community?"
                message="You will no longer receive messages from this community."
                confirmLabel="Exit"
                cancelLabel="Cancel"
                confirmColor="red"
                onCancel={() => setShowExitConfirm(false)}
                onConfirm={() => { setShowExitConfirm(false); onBack(); }}
            />
        </div>
    );
};

export default CommunityDetailScreen;
