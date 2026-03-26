import React, { useState } from 'react';
import { useFakeLoading } from '@shared/hooks';
import { Icons } from '@constants/icons';
import { StarredMessagesSkeleton } from '@shared/ui/display/Skeletons';

const StarredMessages = ({ onBack, starredMessages = [], onOpenChat }) => {
    const isLoading = useFakeLoading(380);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMessages = searchQuery.trim()
        ? starredMessages.filter(m =>
            m.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.chatName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.senderName?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : starredMessages;

    const isEmpty = starredMessages.length === 0;

    if (isLoading) return <StarredMessagesSkeleton />;

    return (
        <div className="flex flex-col h-full w-full bg-bg-surface animate-fade-in overflow-hidden">
            {/* --- Header --- */}
            <header className="px-4 py-3 flex items-center gap-4 shrink-0 z-10 bg-bg-surface border-b border-border-main/10">
                {showSearch ? (
                    <>
                        <button
                            onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                            className="p-2 hover:bg-bg-hover rounded-full text-text-secondary active:scale-75 transition-all shrink-0"
                        >
                            <Icons.ArrowLeft size={24} />
                        </button>
                        <input
                            autoFocus
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search starred messages…"
                            className="flex-1 bg-transparent text-text-primary text-[16px] outline-none placeholder:text-text-secondary/50"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="p-1 text-text-secondary hover:text-text-primary"
                            >
                                <Icons.X size={18} />
                            </button>
                        )}
                    </>
                ) : (
                    <>
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-bg-hover rounded-full text-text-secondary active:scale-75 transition-all"
                        >
                            <Icons.ArrowLeft size={24} />
                        </button>
                        <h1 className="text-[20px] font-medium text-text-primary flex-1">Starred</h1>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setShowSearch(true)}
                                className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-full transition-colors"
                                title="Search"
                            >
                                <Icons.Search size={22} />
                            </button>
                        </div>
                    </>
                )}
            </header>

            {/* --- Main Content Area --- */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-bg-surface">
                {isEmpty ? (
                    /* --- Empty State --- */
                    <div className="h-full flex flex-col items-center justify-center px-10 text-center animate-fade-in">
                        <div className="w-32 h-32 bg-accent rounded-full flex items-center justify-center mb-10 shadow-2xl">
                            <Icons.Star size={60} className="text-[#0b141a]" fill="currentColor" />
                        </div>
                        <p className="text-text-secondary text-[16px] leading-relaxed max-w-[280px]">
                            Tap and hold on any message or channel update to star it, so you can easily find it later.
                        </p>
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center px-10 text-center">
                        <Icons.Search size={40} className="text-text-secondary/30 mb-4" />
                        <p className="text-text-secondary text-[15px]">No results for "{searchQuery}"</p>
                    </div>
                ) : (
                    /* --- Starred List --- */
                    <div className="flex flex-col gap-1 py-2">
                        {filteredMessages.map((msg) => (
                            <div
                                key={msg.id}
                                className="hover:bg-bg-hover/40 transition-colors cursor-pointer group"
                                onClick={() => onOpenChat?.(msg.chatId, msg.messageId)}
                            >
                                <div className="px-4 py-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-full bg-border-main/20 overflow-hidden flex items-center justify-center text-text-secondary shrink-0">
                                            {msg.chatAvatar ? (
                                                <img src={msg.chatAvatar} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="font-semibold text-[13px]">{msg.chatName?.slice(0, 2)}</span>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[15px] font-medium text-text-primary truncate flex items-center gap-2">
                                                {msg.chatName}
                                                <span className="text-[11px] text-text-secondary bg-bg-hover px-2 py-0.5 rounded-full shrink-0">{msg.messageType}</span>
                                            </p>
                                            <p className="text-[13px] text-text-secondary truncate">{msg.text}</p>
                                            <p className="text-[11px] text-text-secondary/60 mt-0.5">{msg.senderName}</p>
                                        </div>
                                    </div>
                                    <span className="text-[12px] text-text-secondary shrink-0 ml-3">{msg.time}</span>
                                </div>
                                <div className="h-[1px] w-full bg-border-main/10" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StarredMessages;
