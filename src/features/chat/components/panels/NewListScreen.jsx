/**
 * NewListScreen — Unified dedicated screen for creating a new list.
 * Replaces all popup/modal implementations.
 * Step 1: Name the list (matches WA reference image)
 * Step 2: Add members (chats + groups, dedicated screen)
 */
import React, { useState, useRef, useEffect } from 'react';
import EmptyState from '@shared/ui/display/EmptyState';
import { Icons } from '@constants/icons';

const NewListScreen = ({ isOpen, onClose, chats = [], lists = [], onCreateList }) => {
    const [step, setStep] = useState(1);
    const [listName, setListName] = useState('');
    const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setListName('');
            setSelected([]);
            setSearch('');
            setTimeout(() => inputRef.current?.focus(), 80);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        setStep(1);
        setListName('');
        setSelected([]);
        setSearch('');
        onClose();
    };

    const handleNext = () => {
        if (!listName.trim()) return;
        const isDuplicate = lists.some(l => l.name?.toLowerCase() === listName.trim().toLowerCase());
        if (isDuplicate) return;
        setStep(2);
    };

    const toggleSelect = (id) =>
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const handleSave = () => {
        if (!listName.trim()) return;
        onCreateList?.(listName.trim(), selected);
        handleClose();
    };

    const filteredChats = chats.filter(c =>
        !search || c.name?.toLowerCase().includes(search.toLowerCase())
    );

    /* ── STEP 1: Name ── */
    if (step === 1) {
        return (
            <div className="absolute inset-0 z-[300] flex flex-col bg-bg-surface animate-fade-in overflow-hidden" style={{ zIndex: 300 }}>
                {/* Drag handle (mobile) */}
                <div className="flex justify-center pt-2 pb-1 shrink-0">
                    <div className="w-10 h-1 rounded-full bg-border-main/40" />
                </div>

                {/* Header */}
                <header className="flex items-center px-4 h-[56px] shrink-0">
                    <button
                        onClick={handleClose}
                        className="p-2 -ml-2 hover:bg-bg-hover rounded-full text-text-primary transition-colors"
                    >
                        <Icons.X size={22} />
                    </button>
                    <h2 className="ml-3 text-[18px] font-semibold text-text-primary flex-1 text-center pr-8">
                        New list
                    </h2>
                </header>

                {/* Body */}
                <div className="flex-1 flex flex-col px-5 pt-6">
                    <label className="text-[13px] text-text-secondary mb-3 block">List name</label>

                    <div className="flex items-center gap-2 border-2 border-accent rounded-xl px-4 py-3">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Example: Work, Friends"
                            value={listName}
                            onChange={e => setListName(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleNext(); }}
                            className="flex-1 bg-transparent text-text-primary text-[16px] outline-none placeholder:text-text-secondary/50"
                        />
                        <button className="text-text-secondary hover:text-accent transition-colors">
                            <Icons.Smile size={22} />
                        </button>
                    </div>

                    <p className="mt-4 text-[13px] text-text-secondary leading-relaxed">
                        Any list you create becomes a filter at the top of your Chats tab.
                    </p>
                </div>

                {/* Bottom button */}
                <div className="px-5 pb-8 pt-4 shrink-0">
                    <button
                        disabled={!listName.trim()}
                        onClick={handleNext}
                        className={`w-full py-4 rounded-full text-[15px] font-semibold transition-all ${
                            listName.trim()
                                ? 'bg-bg-hover text-text-secondary hover:bg-bg-input'
                                : 'bg-bg-input text-text-secondary/40 cursor-not-allowed'
                        }`}
                        style={listName.trim() ? { color: 'var(--text-secondary)' } : {}}
                    >
                        Add people or groups
                    </button>
                </div>
            </div>
        );
    }

    /* ── STEP 2: Add Members ── */
    return (
        <div className="absolute inset-0 z-[300] flex flex-col bg-bg-surface animate-fade-in overflow-hidden" style={{ zIndex: 300 }}>
            {/* Header */}
            <header className="flex items-center px-4 h-[56px] shrink-0 border-b border-border-main/10">
                <button
                    onClick={() => setStep(1)}
                    className="p-2 -ml-2 hover:bg-bg-hover rounded-full text-text-primary transition-colors"
                >
                    <Icons.ArrowLeft size={22} />
                </button>
                <div className="flex-1 ml-3">
                    <h2 className="text-[17px] font-semibold text-text-primary leading-tight">{listName}</h2>
                    {selected.length > 0 && (
                        <p className="text-[12px] text-accent">{selected.length} selected</p>
                    )}
                </div>
                <button
                    onClick={handleSave}
                    className="px-4 py-1.5 text-accent text-[14px] font-semibold hover:bg-accent/10 rounded-full transition-colors"
                >
                    Save
                </button>
            </header>

            {/* Search */}
            <div className="px-4 py-3 shrink-0 border-b border-border-main/10">
                <div className="bg-bg-input rounded-full flex items-center px-4 py-2.5 gap-3">
                    <Icons.Search size={18} className="text-text-secondary shrink-0" />
                    <input
                        autoFocus
                        type="text"
                        placeholder="Search name or number"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="flex-1 bg-transparent text-[14px] text-text-primary outline-none placeholder:text-text-secondary"
                    />
                    {search && (
                        <button onClick={() => setSearch('')}>
                            <Icons.X size={16} className="text-text-secondary" />
                        </button>
                    )}
                </div>
            </div>

            {/* Selected chips */}
            {selected.length > 0 && (
                <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar shrink-0 border-b border-border-main/10">
                    {selected.map(id => {
                        const chat = chats.find(c => c.id === id);
                        if (!chat) return null;
                        return (
                            <button
                                key={id}
                                onClick={() => toggleSelect(id)}
                                className="flex flex-col items-center gap-1 shrink-0"
                            >
                                <div className="relative">
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-[16px] overflow-hidden"
                                        style={{ background: chat.avatarColor || '#128c7e' }}
                                    >
                                        {chat.avatar
                                            ? <img src={chat.avatar} className="w-full h-full object-cover" alt={chat.name} />
                                            : (chat.initials || chat.name?.slice(0, 2).toUpperCase() || '?')
                                        }
                                    </div>
                                    <div className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-text-secondary rounded-full flex items-center justify-center">
                                        <Icons.X size={11} className="text-white" strokeWidth={3} />
                                    </div>
                                </div>
                                <span className="text-[10px] text-text-secondary truncate max-w-[48px]">
                                    {chat.name?.split(' ')[0]}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredChats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 py-16">
                        <Icons.Users size={48} className="text-text-secondary opacity-30" />
                        <EmptyState title="No contacts found" />
                    </div>
                ) : (
                    filteredChats.map(chat => {
                        const isSelected = selected.includes(chat.id);
                        return (
                            <button
                                key={chat.id}
                                onClick={() => toggleSelect(chat.id)}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-hover transition-colors"
                            >
                                {/* Avatar */}
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-[16px] shrink-0 overflow-hidden"
                                    style={{ background: chat.avatarColor || '#128c7e' }}
                                >
                                    {chat.avatar
                                        ? <img src={chat.avatar} className="w-full h-full object-cover" alt={chat.name} />
                                        : (chat.initials || chat.name?.slice(0, 2).toUpperCase() || '?')
                                    }
                                </div>

                                {/* Name */}
                                <div className="flex-1 text-left min-w-0">
                                    <p className="text-[15px] font-medium text-text-primary truncate">{chat.name}</p>
                                    {chat.lastMessage && (
                                        <p className="text-[13px] text-text-secondary truncate">{typeof chat.lastMessage === 'string' ? chat.lastMessage : chat.lastMessage?.text || ''}</p>
                                    )}
                                </div>

                                {/* Checkbox */}
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                    isSelected ? 'bg-accent border-accent' : 'border-border-main/50'
                                }`}>
                                    {isSelected && <Icons.Check size={14} className="text-white" strokeWidth={3} />}
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default NewListScreen;
