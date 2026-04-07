import React, { useState } from 'react';
import EmptyState from '@shared/ui/display/EmptyState';
import { useFakeLoading } from '@shared/hooks';
import { Icons } from '@constants/icons';
import { AddMembersSkeleton } from '@shared/ui/display/Skeletons';
import ContactRow from '@shared/ui/list/ContactRow';
import SelectionCheckCircle from '@shared/ui/list/SelectionCheckCircle';
const AddCommunityMembersScreen = ({ community: _community, contacts, existingMemberIds, onBack, onAdd }) => {
    const isLoading = useFakeLoading(360);
    const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState('');
    const inputRef = React.useRef(null);

    const available = contacts.filter(c => !existingMemberIds.includes(c.id));
    const filtered  = available.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.toLowerCase().includes(search.toLowerCase())
    );
    const selectedContacts = available.filter(c => selected.includes(c.id));

    const toggle = (id) => setSelected(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

    if (isLoading) return <AddMembersSkeleton />;

    return (
        <div className="absolute inset-0 bg-bg-surface z-[700] flex flex-col animate-fade-in">
            <header className="px-4 py-3 flex items-center gap-3 shrink-0 border-b border-border-main/20">
                <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full text-text-secondary active:scale-90 transition-all shrink-0">
                    <Icons.ArrowLeft size={24} />
                </button>
                <div
                    className="flex-1 bg-bg-input rounded-xl px-3 py-2 flex items-center gap-1.5 min-h-[44px] cursor-text overflow-hidden"
                    onClick={() => inputRef.current?.focus()}
                >
                    {selectedContacts.slice(0, 3).map(c => (
                        <div
                            key={c.id}
                            onClick={(e) => { e.stopPropagation(); toggle(c.id); }}
                            className="flex items-center gap-1 bg-accent/15 border border-accent/30 rounded-full pl-1 pr-1.5 py-0.5 cursor-pointer hover:bg-red-500/10 hover:border-red-500/30 transition-all group shrink-0"
                        >
                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                                style={{ background: c.avatarColor || c.color || '#6b7280' }}>
                                {c.initials || c.name?.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="text-[12px] text-text-primary max-w-[60px] truncate">{c.name?.split(' ')[0]}</span>
                            <Icons.X size={10} className="text-text-secondary group-hover:text-red-400 shrink-0" />
                        </div>
                    ))}
                    {selectedContacts.length > 3 && (
                        <div className="shrink-0 px-2 py-0.5 bg-accent/20 text-accent text-[12px] font-semibold rounded-full">
                            +{selectedContacts.length - 3}
                        </div>
                    )}
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={selected.length === 0 ? 'Add participants...' : ''}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="flex-1 min-w-[80px] bg-transparent text-[14px] text-text-primary outline-none placeholder:text-text-secondary"
                    />
                </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filtered.length > 0
                    ? filtered.map(c => (
                        <ContactRow
                            key={c.id}
                            name={c.name}
                            subtitle={c.about || c.status}
                            avatar={c.avatar}
                            initials={c.initials || c.name?.slice(0, 2).toUpperCase()}
                            color={c.avatarColor || c.color}
                            onClick={() => toggle(c.id)}
                            rightElement={<SelectionCheckCircle selected={selected.includes(c.id)} />}
                        />
                      ))
                    : (
                        <EmptyState icon={<Icons.Search size={40} />} title="No contacts found" />
                    )
                }
                <div className="h-20" />
            </div>

            {selected.length > 0 && (
                <div className="absolute bottom-8 right-5">
                    <button
                        onClick={() => onAdd(selected)}
                        className="w-14 h-14 rounded-full bg-accent flex items-center justify-center shadow-lg active:scale-90 transition-all hover:bg-accent/90"
                    >
                        <Icons.Check size={24} className="text-white" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddCommunityMembersScreen;
