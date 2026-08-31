// src/features/status/components/ChannelSection.jsx
// Channel list: followed channels (chat-list rows) + discover channels (follow/hide pills).

import React from 'react';
import { Icons } from '@constants/icons';

const fmtFollowers = (n) => {
    if (!n) return '0';
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M followers`;
    if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K followers`;
    return `${n} followers`;
};

const ChannelSection = ({
    followedChannels,
    discoverChannels,
    onOpenChat,
    onOpenZoom,
    onSelectChannel,
    onFollowChannel,
    onHideChannel,
    onExplore,
}) => (
    <section className="mt-2">
        {/* Header row */}
        <div className="flex justify-between items-center px-4 pb-3 pt-2">
            <h2 className="text-[20px] font-bold text-text-primary">Channels</h2>
            <button
                onClick={onExplore}
                className="bg-bg-surface border border-border-main text-text-primary text-[14px] font-medium px-5 py-1.5 rounded-full hover:bg-bg-hover transition-colors"
            >
                Explore
            </button>
        </div>

        {/* Followed channels — chat-list style */}
        {followedChannels.length > 0 && (
            <div className="flex flex-col">
                {followedChannels.map(ch => {
                    const lastText = ch.lastPost?.text || ch.lastMessage || 'No recent updates';
                    const lastDate = ch.lastPost?.time
                        ? new Date(ch.lastPost.time).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')
                        : '';
                    return (
                        <div
                            key={ch.id}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-bg-hover transition cursor-pointer mx-2 rounded-xl my-0.5"
                            onClick={() => onOpenChat?.({
                                ...ch,
                                isChannel: true, isOwner: ch.isOwner || false,
                                lastMessage: lastText, time: lastDate,
                            })}
                        >
                            <div
                                className="w-12.5 h-12.5 rounded-full flex items-center justify-center text-[22px] font-bold text-white shrink-0 overflow-hidden shadow-sm cursor-pointer"
                                style={{ background: ch.avatarColor || '#00a884' }}
                                onClick={(e) => { e.stopPropagation(); onOpenZoom?.({ name: ch.name, avatar: ch.avatar || null, avatarColor: ch.avatarColor || '#00a884', initials: ch.initials || ch.name?.slice(0,2).toUpperCase() }); }}
                            >
                                {ch.avatar ? <img src={ch.avatar} alt={ch.name} className="w-full h-full object-cover" /> : (ch.icon || ch.initials || '📢')}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1 min-w-0">
                                        <span className="font-semibold text-[16px] text-text-primary truncate">{ch.name}</span>
                                        {ch.isVerified && <Icons.CheckCircle size={15} className="text-accent shrink-0" />}
                                    </div>
                                    <span className={`text-[12px] shrink-0 ${ch.unreadCount > 0 ? 'text-accent font-semibold' : 'text-text-secondary'}`}>
                                        {lastDate}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mt-0.5">
                                    <p className="text-[13px] text-text-secondary truncate flex-1 pr-2">{lastText}</p>
                                    {ch.unreadCount > 0 && (
                                        <span className="w-5 h-5 rounded-full bg-accent text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                                            {ch.unreadCount > 9 ? '9+' : ch.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}

        {/* Discover — "Find channels to follow" */}
        {discoverChannels.length > 0 && (
            <>
                <p className="px-4 pt-4 pb-2 text-[14px] text-text-secondary font-normal">
                    Find channels to follow
                </p>
                <div className="flex flex-col">
                    {discoverChannels.map(ch => (
                        <div key={ch.id} className="flex items-center gap-3 px-4 py-3 hover:bg-bg-hover transition mx-2 rounded-xl my-0.5">
                            <button
                                className="w-12.5 h-12.5 rounded-full flex items-center justify-center text-[22px] font-bold text-white shrink-0 overflow-hidden shadow-sm"
                                style={{ background: ch.avatarColor || '#555' }}
                                onClick={(e) => { e.stopPropagation(); onOpenZoom?.({ name: ch.name, avatar: ch.avatar || null, avatarColor: ch.avatarColor || '#555', initials: ch.initials || ch.name?.slice(0,2).toUpperCase() }); }}
                            >
                                {ch.avatar ? <img src={ch.avatar} alt={ch.name} className="w-full h-full object-cover" /> : (ch.icon || ch.initials || '📢')}
                            </button>

                            <button className="flex-1 min-w-0 text-left" onClick={() => onOpenChat?.({
                                ...ch,
                                isChannel: true, isOwner: false,
                                lastMessage: '', time: '',
                            })}>
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold text-[16px] text-text-primary truncate">{ch.name}</span>
                                    {ch.isVerified && <Icons.CheckCircle size={15} className="text-accent shrink-0" />}
                                </div>
                                <p className="text-[13px] text-text-secondary">{fmtFollowers(ch.followerCount)}</p>
                            </button>

                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => onFollowChannel(ch.id)}
                                    className="bg-accent/15 hover:bg-accent/25 text-accent text-[14px] font-semibold px-5 py-1.5 rounded-full transition active:scale-95"
                                >
                                    Follow
                                </button>
                                <button
                                    onClick={() => onHideChannel(ch.id)}
                                    className="text-text-secondary hover:text-text-primary transition active:scale-90 p-1"
                                    title="Hide"
                                >
                                    <Icons.X size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        )}

        {followedChannels.length === 0 && discoverChannels.length === 0 && (
            <p className="text-text-secondary text-[14px] text-center py-8">No channels found</p>
        )}
    </section>
);

export default ChannelSection;
