// src/features/status/pages/ChannelInfoScreen.jsx
// Orchestrator — ~180 lines after Phase 4 decomposition.
// Sub-components: ChannelHeader | ChannelStickyBar | ChannelPostList | ChannelSearchBar

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFakeLoading } from '@shared/hooks';
import { Icons } from '@constants/icons';
import { selectContacts } from '@core/store/slices/contactSlice';
import { selectChannels } from '@core/store/slices/channelSlice';
import { followChannel, unfollowChannel, addChannelPost } from '@core/store/slices/channelSlice';
import { showToast } from '@core/store/slices/uiSlice';
import { ImageViewer } from '@shared/ui/display';
import { ChannelInfoSkeleton } from '@shared/ui/display/Skeletons';
import ChannelHeader, { ChannelStickyBar } from '../components/ChannelHeader';
import ChannelPostList, { ChannelSearchBar } from '../components/ChannelPostList';

// ─── Action button ─────────────────────────────────────────────────────────
const ActionBtn = ({ icon, label, onClick, active }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center gap-1.5 flex-1 rounded-xl py-3 px-2 active:scale-95 transition-all border
            ${active ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-bg-surface border-border-main/20 hover:bg-bg-hover text-accent'}`}
    >
        <span>{icon}</span>
        <span className={`text-[12px] font-medium ${active ? 'text-accent' : 'text-text-primary'}`}>{label}</span>
    </button>
);

// ─── Forward sheet ─────────────────────────────────────────────────────────
const ForwardSheet = ({ channel: _channel, onClose, onForward }) => {
    const storeContacts = useSelector(selectContacts);
    const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState('');
    const filtered = storeContacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    const toggle = (id) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

    return (
        <div className="fixed inset-0 z-[3000] flex items-end justify-center bg-black/60 animate-fade-in" onClick={onClose}>
            <div className="w-full max-w-[480px] max-h-[80vh] bg-bg-surface rounded-t-2xl flex flex-col shadow-2xl animate-slide-in-up mx-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border-main/10">
                    <p className="text-[17px] font-semibold text-text-primary">Forward channel</p>
                    <button onClick={onClose} className="p-1.5 hover:bg-bg-hover rounded-full text-text-secondary"><Icons.X size={20} /></button>
                </div>
                <div className="px-4 py-2 border-b border-border-main/10">
                    <div className="flex items-center gap-2 bg-bg-hover rounded-full px-4 py-2">
                        <Icons.Search size={15} className="text-text-secondary" />
                        <input autoFocus placeholder="Search contacts…" value={search} onChange={e => setSearch(e.target.value)}
                            className="flex-1 bg-transparent text-[14px] text-text-primary outline-none placeholder:text-text-secondary" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filtered.map(c => (
                        <div key={c.id} onClick={() => toggle(c.id)} className="flex items-center gap-4 px-4 py-3 hover:bg-bg-hover cursor-pointer">
                            <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-[14px] shrink-0" style={{ background: c.color }}>{c.initials}</div>
                            <p className="flex-1 text-[15px] text-text-primary">{c.name}</p>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selected.includes(c.id) ? 'bg-accent border-accent' : 'border-border-main/50'}`}>
                                {selected.includes(c.id) && <Icons.Check size={12} className="text-white" strokeWidth={3} />}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="px-4 py-4 border-t border-border-main/10">
                    <button disabled={selected.length === 0} onClick={() => onForward(selected)}
                        className={`w-full py-3 rounded-full font-semibold text-[15px] transition-all ${selected.length > 0 ? 'bg-accent text-white active:scale-[0.98]' : 'bg-bg-hover text-text-secondary cursor-not-allowed opacity-50'}`}>
                        Forward {selected.length > 0 ? `to ${selected.length}` : ''}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Share sheet ───────────────────────────────────────────────────────────
const ShareSheet = ({ channel, onClose }) => {
    const [copied, setCopied] = useState(false);
    const link = `https://whatsapp.com/channel/${channel.handle?.replace('@', '') || channel.id}`;
    const handleCopy = () => { navigator.clipboard.writeText(link).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    const handleNativeShare = () => { if (navigator.share) { navigator.share({ title: channel.name, text: `Follow ${channel.name} on WhatsApp Channels`, url: link }).catch(() => {}); onClose(); } else handleCopy(); };

    return (
        <div className="fixed inset-0 z-[3000] flex items-end justify-center bg-black/60 animate-fade-in" onClick={onClose}>
            <div className="w-full max-w-[480px] bg-bg-surface rounded-t-2xl shadow-2xl animate-slide-in-up mx-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 rounded-full bg-border-main/40" /></div>
                <div className="px-5 pt-3 pb-6">
                    <p className="text-[17px] font-semibold text-text-primary mb-1">Share channel</p>
                    <p className="text-[13px] text-text-secondary mb-4 truncate">{link}</p>
                    <div className="flex items-center gap-3 bg-bg-hover rounded-xl px-4 py-3 mb-4">
                        <Icons.Link size={18} className="text-accent shrink-0" />
                        <p className="flex-1 text-[13px] text-text-secondary truncate">{link}</p>
                        <button onClick={handleCopy} className={`text-[13px] font-semibold px-3 py-1.5 rounded-full transition-all ${copied ? 'bg-accent/10 text-accent' : 'text-accent hover:bg-accent/10'}`}>
                            {copied ? '✓ Copied' : 'Copy'}
                        </button>
                    </div>
                    <div className="grid grid-cols-4 gap-3 mb-4">
                        {[{ icon: <Icons.MessageSquare size={22} />, label: 'Message', action: handleNativeShare },
                          { icon: <Icons.Mail size={22} />, label: 'Email', action: handleNativeShare },
                          { icon: <Icons.Share2 size={22} />, label: 'More', action: handleNativeShare },
                          { icon: <Icons.Copy size={22} />, label: 'Copy link', action: handleCopy }]
                          .map(({ icon, label, action }) => (
                            <button key={label} onClick={action} className="flex flex-col items-center gap-1.5 hover:bg-bg-hover rounded-xl py-2 transition-all active:scale-95">
                                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">{icon}</div>
                                <span className="text-[11px] text-text-secondary">{label}</span>
                            </button>
                        ))}
                    </div>
                    <button onClick={onClose} className="w-full py-3 rounded-full border border-border-main/30 text-text-secondary text-[14px] font-medium hover:bg-bg-hover transition-all">Cancel</button>
                </div>
            </div>
        </div>
    );
};

// ─── Main component ─────────────────────────────────────────────────────────
const ChannelInfoScreen = ({ channel, onBack, onUnfollow }) => {
    const dispatch      = useDispatch();
    const channels      = useSelector(selectChannels);
    const storeContacts = useSelector(selectContacts);
    const isLoading = useFakeLoading(420);
    const [muted,            setMuted]           = useState(channel.isMuted ?? false);
    const [descExpanded,     setDescExpanded]     = useState(false);
    const [showAvatarViewer, setShowAvatarViewer] = useState(false);
    const [showSearch,       setShowSearch]       = useState(false);
    const [showForward,      setShowForward]      = useState(false);
    const [showShare,        setShowShare]        = useState(false);
    const [unfollowConfirm,  setUnfollowConfirm]  = useState(false);
    const [scrollY,          setScrollY]          = useState(0);
    const handleScroll = React.useCallback(e => setScrollY(e.target.scrollTop), []);

    const liveChannel = channels.find(c => c.id === channel.id) || channel;
    const isFollowed  = liveChannel.isFollowed;
    const posts       = liveChannel.posts || channel.posts || [];
    const desc        = channel.description || '';
    const shortDesc   = desc.length > 120 ? desc.slice(0, 120) : desc;

    const handleFollowToggle = () => {
        if (isFollowed) setUnfollowConfirm(true);
        else { dispatch(followChannel(channel.id)); dispatch(showToast(`Following ${channel.name}`, 'success')); }
    };
    const handleUnfollowConfirm = () => {
        dispatch(unfollowChannel(channel.id)); dispatch(showToast(`Unfollowed ${channel.name}`, 'info'));
        setUnfollowConfirm(false); onUnfollow?.(); onBack();
    };
    const handleForwardSend = (selectedIds) => {
        setShowForward(false);
        const names = storeContacts.filter(c => selectedIds.includes(c.id)).map(c => c.name);
        dispatch(showToast(`Forwarded to ${names.slice(0, 2).join(', ')}${names.length > 2 ? ` +${names.length - 2}` : ''}`, 'success'));
    };

    if (showSearch) return (
        <div className="absolute inset-0 bg-bg-surface z-[600] flex flex-col overflow-hidden">
            <ChannelSearchBar posts={posts} onClose={() => setShowSearch(false)} />
        </div>
    );

    if (isLoading) return <ChannelInfoSkeleton />;

    return (
        <div className="absolute inset-0 bg-bg-surface z-[600] flex flex-col overflow-hidden">

            <ChannelStickyBar channel={channel} liveChannel={liveChannel} scrollY={scrollY} onBack={onBack} />

            <div className="flex-1 overflow-y-auto custom-scrollbar" onScroll={handleScroll}>

                <ChannelHeader channel={channel} liveChannel={liveChannel} scrollY={scrollY}
                    onAvatarClick={() => setShowAvatarViewer(true)} />

                {/* Action buttons */}
                <div className="flex gap-2 px-4 mb-3">
                    <ActionBtn active={isFollowed} icon={isFollowed ? <Icons.Check size={20} /> : <Icons.Plus size={20} />}
                        label={isFollowed ? 'Following' : 'Follow'} onClick={handleFollowToggle} />
                    <ActionBtn icon={<Icons.Forward size={20} />} label="Forward" onClick={() => setShowForward(true)} />
                    <ActionBtn icon={<Icons.Share2 size={20} />}  label="Share"   onClick={() => setShowShare(true)} />
                    <ActionBtn icon={<Icons.Search size={20} />}  label="Search"  onClick={() => setShowSearch(true)} />
                </div>

                <div className="h-2 bg-bg-surface border-y border-border-main/20 mb-2" />

                <ChannelPostList posts={posts} isOwner={liveChannel.isOwner}
                    onPost={(text) => { dispatch(addChannelPost(channel.id, text)); dispatch(showToast('Posted to channel', 'success')); }} />

                {/* Description */}
                {desc.length > 0 && (
                    <div className="px-5 py-4 border-b border-border-main/20">
                        <p className="text-[14px] text-text-primary leading-[22px]">
                            {descExpanded ? desc : shortDesc}
                            {desc.length > 120 && !descExpanded && (
                                <button onClick={() => setDescExpanded(true)} className="text-accent ml-1 font-medium">Read more…</button>
                            )}
                        </p>
                        {channel.createdAt && <p className="text-[12px] text-text-secondary mt-2">Created on {channel.createdAt}</p>}
                    </div>
                )}

                <div className="h-2 bg-bg-surface border-y border-border-main/20" />

                {/* Mute toggle */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border-main/20">
                    <div className="flex items-center gap-4">
                        <Icons.Bell size={22} className="text-text-secondary" />
                        <span className="text-[15px] text-text-primary">Mute notifications</span>
                    </div>
                    <button onClick={() => setMuted(m => !m)} className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${muted ? 'bg-accent' : 'bg-border-main'}`}>
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${muted ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>

                {/* Public channel */}
                <div className="flex items-start gap-4 px-5 py-4 border-b border-border-main/20">
                    <Icons.Globe size={22} className="text-text-secondary shrink-0 mt-0.5" />
                    <div>
                        <p className="text-[15px] text-text-primary font-medium">Public channel</p>
                        <p className="text-[13px] text-text-secondary mt-0.5">Anyone can find this channel and see what's been shared.</p>
                    </div>
                </div>

                {/* Profile privacy */}
                <div className="flex items-start gap-4 px-5 py-4 border-b border-border-main/20">
                    <Icons.Settings2 size={22} className="text-text-secondary shrink-0 mt-0.5" />
                    <div>
                        <p className="text-[15px] text-text-primary font-medium">Profile privacy</p>
                        <p className="text-[13px] text-text-secondary mt-0.5">This channel has added privacy for your profile and phone number.</p>
                    </div>
                </div>

                <div className="h-2 bg-bg-surface border-y border-border-main/20 my-1" />

                <button onClick={() => setUnfollowConfirm(true)} className="flex items-center gap-4 w-full px-5 py-4 hover:bg-bg-hover transition border-b border-border-main/20">
                    <Icons.LogOut size={22} className="text-red-500" />
                    <span className="text-[15px] text-red-500 font-medium">Unfollow channel</span>
                </button>
                <button onClick={() => dispatch(showToast('Channel reported', 'info'))} className="flex items-center gap-4 w-full px-5 py-4 hover:bg-bg-hover transition">
                    <Icons.Flag size={22} className="text-red-500" />
                    <span className="text-[15px] text-red-500 font-medium">Report channel</span>
                </button>

                <div className="h-16" />
            </div>

            {/* Unfollow confirm */}
            {unfollowConfirm && (
                <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-6" onClick={() => setUnfollowConfirm(false)}>
                    <div className="bg-bg-surface rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-zoom-in" onClick={e => e.stopPropagation()}>
                        <div className="px-6 pt-6 pb-4">
                            <div className="flex justify-center mb-4">
                                <div className="w-14 h-14 rounded-full overflow-hidden" style={{ background: channel.avatarColor || '#00a884' }}>
                                    {channel.avatar
                                        ? <img src={channel.avatar} className="w-full h-full object-cover" />
                                        : <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">{channel.initials || channel.name?.slice(0, 2).toUpperCase()}</div>}
                                </div>
                            </div>
                            <h3 className="text-[17px] font-semibold text-text-primary text-center mb-1">Unfollow {channel.name}?</h3>
                            <p className="text-[13px] text-text-secondary text-center leading-relaxed">You'll stop receiving updates from this channel.</p>
                        </div>
                        <div className="h-px bg-border-main/20" />
                        <div className="flex flex-col">
                            <button onClick={handleUnfollowConfirm} className="w-full py-4 text-red-400 font-semibold text-[15px] hover:bg-red-500/10 transition border-b border-border-main/10">Unfollow</button>
                            <button onClick={() => setUnfollowConfirm(false)} className="w-full py-4 text-text-secondary text-[15px] hover:bg-bg-hover transition">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {showForward && <ForwardSheet channel={liveChannel} onClose={() => setShowForward(false)} onForward={handleForwardSend} />}
            {showShare    && <ShareSheet  channel={liveChannel} onClose={() => setShowShare(false)} />}

            <ImageViewer open={showAvatarViewer} onClose={() => setShowAvatarViewer(false)}
                src={channel.avatar || null} name={channel.name} color={channel.avatarColor}
                initials={channel.initials} shape="circle"
                subtitle={`Channel · ${(liveChannel.followerCount || channel.followerCount || 0).toLocaleString()} followers`} />
        </div>
    );
};

export default ChannelInfoScreen;
