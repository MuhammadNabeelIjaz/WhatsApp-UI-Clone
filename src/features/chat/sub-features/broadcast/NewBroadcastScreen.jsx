/**
 * NewBroadcastScreen
 * 2-step flow: (1) select contacts, (2) enter broadcast name.
 * onCreate(selectedIds, broadcastName) — passes both to parent.
 */
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectContacts } from '@core/store/slices/contactSlice';
import { useFakeLoading } from '@shared/hooks';
import SearchInput from '@shared/ui/inputs/SearchInput';
import { Icons } from '@constants/icons';
import SectionLabel from '@shared/ui/list/SectionLabel';
import { ContactListSkeleton } from '@shared/ui/display/Skeletons';

const STEPS = { SELECT: 'select', NAME: 'name' };

const NewBroadcastScreen = ({ onBack, onCreate }) => {
    const contacts = useSelector(selectContacts);
    const [step,     setStep]     = useState(STEPS.SELECT);
    const [selected, setSelected] = useState(new Set());
    const [search,   setSearch]   = useState('');
    const isLoading = useFakeLoading(330);
    const [broadcastName, setBroadcastName] = useState('');
    const nameInputRef = useRef(null);


    // Auto-focus name input when entering step
    useEffect(() => {
        if (step === STEPS.NAME) {
            setTimeout(() => nameInputRef.current?.focus(), 80);
        }
    }, [step]);

    const toggle = id => setSelected(prev => {
        const n = new Set(prev);
        if (n.size >= 256 && !n.has(id)) return prev;
        n.has(id) ? n.delete(id) : n.add(id);
        return n;
    });

    const filtered = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    const selectedContacts = contacts.filter(c => selected.has(c.id));

    const handleCreate = () => {
        const name = broadcastName.trim() || `Broadcast (${selected.size})`;
        onCreate?.([...selected], name);
    };

    if (isLoading) return (
        <div className="absolute inset-0 bg-bg-surface z-[1000] flex flex-col animate-fade-in">
            <header className="px-4 py-4 flex items-center gap-3 bg-bg-surface shrink-0 border-b border-border-main h-[64px]">
                <div className="skeleton-bone w-9 h-9 rounded-full" />
                <div className="flex-1 space-y-1.5">
                    <div className="skeleton-bone h-4 w-28 rounded" />
                    <div className="skeleton-bone h-3 w-20 rounded" />
                </div>
            </header>
            <div className="flex-1 overflow-hidden"><ContactListSkeleton count={8} /></div>
        </div>
    );

    // ── Step 2: Enter broadcast name ──────────────────────────────────────
    if (step === STEPS.NAME) {
        return (
            <div className="absolute inset-0 bg-bg-surface z-[1000] flex flex-col animate-fade-in">
                <header className="px-4 py-4 flex items-center gap-3 bg-bg-surface shrink-0 border-b border-border-main">
                    <button onClick={() => setStep(STEPS.SELECT)}
                        className="p-2 hover:bg-bg-hover rounded-full text-text-secondary active:scale-90 transition-all">
                        <Icons.ArrowLeft size={24} />
                    </button>
                    <div>
                        <p className="text-[17px] font-semibold text-text-primary">Name your broadcast</p>
                        <p className="text-[12px] text-text-secondary">{selected.size} recipient{selected.size !== 1 ? 's' : ''} selected</p>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {/* Selected recipients preview */}
                    <div className="px-4 pt-5 pb-3">
                        <p className="text-[13px] text-text-secondary font-medium mb-3 uppercase tracking-wide">Recipients</p>
                        <div className="flex flex-wrap gap-2">
                            {selectedContacts.map(c => (
                                <div key={c.id}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border-main/30 bg-bg-hover">
                                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                                        style={{ background: c.color }}>
                                        {c.initials}
                                    </div>
                                    <span className="text-[13px] text-text-primary">{c.name.split(' ')[0]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="h-[1px] bg-border-main/10 mx-4" />

                    {/* Name input */}
                    <div className="px-4 pt-6">
                        <p className="text-[13px] text-text-secondary font-medium mb-3 uppercase tracking-wide">Broadcast name</p>
                        <div className="flex items-center gap-3 border-b-2 pb-1 transition-colors"
                            style={{ borderColor: broadcastName ? 'var(--accent)' : 'var(--border-main)' }}>
                            <Icons.Megaphone size={20} className="text-text-secondary shrink-0" />
                            <input
                                ref={nameInputRef}
                                value={broadcastName}
                                onChange={e => setBroadcastName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                                placeholder={`Broadcast (${selected.size})`}
                                maxLength={64}
                                className="flex-1 bg-transparent text-[17px] text-text-primary placeholder:text-text-secondary/40 outline-none"
                            />
                            {broadcastName && (
                                <button onClick={() => setBroadcastName('')}
                                    className="text-text-secondary hover:text-text-primary transition-colors">
                                    <Icons.X size={16} />
                                </button>
                            )}
                        </div>
                        <p className="text-[11px] text-text-secondary/50 mt-2 text-right">{broadcastName.length}/64</p>
                        <p className="text-[13px] text-text-secondary/60 mt-3 leading-relaxed">
                            Give your broadcast a memorable name so you can find it easily later.
                            If left empty, it defaults to "Broadcast ({selected.size})".
                        </p>
                    </div>
                </div>

                <div className="px-4 pb-6 pt-3 border-t border-border-main/30">
                    <button
                        onClick={handleCreate}
                        className="w-full bg-accent hover:opacity-90 text-text-inverse py-[13px] rounded-full font-semibold text-[15px] shadow-md active:scale-[0.98] transition-all"
                    >
                        {broadcastName.trim()
                            ? `Create "${broadcastName.trim()}"`
                            : `Create Broadcast (${selected.size})`}
                    </button>
                </div>
            </div>
        );
    }

    // ── Step 1: Select contacts ───────────────────────────────────────────
    return (
        <div className="absolute inset-0 bg-bg-surface z-[1000] flex flex-col animate-fade-in">
            <header className="px-4 py-4 flex items-center gap-3 bg-bg-surface shrink-0 border-b border-border-main">
                <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full text-text-secondary active:scale-90 transition-all">
                    <Icons.ArrowLeft size={24} />
                </button>
                <div>
                    <p className="text-[17px] font-semibold text-text-primary">New broadcast</p>
                    <p className="text-[12px] text-text-secondary">{selected.size} of 256 selected</p>
                </div>
                <div className="flex-1" />
                <button className="p-2 hover:bg-bg-hover rounded-full text-text-secondary">
                    <Icons.Search size={22} />
                </button>
            </header>

            <p className="px-4 py-3 text-[13px] text-text-secondary border-b border-border-main/20 shrink-0">
                Only contacts who have you in their address book will receive your broadcast messages.
            </p>

            <div className="px-4 py-2 shrink-0">
                <SearchInput value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts" />
            </div>

            <SectionLabel label="Contacts on WhatsApp" className="shrink-0" />

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filtered.map(contact => (
                    <div
                        key={contact.id}
                        onClick={() => toggle(contact.id)}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-bg-hover cursor-pointer active:bg-bg-hover/80"
                    >
                        <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-[15px]"
                            style={{ background: contact.color }}>
                            {contact.initials}
                        </div>
                        <div className="flex-1 border-b border-border-main/20 pb-3">
                            <p className="text-[16px] text-text-primary font-medium">{contact.name}</p>
                            {contact.status && <p className="text-[13px] text-text-secondary truncate">{contact.status}</p>}
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                            ${selected.has(contact.id) ? 'bg-accent border-accent' : 'border-border-main'}`}>
                            {selected.has(contact.id) && <Icons.Check size={12} className="text-white" strokeWidth={3} />}
                        </div>
                    </div>
                ))}
            </div>

            {selected.size > 0 && (
                <div className="px-4 pb-6 pt-3 border-t border-border-main/30">
                    <button
                        onClick={() => setStep(STEPS.NAME)}
                        className="w-full bg-accent hover:opacity-90 text-text-inverse py-[13px] rounded-full font-semibold text-[15px] shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <span>Next</span>
                        <Icons.ArrowRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default NewBroadcastScreen;
