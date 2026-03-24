import React, { useState } from 'react';
import { useFakeLoading } from '@shared/hooks';
import { Icons } from '@constants/icons';
import { ChatItemSkeleton } from '@shared/ui/display/Skeletons';
import { useSelector } from 'react-redux';
import { selectContacts } from '@core/store/slices/contactSlice';

// Static special items (not real contacts)
const SPECIAL_ITEMS = [
    { id: 'status', name: 'My status', sub: 'My contacts', type: 'status', color: '#25D366' },
    { id: 'metaai', name: 'Meta AI', sub: 'Ask me anything', type: 'metaai', color: '#7B68EE' },
];

const AvatarIcon = ({ item, size = 12 }) => {
    const s = `w-${size} h-${size}`;
    if (item.avatar) {
        return (
            <div className={`${s} rounded-full overflow-hidden shrink-0`}>
                <img src={item.avatar} alt="" className="w-full h-full object-cover" />
            </div>
        );
    }
    if (item.iconType === 'speaker') {
        return (
            <div className={`${s} rounded-full flex items-center justify-center shrink-0`} style={{ backgroundColor: item.color || '#3498db' }}>
                <Icons.Volume2 size={size === 12 ? 22 : 18} className="text-white" />
            </div>
        );
    }
    if (item.type === 'group' || item.type === 'community') {
        return (
            <div className={`${s} rounded-full flex items-center justify-center shrink-0 bg-bg-surface border border-border-main/20`}>
                <Icons.Users size={size === 12 ? 22 : 18} className="text-text-secondary" />
            </div>
        );
    }
    return (
        <div className={`${s} rounded-full flex items-center justify-center shrink-0 font-bold text-white text-[14px]`} style={{ backgroundColor: item.color || '#00a884' }}>
            {(item.initials || item.name?.slice(0, 2) || '??').toUpperCase()}
        </div>
    );
};

