import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectContacts } from '@core/store/slices/contactSlice';
import EmptyState from '@shared/ui/display/EmptyState';
import { useFakeLoading } from '@shared/hooks';
import { Icons } from '@constants/icons';
import SectionLabel from '@shared/ui/list/SectionLabel';
import ContactRow from '@shared/ui/list/ContactRow';
import SelectionCheckCircle from '@shared/ui/list/SelectionCheckCircle';
import logger from '@core/utils/logger';
import { GroupListSkeleton } from '@shared/ui/display/Skeletons';

const FREQUENTLY_CONTACTED = [1, 2, 3, 4, 5, 6, 7, 8];

const NewGroupScreen = ({ onBack, onCallGroup }) => {
    const contacts = useSelector(selectContacts);
    const [selected, setSelected]     = useState([]);
    const [search, setSearch]         = useState('');
    const [step, setStep]             = useState('select');
    const [groupName, setGroupName]   = useState('');
    const [groupPhoto, setGroupPhoto] = useState(null); // base64 string or null
    const [nameError, setNameError]   = useState(false);
    const isLoading = useFakeLoading(340);
    const inputRef    = useRef(null);
    const nameRef     = useRef(null);
    const photoRef    = useRef(null);

    const toggle = (id) => {
        setSelected(prev => {
            const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
            logger.event('NewGroupScreen', 'toggle_contact', { id, selected: next.length });
            return next;
        });
    };

    const filtered           = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    const frequent           = filtered.filter(c => FREQUENTLY_CONTACTED.includes(c.id));
    const rest               = filtered.filter(c => !FREQUENTLY_CONTACTED.includes(c.id));
    const selectedContacts   = contacts.filter(c => selected.includes(c.id));

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => setGroupPhoto(ev.target.result);
        reader.readAsDataURL(file);
    };

    const handleCreate = () => {
        if (!groupName.trim()) {
            setNameError(true);
            nameRef.current?.focus();
            // Shake the field briefly
            setTimeout(() => setNameError(false), 1500);
            return;
        }
        logger.event('NewGroupScreen', 'create_group', { name: groupName, members: selectedContacts.length });
        onCallGroup?.(selectedContacts, groupName);
    };

    // ── Step 2: Name the group ────────────────────────────────────────────────
    if (step === 'name') {
        return (
            <div className="absolute inset-0 bg-bg-surface z-[1000] flex flex-col animate-fade-in">
                <header className="px-4 py-3 flex items-center gap-3 shrink-0 border-b border-border-main/20">
                    <button onClick={() => setStep('select')} className="p-2 hover:bg-bg-hover rounded-full text-text-secondary active:scale-90 transition-all">
                        <Icons.ArrowLeft size={24} />
                    </button>
                    <h2 className="text-[19px] font-semibold text-text-primary">New group</h2>
                </header>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {/* Group photo + name input */}
                    <div className="flex items-center gap-4 px-4 py-6 border-b border-border-main/10">
                        {/* Photo picker — click opens file input */}
                        <input
                            ref={photoRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoChange}
                        />
                        <div
                            onClick={() => photoRef.current?.click()}
                            className="w-14 h-14 rounded-full shrink-0 cursor-pointer overflow-hidden relative group hover:brightness-90 transition-all"
                            style={{ background: groupPhoto ? 'transparent' : 'var(--bg-input)' }}
                        >
                            {groupPhoto ? (
                                <>
                                    <img src={groupPhoto} alt="Group" className="w-full h-full object-cover" />
                                    {/* Edit overlay on hover */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                                        <Icons.Camera size={18} className="text-white" />
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Icons.Camera size={24} className="text-text-secondary" />
                                </div>
                            )}
                        </div>

                        {/* Name field */}
                        <div className="flex-1">
                            <div className={`flex items-end border-b pb-2 transition-colors ${nameError ? 'border-red-500' : 'border-border-main/30 focus-within:border-accent'}`}>
                                <input
                                    ref={nameRef}
                                    type="text"
                                    placeholder="Group name"
                                    value={groupName}
                                    onChange={e => { setGroupName(e.target.value); setNameError(false); }}
                                    maxLength={100}
                                    className="flex-1 bg-transparent text-[16px] text-text-primary outline-none placeholder:text-text-secondary"
                                    autoFocus
                                />
                                <span className="text-[12px] text-text-secondary shrink-0 ml-2">{groupName.length}/100</span>
                            </div>
                            {nameError && (
                                <p className="text-[12px] text-red-400 mt-1 animate-fade-in">
                                    Please enter a group name
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Participants */}
                    <div className="px-4 py-4">
                        <p className="text-[13px] text-text-secondary font-semibold uppercase tracking-wider mb-3">
                            Participants: {selectedContacts.length}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {selectedContacts.map(c => (
                                <div
                                    key={c.id}
                                    onClick={() => toggle(c.id)}
                                    className="flex items-center gap-2 bg-bg-surface rounded-full px-3 py-1.5 border border-border-main/20 cursor-pointer hover:border-red-400/40 hover:bg-red-500/5 transition-all group"
                                >
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold overflow-hidden shrink-0" style={{ background: c.color }}>
                                        {c.avatar
                                            ? <img src={c.avatar} alt="" className="w-full h-full object-cover" />
                                            : c.initials
                                        }
                                    </div>
                                    <span className="text-[13px] text-text-primary">{c.name.split(' ')[0]}</span>
                                    <Icons.X size={11} className="text-text-secondary/0 group-hover:text-red-400 transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Create FAB */}
                <div className="absolute bottom-8 right-5">
                    <button
                        onClick={handleCreate}
                        className="w-14 h-14 rounded-full bg-accent flex items-center justify-center shadow-lg active:scale-90 transition-all hover:bg-accent/90"
                    >
                        <Icons.Check size={24} className="text-white" />
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) return (
        <div className="absolute inset-0 bg-bg-surface z-[1000] flex flex-col animate-fade-in">
            <header className="px-4 py-3 flex items-center gap-3 shrink-0 border-b border-border-main/20 h-[59px]">
                <div className="skeleton-bone w-9 h-9 rounded-full" />
                <div className="skeleton-bone h-5 w-28 rounded" />
            </header>
            <div className="flex-1 overflow-hidden"><GroupListSkeleton count={8} /></div>
        </div>
    );

    // ── Step 1: Select contacts ───────────────────────────────────────────────
    return (
        <div className="absolute inset-0 bg-bg-surface z-[1000] flex flex-col animate-fade-in">
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
                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0 overflow-hidden" style={{ background: c.color }}>
                                {c.avatar
                                    ? <img src={c.avatar} alt="" className="w-full h-full object-cover" />
                                    : c.initials
                                }
                            </div>
                            <span className="text-[12px] text-text-primary max-w-[60px] truncate">{c.name.split(' ')[0]}</span>
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
                {frequent.length > 0 && (
                    <>
                        <SectionLabel label="Frequently contacted" />
                        {frequent.map(c => (
                            <ContactRow
                                key={c.id}
                                name={c.name}
                                subtitle={c.status}
                                avatar={c.avatar}
                                initials={c.initials}
                                color={c.color}
                                onClick={() => toggle(c.id)}
                                rightElement={<SelectionCheckCircle selected={selected.includes(c.id)} />}
                            />
                        ))}
                    </>
                )}
                {rest.length > 0 && (
                    <>
                        <SectionLabel label="Contacts on WhatsApp" />
                        {rest.map(c => (
                            <ContactRow
                                key={c.id}
                                name={c.name}
                                subtitle={c.status}
                                avatar={c.avatar}
                                initials={c.initials}
                                color={c.color}
                                onClick={() => toggle(c.id)}
                                rightElement={<SelectionCheckCircle selected={selected.includes(c.id)} />}
                            />
                        ))}
                    </>
                )}
                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <Icons.Search size={40} className="text-text-secondary opacity-40" />
                        <EmptyState title="No contacts found" />
                    </div>
                )}
                <div className="h-20" />
            </div>

            {selected.length > 0 && (
                <div className="absolute bottom-8 right-5">
                    <button
                        onClick={() => {
                            logger.event('NewGroupScreen', 'proceed_to_name', { count: selected.length });
                            setStep('name');
                        }}
                        className="w-14 h-14 rounded-full bg-accent flex items-center justify-center shadow-lg active:scale-90 transition-all hover:bg-accent/90"
                    >
                        <Icons.ArrowRight size={24} className="text-white" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default NewGroupScreen;
