import React, { useState } from 'react';
import { Icons } from '@constants/icons';
import SectionLabel from '@shared/ui/list/SectionLabel';
import { NewBroadcastScreen } from '../../sub-features/broadcast';
import { useDispatch, useSelector } from 'react-redux';
import { selectContacts } from '@core/store/slices/contactSlice';
import { addBroadcastChatThunk } from '@core/store/slices/chatSlice';
import { showToast } from '@core/store/slices/uiSlice';

const BroadcastsView = ({ onBack, onChatSelect }) => {
    const [showNew, setShowNew] = useState(false);
    const [broadcasts, setBroadcasts] = useState([]);
    const [selectedBroadcast, setSelectedBroadcast] = useState(null);
    const dispatch = useDispatch();
    const contacts = useSelector(selectContacts);

    const stats = { sent: broadcasts.length, remaining: Math.max(0, 35 - broadcasts.length), total: 35, dateRange: "01 Jun - 30 Jun" };
    const progressPercentage = (stats.sent / stats.total) * 100;

    if (showNew) return (
        <NewBroadcastScreen
            onBack={() => setShowNew(false)}
            onCreate={(selectedIds, broadcastName) => {
                const members = selectedIds.map(id => contacts.find(c => c.id === id)).filter(Boolean);
                const name = broadcastName || `Broadcast (${members.length})`;
                const newBroadcast = { id: Date.now(), name, contacts: members, createdAt: new Date() };
                setBroadcasts(prev => [...prev, newBroadcast]);
                dispatch(addBroadcastChatThunk(selectedIds, name));
                dispatch(showToast(`"${name}" created with ${members.length} members`));
                setShowNew(false);
            }}
        />
    );

    // Info panel for a broadcast
    if (selectedBroadcast) {
        return (
            <div className="flex flex-col h-full w-full bg-bg-surface animate-fade-in">
                <header className="px-4 py-3 flex items-center gap-4 shrink-0 border-b border-border-main/10">
                    <button onClick={() => setSelectedBroadcast(null)} className="p-2 hover:bg-bg-hover rounded-full text-text-secondary active:scale-90 transition-all">
                        <Icons.ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-[18px] font-semibold text-text-primary">{selectedBroadcast.name}</h1>
                        <p className="text-[13px] text-text-secondary">{selectedBroadcast.contacts.length} members</p>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {/* Members section */}
                    <div className="px-4 pt-4 pb-2">
                        <SectionLabel label={`${selectedBroadcast.contacts.length} Members`} className="px-0 py-0 mb-3" />
                        {selectedBroadcast.contacts.map((c) => (
                            <div key={c.id} className="flex items-center gap-4 py-3 border-b border-border-main/10 last:border-0">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[13px] shrink-0" style={{ background: c.avatarColor || c.color || '#6b7280' }}>
                                    {c.initials || c.name?.slice(0, 2).toUpperCase()}
                                </div>
                                <span className="text-[15px] text-text-primary">{c.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full bg-bg-surface animate-fade-in overflow-hidden">
            <header className="px-4 py-3 flex items-center gap-4 shrink-0 bg-bg-surface z-10">
                <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full text-text-secondary active:scale-75 transition-all">
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="text-[20px] font-medium text-text-primary">Broadcasts</h1>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="px-4 py-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[15px] font-medium text-text-primary">This month</span>
                        <span className="text-[13px] text-text-secondary font-mono">{stats.dateRange}</span>
                    </div>
                    <div className="flex justify-between items-end mb-2">
                        <div className="flex flex-col">
                            <span className="text-[28px] font-bold text-text-primary leading-none">{stats.sent}</span>
                            <span className="text-[12px] text-text-secondary uppercase tracking-wider">Sent</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[28px] font-bold text-text-primary leading-none">{stats.remaining}</span>
                            <span className="text-[12px] text-text-secondary uppercase tracking-wider">Remaining</span>
                        </div>
                    </div>
                    <div className="w-full h-[6px] bg-bg-hover rounded-full overflow-hidden mb-4">
                        <div className="h-full bg-accent transition-all duration-1000 ease-out" style={{ width: `${progressPercentage || 2}%` }} />
                    </div>
                    <p className="text-text-secondary text-[14px]">Send up to 35 broadcasts per month. <span className="text-accent cursor-pointer hover:underline">Learn more</span></p>
                </div>

                <div className="h-[1px] bg-border-main/10 w-full" />

                {broadcasts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <Icons.Megaphone size={40} className="text-text-secondary opacity-30 mb-3" />
                        <p className="text-text-secondary text-[16px] font-medium opacity-60">No broadcasts</p>
                        <p className="text-text-secondary text-[13px] opacity-40 mt-1">Tap + to create one</p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <SectionLabel label="Your broadcasts" />
                        {broadcasts.map(b => (
                            <div
                                key={b.id}
                                onClick={() => { setSelectedBroadcast(b); onChatSelect&& onChatSelect(b); }}
                                className="flex items-center gap-4 px-4 py-3 hover:bg-bg-hover cursor-pointer transition-colors border-b border-border-main/10 last:border-0"
                            >
                                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                                    <Icons.Megaphone size={22} className="text-orange-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[15.5px] text-text-primary font-medium">{b.name}</p>
                                    <p className="text-[13px] text-text-secondary">{b.contacts.length} members</p>
                                </div>
                                <Icons.ChevronRight size={18} className="text-text-secondary opacity-40 shrink-0" />
                            </div>
                        ))}
                    </div>
                )}
                <div className="h-20" />
            </div>

            <div className="absolute bottom-6 right-6">
                <button
                    onClick={() => setShowNew(true)}
                    className="w-14 h-14 bg-accent text-[#0b141a] rounded-2xl flex items-center justify-center shadow-2xl hover:brightness-110 active:scale-90 transition-all"
                >
                    <Icons.Plus size={28} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
};

export default BroadcastsView;
