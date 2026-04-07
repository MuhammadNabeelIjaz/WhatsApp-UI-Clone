import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectContacts } from '@core/store/slices/contactSlice';
import { useFakeLoading } from '@shared/hooks';
import SearchInput from '@shared/ui/inputs/SearchInput';
import { Icons } from '@constants/icons';
import SectionLabel from '@shared/ui/list/SectionLabel';
import NewGroupScreen from './NewGroupScreen';
import { ContactListSkeleton } from '@shared/ui/display/Skeletons';

/**
 * SelectContactScreen
 * mode: 'default' | 'forward'
 * - 'forward': shows radio circles, "Forward to..." title, My Status + Meta AI + Recent Chats sections
 * - 'default': original select contact for calling/messaging
 */
const SelectContactScreen = ({ onBack, onSelect, mode = 'default' }) => {
    const contacts = useSelector(selectContacts);
    const [search, setSearch] = useState('');
    const [showNewGroup, setShowNewGroup] = useState(false);
    const [expandedContact, setExpandedContact] = useState(null);
    const [selected, setSelected] = useState([]);
    const isLoading = useFakeLoading(360);

    const isForwardMode = mode === 'forward';

    const normalizedSearch = search.toLowerCase();
    const filtered = contacts.filter(c =>
        c.name.toLowerCase().includes(normalizedSearch) ||
        c.phone?.toLowerCase().includes(normalizedSearch)
    );

    const toggleSelect = (id) => {
        setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
    };

    if (showNewGroup) {
        return (
            <NewGroupScreen
                onBack={() => setShowNewGroup(false)}
                onCallGroup={(contacts, name) => {
                    onSelect({ name: name || contacts.map(c => c.name.split(' ')[0]).join(', '), type: 'audio' });
                }}
            />
        );
    }

    if (isLoading) return (
        <div className="absolute inset-0 bg-bg-surface z-[1000] flex flex-col animate-fade-in">
            <header className="px-4 py-4 flex items-center gap-3 bg-bg-surface shrink-0 border-b border-border-main h-[64px]">
                <div className="skeleton-bone w-9 h-9 rounded-full" />
                <div className="skeleton-bone h-5 w-32 rounded" />
            </header>
            <div className="flex-1 overflow-hidden">
                <ContactListSkeleton count={9} />
            </div>
        </div>
    );

    return (
        <div className="absolute inset-0 bg-bg-surface z-[1000] flex flex-col animate-fade-in">
            <header className="px-4 py-4 flex items-center gap-3 bg-bg-surface shrink-0 border-b border-border-main">
                <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full text-text-secondary active:scale-90 transition-all">
                    <Icons.ArrowLeft size={24} />
                </button>
                <div className="flex-1">
                    <p className="text-[17px] font-semibold text-text-primary">
                        {isForwardMode ? 'Forward to...' : 'Select contact'}
                    </p>
                    <p className="text-[12px] text-text-secondary">
                        {isForwardMode
                            ? (selected.length > 0 ? `${selected.length} selected` : 'Choose contacts')
                            : `${contacts.length} contacts`}
                    </p>
                </div>
                <button className="p-2 hover:bg-bg-hover rounded-full text-text-secondary">
                    <Icons.Search size={22} />
                </button>
            </header>

            {/* Search bar */}
            <div className="px-4 py-2 shrink-0">
                <SearchInput value={search} onChange={e => setSearch(e.target.value)} onClear={() => setSearch("")} placeholder="Search name or number..." />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Forward mode: My Status + Meta AI sections */}
                {isForwardMode && !search && (
                    <>
                        <SectionLabel label="My Status" />
                        <div
                            onClick={() => toggleSelect('my-status')}
                            className="flex items-center gap-4 px-4 py-3 hover:bg-bg-hover cursor-pointer active:bg-bg-hover/80 transition-colors border-b border-border-main/20"
                        >
                            <div className="w-12 h-12 rounded-full bg-accent/20 border-2 border-accent/40 flex items-center justify-center shrink-0">
                                <Icons.Camera size={20} className="text-accent" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[16px] text-text-primary font-medium">My Status</p>
                                <p className="text-[13px] text-text-secondary">Share as status update</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all mr-1 ${selected.includes('my-status') ? 'bg-accent border-accent' : 'border-border-main/50'}`}>
                                {selected.includes('my-status') && <Icons.Check size={12} className="text-white" strokeWidth={3} />}
                            </div>
                        </div>

                        <div className="h-[1px] bg-border-main/20 mx-4 my-1" />
                        <SectionLabel label="Frequently Contacted" />
                        {contacts.slice(0, 3).map(contact => (
                            <div
                                key={`freq-${contact.id}`}
                                onClick={() => toggleSelect(`freq-${contact.id}`)}
                                className="flex items-center gap-4 px-4 py-3 hover:bg-bg-hover cursor-pointer active:bg-bg-hover/80 transition-colors border-b border-border-main/20"
                            >
                                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 flex items-center justify-center" style={{ background: contact.color || '#666' }}>
                                    {contact.avatar
                                        ? <img src={contact.avatar} alt="" className="w-full h-full object-cover" />
                                        : <span className="text-white font-bold text-[16px]">{contact.initials || contact.name.slice(0, 2).toUpperCase()}</span>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[16px] text-text-primary font-medium">{contact.name}</p>
                                    <p className="text-[13px] text-text-secondary truncate">{contact.status}</p>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all mr-1 ${selected.includes(`freq-${contact.id}`) ? 'bg-accent border-accent' : 'border-border-main/50'}`}>
                                    {selected.includes(`freq-${contact.id}`) && <Icons.Check size={12} className="text-white" strokeWidth={3} />}
                                </div>
                            </div>
                        ))}

                        <div className="h-[1px] bg-border-main/20 mx-4 my-1" />
                        <SectionLabel label="Recent Chats" />
                    </>
                )}

                {/* Default mode: Quick actions */}
                {!isForwardMode && !search && (
                    <>
                        <div
                            onClick={() => setShowNewGroup(true)}
                            className="flex items-center gap-4 px-4 py-3 hover:bg-bg-hover cursor-pointer active:bg-bg-hover/80 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                                <Icons.Users size={22} className="text-white" />
                            </div>
                            <span className="text-[16px] text-text-primary font-medium">New group</span>
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 hover:bg-bg-hover cursor-pointer" onClick={() => onSelect?.({ __action: 'new-contact' })}>
                            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                                <Icons.UserPlus size={22} className="text-white" />
                            </div>
                            <span className="text-[16px] text-text-primary font-medium">New contact</span>
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 hover:bg-bg-hover cursor-pointer border-b border-border-main/20" onClick={() => onSelect?.({ __action: 'new-community' })}>
                            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                                <Icons.Users2 size={22} className="text-white" />
                            </div>
                            <span className="text-[16px] text-text-primary font-medium">New community</span>
                        </div>
                    </>
                )}

                {!isForwardMode && (
                    <SectionLabel label="Contacts on WhatsApp" />
                )}

                {filtered.map(contact => (
                    <div key={contact.id}>
                        {/* Contact row */}
                        <div
                            onClick={() => isForwardMode ? toggleSelect(contact.id) : setExpandedContact(expandedContact === contact.id ? null : contact.id)}
                            className="flex items-center gap-4 px-4 py-3 hover:bg-bg-hover cursor-pointer active:bg-bg-hover/80 transition-colors border-b border-border-main/20"
                        >
                            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 flex items-center justify-center"
                                style={{ background: contact.color || '#666' }}>
                                {contact.avatar
                                    ? <img src={contact.avatar || `https://ui-avatars.com/api/?name=${contact.name}&background=random`} alt="" className="w-full h-full object-cover" />
                                    : <span className="text-white font-bold text-[16px]">{contact.initials || contact.name.slice(0, 2).toUpperCase()}</span>
                                }
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[16px] text-text-primary font-medium">{contact.name}</p>
                                <p className="text-[13px] text-text-secondary truncate">{contact.status}</p>
                            </div>

                            {/* Forward mode: radio circles */}
                            {isForwardMode && (
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all mr-1 ${selected.includes(contact.id) ? 'bg-accent border-accent' : 'border-border-main/50'}`}>
                                    {selected.includes(contact.id) && <Icons.Check size={12} className="text-white" strokeWidth={3} />}
                                </div>
                            )}
                        </div>

                        {/* Default mode: Expanded action buttons (msg / audio / video) */}
                        {!isForwardMode && expandedContact === contact.id && (
                            <div className="flex justify-end gap-3 px-5 py-2 bg-bg-hover/50 border-b border-border-main/10 animate-fade-in">
                                <button
                                    onClick={() => onSelect?.({ ...contact, type: 'message' })}
                                    className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-bg-surface border border-border-main/20 hover:bg-bg-hover active:scale-90 transition-all"
                                >
                                    <Icons.MessageSquare size={18} className="text-accent" />
                                    <span className="text-[11px] text-text-secondary">Message</span>
                                </button>
                                <button
                                    onClick={() => onSelect?.({ ...contact, type: 'audio' })}
                                    className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-bg-surface border border-border-main/20 hover:bg-bg-hover active:scale-90 transition-all"
                                >
                                    <Icons.Phone size={18} className="text-accent" />
                                    <span className="text-[11px] text-text-secondary">Audio</span>
                                </button>
                                <button
                                    onClick={() => onSelect?.({ ...contact, type: 'video' })}
                                    className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-bg-surface border border-border-main/20 hover:bg-bg-hover active:scale-90 transition-all"
                                >
                                    <Icons.Video size={18} className="text-accent" />
                                    <span className="text-[11px] text-text-secondary">Video</span>
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Forward mode: Forward FAB when contacts selected */}
            {isForwardMode && selected.length > 0 && (
                <div className="p-4 bg-bg-surface border-t border-border-main/20 flex items-center gap-3">
                    <div className="flex-1 flex gap-1 flex-wrap">
                        {selected.slice(0, 4).map(id => {
                            const c = contacts.find(x => x.id === id);
                            if (!c) return null;
                            return (
                                <span key={id} className="px-2 py-0.5 bg-accent/20 text-accent text-[12px] rounded-full">
                                    {c.name.split(' ')[0]}
                                </span>
                            );
                        })}
                        {selected.length > 4 && (
                            <span className="px-2 py-0.5 bg-bg-hover text-text-secondary text-[12px] rounded-full">+{selected.length - 4}</span>
                        )}
                    </div>
                    <button
                        onClick={() => {
                            const contacts = selected.map(id => contacts.find(c => c.id === id)).filter(Boolean);
                            onSelect?.(contacts);
                        }}
                        className="w-14 h-14 rounded-full bg-accent shadow-2xl flex items-center justify-center text-white active:scale-90 transition-all"
                    >
                        <Icons.Forward size={22} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default SelectContactScreen;
