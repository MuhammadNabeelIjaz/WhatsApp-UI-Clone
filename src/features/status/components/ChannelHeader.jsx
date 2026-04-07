// src/features/status/components/ChannelHeader.jsx
// Channel hero section: avatar, name, follower count (with collapse-on-scroll animation).

import React from 'react';
import { Icons } from '@constants/icons';

const fmt = (n) => {
    if (!n) return '0';
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
    return String(n);
};

/**
 * Sticky nav bar (collapses avatar + title into it on scroll).
 */
export const ChannelStickyBar = ({ channel, liveChannel, scrollY, onBack }) => {
    const headerOpacity = Math.min(1, Math.max(0, (scrollY - 60)  / 140));
    const titleOpacity  = Math.min(1, Math.max(0, (scrollY - 90)  / 110));

    return (
        <header
            className="px-2 pt-3 pb-1 flex items-center gap-2 shrink-0 z-10"
            style={{ background: scrollY > 30 ? 'var(--bg-surface)' : 'transparent', backdropFilter: scrollY > 30 ? 'blur(8px)' : 'none' }}
        >
            <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full text-text-primary transition shrink-0">
                <Icons.ArrowLeft size={24} />
            </button>
            <div
                className="flex items-center gap-2 flex-1 overflow-hidden"
                style={{ opacity: headerOpacity, transform: `translateX(${(1 - headerOpacity) * -10}px)`, transition: 'opacity 0.15s ease, transform 0.15s ease' }}
            >
                <div
                    className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-[12px] shrink-0"
                    style={{ background: channel.avatarColor || '#00a884' }}
                >
                    {channel.avatar
                        ? <img src={channel.avatar} alt="" className="w-full h-full object-cover" />
                        : (channel.initials || channel.name?.slice(0, 2).toUpperCase())}
                </div>
                <div className="min-w-0" style={{ opacity: titleOpacity }}>
                    <p className="text-text-primary font-semibold text-[15px] truncate">{channel.name}</p>
                    <p className="text-text-secondary text-[12px]">
                        {fmt(liveChannel.followerCount || channel.followerCount || channel.followers)} followers
                    </p>
                </div>
            </div>
        </header>
    );
};

/**
 * Large hero avatar + name block (fades / scales out on scroll).
 */
const ChannelHeader = ({ channel, liveChannel, scrollY, onAvatarClick }) => {
    const progress  = Math.min(1, scrollY / 200);
    const opacity   = Math.max(0, 1 - progress * 1.5);
    const scale     = 1 - progress * 0.06;
    const ptrEvents = progress > 0.85 ? 'none' : 'auto';

    return (
        <div
            className="flex flex-col items-center px-6 pt-4 pb-5"
            style={{ opacity, transform: `scale(${scale})`, transformOrigin: 'top center', transition: 'opacity 0.1s ease, transform 0.1s ease', pointerEvents: ptrEvents }}
        >
            <div
                className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl mb-4 overflow-hidden cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                style={{ background: channel.avatarColor || '#00a884' }}
                onClick={onAvatarClick}
            >
                {channel.avatar
                    ? <img src={channel.avatar} alt={channel.name} className="w-full h-full object-cover" />
                    : (channel.icon || channel.initials || channel.name?.slice(0, 2).toUpperCase() || '📢')}
            </div>
            <div className="flex items-center gap-2 mb-1">
                <h1 className="text-[22px] font-bold text-text-primary">{channel.name}</h1>
                {channel.isVerified && <span className="text-accent"><Icons.CheckCircle size={20} /></span>}
            </div>
            <p className="text-[14px] text-text-secondary">
                Channel &bull; {fmt(liveChannel.followerCount || channel.followerCount || channel.followers)} followers
            </p>
        </div>
    );
};

export default ChannelHeader;
