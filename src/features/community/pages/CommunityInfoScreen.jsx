// src/features/community/pages/CommunityInfoScreen.jsx
// Collapsing-header community detail screen.
// Sub-screens extracted to components/sub-screens/ — this file orchestrates only.

import React, { useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Avatar from '@shared/ui/display/Avatar';
import { useFakeLoading } from '@shared/hooks';
import { Icons } from '@constants/icons';
import { MediaGalleryScreen, MediaLinksDocsPanel } from '@features/chat';
import { selectContacts } from '@core/store/slices/contactSlice';
import { selectCommunities } from '@core/store/slices/communitySlice';
import { addCommunityMembers } from '@core/store/slices/communitySlice';
import { showToast } from '@core/store/slices/uiSlice';
import { CommunityInfoSkeleton } from '@shared/ui/display/Skeletons';
import { ImageViewer } from '@shared/ui/display';

// Sub-screens (intra-feature, relative imports)
import AddCommunityMembersScreen from '../components/sub-screens/AddCommunityMembersScreen';
import ManageGroupsScreen        from '../components/sub-screens/ManageGroupsScreen';
import EditCommunityScreen       from '../components/sub-screens/EditCommunityScreen';
import CommunitySettingsScreen   from '../components/sub-screens/CommunitySettingsScreen';
import ChatHistoryScreen         from '../components/sub-screens/ChatHistoryScreen';

// CommunityLinkScreen lives in community/components (own feature)
import CommunityLinkScreen from '../components/CommunityLinkScreen';

const HERO_AVATAR    = 112;
const SMALL_AVATAR   = 32;
const COLLAPSE_RANGE = 220;

const CommunityInfoScreen = ({ community, onBack, onGroupClick, onEdit: _onEdit }) => {
    const dispatch    = useDispatch();
    const contacts    = useSelector(selectContacts);
    const communities = useSelector(selectCommunities);
    const [activeTab,        setActiveTab]        = useState('community');
    const [descExpanded,     setDescExpanded]     = useState(false);
    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
    const [showAvatarViewer, setShowAvatarViewer] = useState(false);
    const [isMuted,          setIsMuted]          = useState(false);
    const [showMedia,        setShowMedia]        = useState(false);
    const [showMediaLinksDoc,setShowMediaLinksDoc]= useState(false);
    const isLoading = useFakeLoading(400, community?.id);
    const scrollRef = useRef(null);
    const [scrollY,  setScrollY]  = useState(0);
    const [subScreen,setSubScreen]= useState(null);

    const currentCommunity = communities?.find(c => c.id === community?.id) || community;
    const name      = currentCommunity.name || 'Community';
    const image     = currentCommunity.image || null;
    const desc      = currentCommunity.description || 'Community for sharing updates and information with all members.';
    const subGroups = currentCommunity.subGroups || [];

    const members = (community.members || []).map((member) => {
        if (member.contactId === 'me' || member.isMe) {
            return { id: 'me', contact: { id: 'me', name: 'You', initials: 'ME', avatar: null, avatarColor: '#00a884', about: 'Community Creator' }, role: member.role || 'Community Owner' };
        }
        const contact = contacts.find(c => c.id === member.contactId);
        return {
            id: member.contactId,
            contact: contact || { id: member.contactId, name: member.name || 'Unknown', initials: member.initials || member.contactId.slice(0, 2).toUpperCase(), avatar: member.avatar || null, avatarColor: member.avatarColor || '#9ca3af', about: member.about || '' },
            role: member.role,
        };
    });
    const displayMembers   = members.length > 0 ? members : contacts.slice(0, Math.min(8, contacts.length)).map(contact => ({ id: contact.id, contact, role: '' }));
    const memberCount      = community.members?.length ?? community.memberCount ?? displayMembers.length;
    const existingMemberIds = members.map(m => m.id);

    const progress            = Math.min(1, scrollY / COLLAPSE_RANGE);
    const heroOpacity         = Math.max(0, 1 - progress * 1.5);
    const heroScale           = 1 - progress * 0.06;
    const heroPointerEvents   = progress > 0.85 ? 'none' : 'auto';
    const headerProgress      = Math.min(1, Math.max(0, (scrollY - 60) / (COLLAPSE_RANGE - 60)));
    const headerOpacity       = headerProgress;
    const headerTitleOpacity  = Math.min(1, Math.max(0, (scrollY - 100) / (COLLAPSE_RANGE - 100)));
    const btnVisible          = progress < 0.5;
    const btnBaseStyle = (delay) => ({
        opacity: btnVisible ? 1 : 0,
        transform: btnVisible ? 'translateY(0px)' : 'translateY(16px)',
        transition: `opacity 0.25s ease ${delay}s, transform 0.25s ease ${delay}s`,
        pointerEvents: btnVisible ? 'auto' : 'none',
    });

    const handleScroll = useCallback((e) => setScrollY(e.target.scrollTop), []);



    const Row = ({ icon, label, sub, right, onClick, danger }) => (
        <button onClick={onClick || (() => {})}
            className={`flex items-center gap-4 w-full px-5 py-4 hover:bg-bg-hover transition border-b border-border-main/15 text-left ${danger ? 'text-red-500' : ''}`}>
            <span className={danger ? 'text-red-500 shrink-0' : 'text-text-secondary shrink-0'}>{icon}</span>
            <div className="flex-1 min-w-0">
                <p className={`text-[15px] ${danger ? 'text-red-500 font-medium' : 'text-text-primary'}`}>{label}</p>
                {sub && <p className="text-[12px] text-text-secondary mt-0.5">{sub}</p>}
            </div>
            {right !== undefined && <span className="text-[13px] text-text-secondary shrink-0">{right}</span>}
        </button>
    );

    const ActionBtn = ({ icon, label, onClick, delayStyle }) => (
        <button onClick={onClick} style={delayStyle}
            className="flex-1 flex flex-col items-center justify-center gap-2 rounded-2xl border border-border-main/30 bg-bg-surface py-4 px-3 hover:bg-bg-hover active:scale-95 transition-transform text-text-primary">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">{icon}</div>
            <span className="text-[13px] font-semibold text-center leading-tight">{label}</span>
        </button>
    );

    if (!currentCommunity) return null;
    if (isLoading)         return <CommunityInfoSkeleton />;
    if (showMedia)        return <MediaGalleryScreen chat={currentCommunity} onBack={() => setShowMedia(false)} />;
    if (showMediaLinksDoc)return <MediaLinksDocsPanel chat={currentCommunity} mediaCount={24} onClose={() => setShowMediaLinksDoc(false)} />;

    return (
        <div className="absolute inset-0 bg-bg-surface z-[600] flex flex-col overflow-hidden">

            {/* Sticky Header */}
            <header className="flex items-center gap-2 px-2 pt-3 pb-1 shrink-0 z-10 transition-colors duration-150"
                style={{ background: scrollY > 30 ? 'var(--bg-surface)' : 'transparent', backdropFilter: scrollY > 30 ? 'blur(8px)' : 'none' }}>
                <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full text-text-primary transition active:scale-90">
                    <Icons.ArrowLeft size={24} />
                </button>
                <div className="flex items-center gap-2 flex-1 overflow-hidden"
                    style={{ opacity: headerOpacity, transform: `translateX(${(1 - headerProgress) * -12}px)`, transition: 'opacity 0.15s ease, transform 0.15s ease' }}>
                    <Avatar src={image} name={name} initials={community.initials} color={community.avatarColor} size={SMALL_AVATAR} shape="rounded" />
                    <div className="min-w-0" style={{ opacity: headerTitleOpacity }}>
                        <p className="text-text-primary font-semibold text-[15px] truncate">{name}</p>
                        <p className="text-text-secondary text-[12px]">Community · {subGroups.length} group{subGroups.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>
            </header>

            {/* Scrollable body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar" onScroll={handleScroll}>

                {/* Hero block */}
                <div className="flex flex-col items-center px-5 pt-3 pb-2"
                    style={{ opacity: heroOpacity, transform: `scale(${heroScale})`, transformOrigin: 'top center', transition: 'opacity 0.1s ease, transform 0.1s ease', pointerEvents: heroPointerEvents }}>
                    <div className="cursor-pointer hover:opacity-90 transition-opacity active:scale-95" onClick={() => setShowAvatarViewer(true)}>
                        <Avatar src={image} name={name} initials={community.initials} color={community.avatarColor} size={HERO_AVATAR} shape="rounded" />
                    </div>
                    <h1 className="text-[20px] font-bold text-text-primary mt-3 text-center">{name}</h1>
                    <p className="text-[13px] text-text-secondary mt-0.5 text-center">Community · {subGroups.length} group{subGroups.length !== 1 ? 's' : ''}</p>
                </div>

                {/* Description */}
                <div className="px-5 pb-3 overflow-hidden"
                    style={{ opacity: heroOpacity, maxHeight: heroOpacity > 0 ? '200px' : '0px', transition: 'opacity 0.1s ease, max-height 0.15s ease', pointerEvents: heroPointerEvents }}>
                    <p className="text-[14px] text-text-primary leading-[22px] text-center">
                        {descExpanded ? desc : desc.slice(0, 100)}
                        {desc.length > 100 && !descExpanded && (
                            <button onClick={() => setDescExpanded(true)} className="text-accent ml-1 font-medium">Read more</button>
                        )}
                    </p>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-3 gap-2 px-4 pt-2 pb-4 border-b border-border-main/20 overflow-hidden"
                    style={{ maxHeight: btnVisible ? '200px' : '0px', paddingTop: btnVisible ? undefined : '0', paddingBottom: btnVisible ? undefined : '0', borderBottomWidth: btnVisible ? undefined : '0', transition: 'max-height 0.2s ease, padding 0.2s ease' }}>
                    <ActionBtn icon={<Icons.Link size={20} />}     label="Invite"      onClick={() => setSubScreen('communityLink')}   delayStyle={btnBaseStyle(0)} />
                    <ActionBtn icon={<Icons.UserPlus size={20} />} label="Add members" onClick={() => setSubScreen('addMembers')}     delayStyle={btnBaseStyle(0.06)} />
                    <ActionBtn icon={<Icons.Users size={20} />}    label="Add groups"  onClick={() => setSubScreen('manageGroups')}   delayStyle={btnBaseStyle(0.12)} />
                </div>

                {/* Tabs */}
                <div className="flex border-b border-border-main/30 bg-bg-surface sticky top-0 z-[5]">
                    {['community', 'announcements'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 text-[14px] font-semibold capitalize transition-colors ${activeTab === tab ? 'text-text-primary border-b-2 border-accent' : 'text-text-secondary'}`}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Community tab */}
                {activeTab === 'community' && (<>
                    <p className="px-5 py-3 text-[13px] text-text-secondary">{memberCount} community members</p>
                    <button onClick={() => setSubScreen('addMembers')} className="flex items-center gap-4 w-full px-5 py-3 hover:bg-bg-hover transition-colors border-b border-border-main/10 active:bg-bg-hover/80">
                        <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shrink-0"><Icons.UserPlus size={22} className="text-white" /></div>
                        <span className="text-[16px] text-text-primary">Add members</span>
                    </button>

                    {[...displayMembers].sort((a, b) => {
                        const rank = r => r?.includes('Owner') ? 0 : r?.includes('Admin') ? 1 : 2;
                        return rank(a.role) - rank(b.role);
                    }).map(({ id, contact, role }) => {
                        const isOwner = !!role?.includes('Owner');
                        const isAdmin = !!role?.includes('Admin') && !isOwner;
                        return (
                            <button key={id} onClick={() => dispatch(showToast(`${contact.name}`, 'info'))}
                                className="flex items-center gap-4 w-full px-5 py-3 hover:bg-bg-hover transition-colors border-b border-border-main/10 text-left active:bg-bg-hover/80">
                                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shrink-0 text-[16px] font-bold text-white" style={{ background: contact.avatarColor || '#6b7280' }}>
                                    {contact.avatar ? <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" /> : (contact.initials || contact.name?.slice(0, 2).toUpperCase())}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[16px] text-text-primary truncate">{contact.name}</p>
                                    {(contact.about || contact.status) && <p className="text-[13px] text-text-secondary truncate mt-0.5">{contact.about || contact.status}</p>}
                                </div>
                                {(isOwner || isAdmin) && (
                                    <span className={`text-[12px] px-2.5 py-1 rounded font-medium shrink-0 border whitespace-nowrap ${isOwner ? 'border-accent/50 text-accent bg-accent/10' : 'border-border-main/60 text-text-secondary bg-bg-surface'}`}>
                                        {isOwner ? 'Community Owner' : 'Community Admin'}
                                    </span>
                                )}
                            </button>
                        );
                    })}

                    <div className="h-2 bg-bg-surface border-y border-border-main/20 mt-2" />
                    <Row icon={<Icons.Edit2 size={20} />}   label="Edit community info"  onClick={() => setSubScreen('editCommunity')} />
                    <Row icon={<Icons.Users size={20} />}   label="Manage groups"         onClick={() => setSubScreen('manageGroups')} />
                    <Row icon={<Icons.Settings size={20} />}label="Community settings"    onClick={() => setSubScreen('communitySettings')} />
                    <div className="h-2 bg-bg-surface border-y border-border-main/20 my-1" />
                    <Row icon={<Icons.Bell size={20} />} label={isMuted ? 'Unmute notifications' : 'Mute notifications'} right={isMuted ? 'Muted' : ''}
                        onClick={() => { setIsMuted(m => !m); dispatch(showToast(isMuted ? 'Unmuted' : 'Muted', 'info')); }} />
                    <Row icon={<Icons.LogOut size={20} />} label="Leave community" onClick={() => setShowLeaveConfirm(true)} danger />
                    <div className="h-20" />
                </>)}

                {/* Announcements tab */}
                {activeTab === 'announcements' && (<>
                    <div className="px-4 py-3 border-b border-border-main/20">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[14px] text-text-secondary">Media, links, and docs</span>
                            <button className="flex items-center gap-1 text-text-secondary hover:text-text-primary" onClick={() => setShowMediaLinksDoc(true)}>
                                <span className="text-[14px]">670</span><Icons.ChevronRight size={16} />
                            </button>
                        </div>
                        <div className="flex gap-1 overflow-hidden rounded-lg">
                            {['photo-1593642632559-0c6d3fc62b89','photo-1585771724684-38269d6639fd','photo-1571019614242-c5c5dee9f50b','photo-1596462502278-27bfdc403348'].map((id, i) => (
                                <div key={i} className="flex-1 aspect-square overflow-hidden">
                                    <img src={`https://images.unsplash.com/${id}?w=200`} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <Row icon={<Icons.Bell size={20} />}      label="Notifications" />
                    <Row icon={<Icons.ImageOff size={20} />}  label="Media visibility"       sub="Off" />
                    <Row icon={<Icons.Star size={20} />}      label="Kept messages"           right="1" />
                    <Row icon={<Icons.Lock size={20} />}      label="Encryption"              sub="Messages and calls are end-to-end encrypted. Tap to learn more." />
                    <Row icon={<Icons.Clock size={20} />}     label="Disappearing messages"   sub="90 days" />
                    <Row icon={<Icons.History size={20} />}   label="Chat history"            onClick={() => setSubScreen('chatHistory')} />
                    <div className="h-20" />
                </>)}
            </div>

            {/* Leave modal */}
            {showLeaveConfirm && (
                <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-6" onClick={() => setShowLeaveConfirm(false)}>
                    <div className="bg-bg-surface rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-text-primary font-bold text-[18px] mb-2">Leave community?</h3>
                        <p className="text-text-secondary text-[14px] mb-6 leading-relaxed">You'll leave <span className="text-text-primary font-medium">"{name}"</span> and all its sub-groups.</p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setShowLeaveConfirm(false)} className="px-5 py-2.5 text-text-secondary text-[14px] font-semibold hover:bg-bg-hover rounded-xl transition">Cancel</button>
                            <button onClick={() => { setShowLeaveConfirm(false); dispatch(showToast('Left community', 'info')); onBack(); }} className="px-5 py-2.5 text-red-500 text-[14px] font-bold hover:bg-red-500/10 rounded-xl transition">Leave</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sub-screens */}
            {subScreen === 'addMembers'       && <AddCommunityMembersScreen community={currentCommunity} contacts={contacts} existingMemberIds={existingMemberIds} onBack={() => setSubScreen(null)} onAdd={(ids) => { dispatch(addCommunityMembers(currentCommunity.id, ids)); dispatch(showToast(`${ids.length} member${ids.length > 1 ? 's' : ''} added`, 'success')); setSubScreen(null); }} />}
            {subScreen === 'manageGroups'     && <ManageGroupsScreen        community={currentCommunity} onBack={() => setSubScreen(null)} onGroupClick={onGroupClick} />}
            {subScreen === 'communityLink'    && (
                <div className="absolute inset-0 z-[700]">
                    <CommunityLinkScreen community={currentCommunity} onBack={() => setSubScreen(null)} />
                </div>
            )}
            {subScreen === 'editCommunity'    && <EditCommunityScreen       community={currentCommunity} onBack={() => setSubScreen(null)} />}
            {subScreen === 'communitySettings'&& <CommunitySettingsScreen   community={currentCommunity} onBack={() => setSubScreen(null)} />}
            {subScreen === 'chatHistory'      && <ChatHistoryScreen         onBack={() => setSubScreen(null)} />}

            {/* Full-screen avatar viewer */}
            <ImageViewer
                open={showAvatarViewer}
                onClose={() => setShowAvatarViewer(false)}
                src={image || null}
                name={name}
                color={community.avatarColor}
                initials={community.initials}
                shape="rounded"
                subtitle={`Community · ${subGroups.length} group${subGroups.length !== 1 ? 's' : ''}`}
            />
        </div>
    );
};

export default CommunityInfoScreen;