const SendToScreen = ({ shareText, inviteLink: _inviteLink, onBack }) => {
    const storeContacts = useSelector(selectContacts);
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState(new Set());
    const [sent, setSent] = useState(false);
    const isLoading = useFakeLoading(300);

    const handleToggle = (id) => {
        setSelected(prev => {
            const s = new Set(prev);
            s.has(id) ? s.delete(id) : s.add(id);
            return s;
        });
    };

    const handleSend = () => {
        setSent(true);
        setTimeout(onBack, 1200);
    };

    const filtered = (items) =>
        query.trim()
            ? items.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
            : items;

    // Derive frequently/recent from store contacts (first 5 each)
    const frequentlyContacted = storeContacts.slice(0, 5);
    const recentChats = storeContacts.slice(5, 10);

    if (isLoading) return (
        <div className="flex flex-col h-full w-full bg-bg-surface select-none">
            <header className="px-3 py-3 flex items-center gap-3 shrink-0 bg-bg-surface border-b border-border-main/10 h-[56px]">
                <div className="skeleton-bone w-9 h-9 rounded-full" />
                <div className="skeleton-bone h-5 w-24 rounded flex-1" />
            </header>
            <div className="flex-1 overflow-hidden">
                {Array.from({ length: 10 }, (_, i) => <ChatItemSkeleton key={i} />)}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full w-full bg-bg-surface select-none">
            {/* Header */}
            <header className="px-3 py-3 flex items-center gap-3 shrink-0 bg-bg-surface border-b border-border-main/10">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-bg-hover active:scale-95 transition-all text-text-primary">
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="text-[18px] font-semibold text-text-primary flex-1">Send to···</h1>
                <button className="p-2 rounded-full hover:bg-bg-hover text-text-primary">
                    <Icons.UserPlus size={22} />
                </button>
                <button className="p-2 rounded-full hover:bg-bg-hover text-text-primary">
                    <Icons.Search size={22} />
                </button>
            </header>

            {/* Search */}
            <div className="px-4 py-2 border-b border-border-main/5">
                <div className="flex items-center gap-3 bg-bg-hover rounded-xl px-4 py-2">
                    <Icons.Search size={16} className="text-text-secondary opacity-50" />
                    <input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search..."
                        className="flex-1 bg-transparent text-text-primary text-[15px] outline-none"
                    />
                    {query && <button onClick={() => setQuery('')}><Icons.X size={16} className="text-text-secondary" /></button>}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Status + Meta AI */}
                {filtered(SPECIAL_ITEMS).map(item => (
                    <div
                        key={item.id}
                        onClick={() => handleToggle(item.id)}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-bg-hover cursor-pointer transition-colors"
                    >
                        <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: item.color + '20' }}>
                            {item.type === 'status'
                                ? <Icons.CircleDot size={22} style={{ color: item.color }} />
                                : <Icons.Sparkles size={22} style={{ color: item.color }} />
                            }
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[16px] text-text-primary font-medium">{item.name}</p>
                            <p className="text-[13px] text-text-secondary opacity-70 truncate">{item.sub}</p>
                        </div>
                        {selected.has(item.id) && (
                            <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center shrink-0">
                                <Icons.Check size={14} className="text-white" />
                            </div>
                        )}
                        {item.id === 'status' && (
                            <Icons.MoreVertical size={20} className="text-text-secondary" />
                        )}
                    </div>
                ))}

                {/* Frequently contacted */}
                {!query && (
                    <p className="px-5 pt-4 pb-1 text-[12px] font-semibold text-text-secondary uppercase tracking-wide">
                        Frequently contacted
                    </p>
                )}
                {filtered(frequentlyContacted).map(item => (
                    <div
                        key={item.id}
                        onClick={() => handleToggle(item.id)}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-bg-hover cursor-pointer transition-colors"
                    >
                        <AvatarIcon item={item} size={12} />
                        <div className="flex-1 min-w-0">
                            <p className="text-[16px] text-text-primary font-medium truncate">{item.name}</p>
                            {item.sub && <p className="text-[13px] text-text-secondary opacity-70 truncate">{item.sub}</p>}
                        </div>
                        {selected.has(item.id) && (
                            <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center shrink-0">
                                <Icons.Check size={14} className="text-white" />
                            </div>
                        )}
                    </div>
                ))}

                {/* Recent chats */}
                {!query && (
                    <p className="px-5 pt-4 pb-1 text-[12px] font-semibold text-text-secondary uppercase tracking-wide">
                        Recent chats
                    </p>
                )}
                {filtered(recentChats).map(item => (
                    <div
                        key={item.id}
                        onClick={() => handleToggle(item.id)}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-bg-hover cursor-pointer transition-colors"
                    >
                        <AvatarIcon item={item} size={12} />
                        <div className="flex-1 min-w-0">
                            <p className="text-[16px] text-text-primary font-medium truncate">{item.name}</p>
                            {item.sub && <p className="text-[13px] text-text-secondary opacity-70 truncate">{item.sub}</p>}
                        </div>
                        {selected.has(item.id) && (
                            <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center shrink-0">
                                <Icons.Check size={14} className="text-white" />
                            </div>
                        )}
                    </div>
                ))}

                <div className="h-24" />
            </div>

            {/* Send button (shows when something selected) */}
            {selected.size > 0 && (
                <div className="absolute bottom-6 right-5 z-50">
                    <button
                        onClick={handleSend}
                        className="w-14 h-14 rounded-full bg-accent shadow-xl flex items-center justify-center active:scale-90 transition-all"
                    >
                        {sent
                            ? <Icons.Check size={26} className="text-white" />
                            : <Icons.Send size={22} className="text-white ml-0.5" />
                        }
                    </button>
                </div>
            )}

            {/* Share text preview at bottom */}
            {shareText && (
                <div className="px-4 py-3 border-t border-border-main/10 bg-bg-surface">
                    <p className="text-[13px] text-text-secondary truncate">{shareText}</p>
                    <div className="flex gap-3 mt-2">
                        <button
                            onClick={() => { navigator.clipboard?.writeText(shareText); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-full border border-border-main/20 text-text-secondary text-[13px] hover:bg-bg-hover transition-colors"
                        >
                            <Icons.Copy size={14} /> COPY
                        </button>
                        <button
                            onClick={() => { if (navigator.share) navigator.share({ text: shareText }); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-full border border-border-main/20 text-text-secondary text-[13px] hover:bg-bg-hover transition-colors"
                        >
                            <Icons.Share2 size={14} /> QUICK SHARE
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SendToScreen;
