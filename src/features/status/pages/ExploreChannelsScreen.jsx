import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFakeLoading } from '@shared/hooks';
import { Icons } from '@constants/icons';
import { selectChannels } from '@core/store/slices/channelSlice';
import { followChannel, unfollowChannel } from '@core/store/slices/channelSlice';
import { showToast } from '@core/store/slices/uiSlice';
import { ExploreChannelsSkeleton } from '@shared/ui/display/Skeletons';
import ProfilePictureOverlay from '@shared/ui/display/ProfilePictureOverlay';

const EXPLORE_CHANNELS = [
    { id: 'c1', name: 'WhatsApp', cat: 'Popular', followers: '500M+', icon: '💬' },
    { id: 'c2', name: 'Meta AI Updates', cat: 'Popular', followers: '50M+', icon: '🤖' },
    { id: 'c3', name: 'BBC News', cat: 'News', followers: '10M+', icon: '📰' },
    { id: 'c4', name: 'Reuters', cat: 'News', followers: '8M+', icon: '🗞️' },
    { id: 'c5', name: 'ESPN', cat: 'Sports', followers: '15M+', icon: '🏆' },
    { id: 'c6', name: 'NASA', cat: 'Most active', followers: '20M+', icon: '🚀' },
    { id: 'c7', name: 'National Geographic', cat: 'Most active', followers: '12M+', icon: '🌍' },
    { id: 'c8', name: 'Sky Sports', cat: 'Sports', followers: '5M+', icon: '⚽' },
];

const CATS = ['All', 'Most active', 'Popular', 'News', 'Sports'];

const ExploreChannelsScreen = ({ onBack, onChatOpen }) => {
    const dispatch = useDispatch();
    const channels = useSelector(selectChannels);
    const [activecat, setActivecat] = useState('All');
    const [search, setSearch] = useState('');
    const [zoomChannel, setZoomChannel] = useState(null);
    const isLoading = useFakeLoading(420);

    // Merge explore list with store — store channels take priority for follow state
    const isFollowed = (ch) => {
        // Check store first (for real channels), then local explore state
        const storeMatch = channels.find(c => c.name === ch.name);
        return storeMatch ? storeMatch.isFollowed : false;
    };

    const handleFollow = (ch) => {
        const storeMatch = channels.find(c => c.name === ch.name);
        if (storeMatch) {
            if (storeMatch.isFollowed) {
                dispatch(unfollowChannel(storeMatch.id));
                dispatch(showToast(`Unfollowed ${ch.name}`, 'info'));
            } else {
                dispatch(followChannel(storeMatch.id));
                dispatch(showToast(`Following ${ch.name}`, 'success'));
            }
        } else {
            dispatch(followChannel(ch.id));
            dispatch(showToast(`Following ${ch.name}`, 'success'));
        }
    };

    const filtered = EXPLORE_CHANNELS.filter(c =>
        (activecat === 'All' || c.cat === activecat) &&
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) return <ExploreChannelsSkeleton />;

    return (
        <div className="absolute inset-0 bg-bg-surface z-[1000] flex flex-col animate-fade-in">
            <header className="px-4 py-4 flex items-center gap-3 bg-bg-surface shrink-0 border-b border-border-main">
                <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full text-text-secondary active:scale-90 transition-all">
                    <Icons.ArrowLeft size={24} />
                </button>
                <div className="flex-1 flex items-center gap-2 bg-bg-input rounded-full px-4 py-2">
                    <Icons.Search size={16} className="text-text-secondary" />
                    <input
                        type="text"
                        placeholder="Search channels..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="flex-1 bg-transparent text-[14px] text-text-primary outline-none placeholder:text-text-secondary"
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className="text-text-secondary hover:text-text-primary">
                            <Icons.X size={14} />
                        </button>
                    )}
                </div>
            </header>

            {/* Category chips — reduced height scrollbar via scrollbar-thin */}
            <div
                className="flex gap-2 px-4 py-2.5 shrink-0 overflow-x-auto"
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'transparent transparent' }}
            >
                <style>{`
                    .cat-scroll::-webkit-scrollbar { height: 2px; }
                    .cat-scroll::-webkit-scrollbar-track { background: transparent; }
                    .cat-scroll::-webkit-scrollbar-thumb { background: transparent; border-radius: 2px; }
                    .cat-scroll:hover::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.3); }
                `}</style>
                {CATS.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActivecat(cat)}
                        className={`px-4 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all
                            ${activecat === cat ? 'bg-accent text-white' : 'bg-bg-input text-text-secondary border border-border-main/30'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-6">
                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Icons.SearchX size={36} className="text-text-secondary/30 mb-3" />
                        <p className="text-[14px] text-text-secondary">No channels found</p>
                    </div>
                )}
                {filtered.map(channel => {
                    const followed = isFollowed(channel);
                    return (
                        <div key={channel.id} className="flex items-center gap-3 py-3 border-b border-border-main/20">
                            <button
                                className="w-12 h-12 rounded-full bg-bg-input flex items-center justify-center text-2xl shrink-0 border border-border-main/20"
                                onClick={() => setZoomChannel({ name: channel.name, avatar: null, avatarColor: null, initials: channel.icon })}
                            >
                                {channel.icon}
                            </button>
                            <div
                                className="flex-1 min-w-0 cursor-pointer"
                                onClick={() => onChatOpen?.({ id: channel.id, name: channel.name, avatar: null, isChannel: true, lastMessage: `${channel.followers} followers`, time: '' })}
                            >
                                <p className="text-[15px] font-semibold text-text-primary truncate">{channel.name}</p>
                                <p className="text-[12px] text-text-secondary">{channel.followers} followers · {channel.cat}</p>
                            </div>
                            <button
                                onClick={() => handleFollow(channel)}
                                className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all active:scale-95
                                    ${followed
                                        ? 'bg-accent/10 text-accent border border-accent/30'
                                        : 'border border-border-main text-accent hover:bg-accent/5'}`}
                            >
                                {followed ? 'Following' : 'Follow'}
                            </button>
                        </div>
                    );
                })}
            </div>
            {zoomChannel && (
                <ProfilePictureOverlay
                    chat={zoomChannel}
                    onClose={() => setZoomChannel(null)}
                />
            )}
        </div>
    );
};

export default ExploreChannelsScreen;