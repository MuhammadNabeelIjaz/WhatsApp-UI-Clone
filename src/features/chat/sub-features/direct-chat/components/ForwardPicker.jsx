import React, { useState } from 'react';
import { useFakeLoading } from '@shared/hooks';
import { Icons } from '@constants/icons';
import SectionLabel from '@shared/ui/list/SectionLabel';
import { useSelector } from 'react-redux';
import { selectChats } from '@core/store/slices/chatSlice';
import { ForwardPickerSkeleton } from '@shared/ui/display/Skeletons';

/**
 * ForwardPicker — overlay for forwarding messages to contacts/status.
 * Extracted from ChatDetail to eliminate inline data + component coupling.
 *
 * @param {number}   count     - Number of messages being forwarded
 * @param {Function} onClose   - Close the picker without sending
 * @param {Function} onForward - (selectedContacts: array) called on send
 */
const ForwardPicker = ({ count, onClose, onForward }) => {
    const chats = useSelector(selectChats);
    const isLoading = useFakeLoading(350);
    const [selected, setSelected] = useState([]);
    const [search, setSearch]     = useState('');

    // Use real chats from store for forward targets (recent conversations)
    const recentChats = chats.slice(0, 20).filter(
        (c) => c.name?.toLowerCase().includes(search.toLowerCase())
    );

    const toggle = (id) =>
        setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

    const selectedContacts = recentChats.filter((c) => selected.includes(c.id));
    const isStatusSelected = selected.includes('status');

    if (isLoading) return <ForwardPickerSkeleton />;

    return (
        <div className="absolute inset-0 bg-bg-surface z-[2000] flex flex-col animate-fade-in">
            {/* Header */}
            <header className="px-4 py-4 flex items-center gap-3 bg-bg-surface shrink-0 border-b border-border-main/20">
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-bg-hover rounded-full text-text-secondary active:scale-90 transition-all"
                >
                    <Icons.ArrowLeft size={24} />
                </button>
                <div className="flex-1">
                    <p className="text-[17px] font-semibold text-text-primary">Forward to...</p>
                    <p className="text-[12px] text-text-secondary">
                        Forwarding {count} message{count > 1 ? 's' : ''}
                    </p>
                </div>
            </header>

            {/* Search */}
            <div className="px-4 py-2 shrink-0">
                <div className="flex items-center gap-2 bg-bg-input rounded-full px-4 py-2">
                    <Icons.Search size={16} className="text-text-secondary" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-transparent text-[14px] text-text-primary outline-none placeholder:text-text-secondary"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* My Status */}
                <SectionLabel label="My Status" />
                <div
                    className="flex items-center gap-4 px-4 py-3 hover:bg-bg-hover cursor-pointer"
                    onClick={() => toggle('status')}
                >
                    <div className="w-12 h-12 rounded-full bg-accent/20 border-2 border-accent/50 flex items-center justify-center">
                        <Icons.Camera size={20} className="text-accent" />
                    </div>
                    <p className="text-[15px] text-text-primary flex-1">My Status</p>
                    <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isStatusSelected ? 'bg-accent border-accent' : 'border-border-main/50'
                        }`}
                    >
                        {isStatusSelected && <Icons.Check size={12} className="text-white" strokeWidth={3} />}
                    </div>
                </div>

                <div className="h-[1px] bg-border-main/20 mx-4" />
                <SectionLabel label="Recent Chats" />

                {recentChats.map((c) => (
                    <div
                        key={c.id}
                        onClick={() => toggle(c.id)}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-bg-hover cursor-pointer"
                    >
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-[15px] shrink-0"
                            style={{ background: c.color || c.avatarColor || '#607d8b' }}
                        >
                            {c.avatar ? (
                                <img src={c.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                            ) : (
                                c.initials || c.name?.[0]
                            )}
                        </div>
                        <p className="text-[15px] text-text-primary flex-1 truncate">{c.name}</p>
                        <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                selected.includes(c.id) ? 'bg-accent border-accent' : 'border-border-main/50'
                            }`}
                        >
                            {selected.includes(c.id) && (
                                <Icons.Check size={12} className="text-white" strokeWidth={3} />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Forward FAB */}
            {selected.length > 0 && (
                <div className="p-4 bg-bg-surface border-t border-border-main/20 flex items-center gap-3">
                    <div className="flex-1 flex gap-1 flex-wrap">
                        {selectedContacts.slice(0, 3).map((c) => (
                            <span
                                key={c.id}
                                className="px-2 py-0.5 bg-accent/20 text-accent text-[12px] rounded-full"
                            >
                                {c.name.split(' ')[0]}
                            </span>
                        ))}
                        {selectedContacts.length > 3 && (
                            <span className="px-2 py-0.5 bg-bg-hover text-text-secondary text-[12px] rounded-full">
                                +{selectedContacts.length - 3}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => onForward(selectedContacts)}
                        className="w-14 h-14 rounded-full bg-accent shadow-2xl flex items-center justify-center text-white active:scale-90 transition-all"
                    >
                        <Icons.Forward size={22} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ForwardPicker;
