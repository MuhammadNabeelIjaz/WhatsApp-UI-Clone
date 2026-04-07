import React, { useState } from 'react';
import { useFakeLoading } from '@shared/hooks';
import { Icons } from '@constants/icons';
import { KeptMessagesSkeleton } from '@shared/ui/display/Skeletons';

const KeptMessagesScreen = ({ chat: _chat, keptMessages = [], onBack, onGoToMessage }) => {
    const isLoading = useFakeLoading(380);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    const defaultMessages = keptMessages.length > 0 ? keptMessages : [
        {
            id: 'km1',
            sender: 'Amz - Admin 01* ( Italy Products ᵃᵘᶻ )',
            date: '11/03/2026',
            time: '2:38 pm',
            edited: true,
            keptBy: 'Amz - Admin 01* ( Italy Products ᵃᵘᶻ )',
            text: `You can see all the available products on this website👆👆. If anyone likes any product or needs more details, feel free to let me know.\nThank you! ❤️\n\n_______________\n\nPuedes ver todos los productos disponibles en este sitio web. Si te gusta algún producto o necesitas más información, no dudes en hacérmelo saber.\n¡Gracias! ❤️`,
            color: '#e67e22',
        },
    ];

    const filtered = searchQuery.trim()
        ? defaultMessages.filter(m =>
            m.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.sender.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : defaultMessages;

    if (isLoading) return <KeptMessagesSkeleton />;

    return (
        <div className="flex flex-col h-full w-full bg-bg-surface select-none">
            {/* Header */}
            <header className="px-3 py-3 flex items-center gap-3 shrink-0 bg-bg-surface border-b border-border-main/10">
                {!showSearch ? (
                    <>
                        <button onClick={onBack} className="p-2 rounded-full hover:bg-bg-hover active:scale-95 transition-all text-text-primary">
                            <Icons.ArrowLeft size={24} />
                        </button>
                        <h1 className="text-[18px] font-semibold text-text-primary flex-1">Kept messages</h1>
                        <button
                            onClick={() => setShowSearch(true)}
                            className="p-2 rounded-full hover:bg-bg-hover text-text-primary"
                        >
                            <Icons.Search size={22} />
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="p-2 rounded-full hover:bg-bg-hover text-text-primary">
                            <Icons.ArrowLeft size={24} />
                        </button>
                        <div className="flex-1 bg-bg-hover rounded-xl px-4 py-2">
                            <input
                                autoFocus
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search kept messages..."
                                className="w-full bg-transparent text-text-primary text-[15px] outline-none"
                            />
                        </div>
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="p-2 text-text-secondary">
                                <Icons.X size={20} />
                            </button>
                        )}
                    </>
                )}
            </header>

            {/* Info banner */}
            <div className="px-5 py-3 bg-bg-surface border-b border-border-main/10">
                <p className="text-[13px] text-text-secondary text-center leading-relaxed">
                    These messages are kept in the chat for everyone.{' '}
                    Everyone can keep or unkeep a message. Group admins can limit this.
                </p>
            </div>

            {/* Messages list */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 px-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-bg-hover flex items-center justify-center">
                            <Icons.Star size={28} className="text-text-secondary opacity-50" />
                        </div>
                        <p className="text-text-secondary text-[15px]">
                            {searchQuery ? 'No messages found' : 'No kept messages'}
                        </p>
                        {!searchQuery && (
                            <p className="text-text-secondary text-[13px] opacity-70">
                                Long press a message and select "Keep" to save it here.
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="py-3">
                        {filtered.map((msg) => (
                            <div key={msg.id} className="border-b border-border-main/10 last:border-0">
                                {/* Sender row */}
                                <div
                                    className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-bg-hover transition-colors"
                                    onClick={() => onGoToMessage?.(msg)}
                                >
                                    <div className="w-9 h-9 rounded-full bg-bg-hover flex items-center justify-center shrink-0 border border-border-main/20">
                                        <Icons.UserRound size={18} className="text-text-secondary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[13px] font-bold" style={{ color: msg.color || '#e67e22' }}>
                                            {msg.sender}
                                        </span>
                                        <span className="text-[12px] text-text-secondary ml-2">{msg.date}</span>
                                    </div>
                                    <Icons.ChevronRight size={18} className="text-text-secondary shrink-0" />
                                </div>

                                {/* Message bubble */}
                                <div className="mx-4 mb-3">
                                    <div className="bg-bg-surface rounded-2xl rounded-tl-none p-4 border border-border-main/10 relative">
                                        <p className="text-[14px] text-text-primary leading-relaxed whitespace-pre-line">
                                            {msg.text}
                                        </p>
                                        <div className="flex items-center justify-end gap-1 mt-2">
                                            {msg.edited && (
                                                <span className="text-[11px] text-text-secondary opacity-60">Edited</span>
                                            )}
                                            <span className="text-[11px] text-text-secondary opacity-60">{msg.time}</span>
                                            <Icons.CheckCheck size={14} className="text-accent opacity-70" />
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-text-secondary opacity-60 mt-1 px-1">
                                        Kept by {msg.keptBy || msg.sender}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default KeptMessagesScreen;
