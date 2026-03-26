/**
 * AddToListModal — "Choose list" bottom sheet (mobile) / slide-in panel (desktop).
 * Matches WA reference: search bar, "Choose list" title, "+ New list", list items, Done button.
 */
import React, { useState } from 'react';
import { Icons } from '@constants/icons';

const AddToListModal = ({ chat: _chat, lists = [], onClose, onToast, isDesktop, onNewList }) => {
    const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState('');

    const editableLists = lists.filter(l => l.id !== 'all');
    const filtered = search
        ? editableLists.filter(l => (l.label || l.name || '').toLowerCase().includes(search.toLowerCase()))
        : editableLists;

    const toggle = (id) =>
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const handleDone = () => {
        if (selected.length > 0) {
            onToast?.(`Added to ${selected.length} list${selected.length > 1 ? 's' : ''}`);
        }
        onClose();
    };

    const getIcon = (list) => {
        if (list.id === 'favorites') return <Icons.Heart size={22} className="text-text-secondary" />;
        return <Icons.User size={22} className="text-text-secondary" />;
    };

    /* ── Shared inner content ── */
    const Content = (
        <div className="flex flex-col h-full bg-bg-surface">
            {/* Drag handle — mobile only */}
            {!isDesktop && (
                <div className="flex justify-center pt-2 pb-1 shrink-0">
                    <div className="w-10 h-1 rounded-full bg-border-main/40" />
                </div>
            )}

            {/* Search bar */}
            <div className="px-4 pt-3 pb-2 shrink-0">
                <div className="bg-bg-input rounded-full flex items-center px-4 py-2.5 gap-2">
                    <Icons.Search size={16} className="text-text-secondary shrink-0" />
                    <input
                        type="text"
                        placeholder="Ask Meta AI or Search"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="flex-1 bg-transparent text-[14px] text-text-primary outline-none placeholder:text-text-secondary/60"
                    />
                    {search && (
                        <button onClick={() => setSearch('')}>
                            <Icons.X size={14} className="text-text-secondary" />
                        </button>
                    )}
                </div>
            </div>

            {/* Title */}
            <h2 className="text-[22px] font-bold text-text-primary text-center py-4 shrink-0">
                Choose list
            </h2>

            {/* New list */}
            <button
                onClick={onNewList}
                className="flex items-center gap-4 px-5 py-4 hover:bg-bg-hover transition-colors w-full shrink-0"
            >
                <div className="w-10 h-10 flex items-center justify-center">
                    <Icons.Plus size={24} className="text-accent" />
                </div>
                <span className="text-[16px] font-medium text-accent">New list</span>
            </button>

            {/* List items */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filtered.length === 0 ? (
                    <p className="px-5 py-6 text-[14px] text-text-secondary text-center">
                        {search ? 'No lists match your search.' : 'No lists yet. Create one first.'}
                    </p>
                ) : filtered.map(list => {
                    const isChecked = selected.includes(list.id);
                    return (
                        <button
                            key={list.id}
                            onClick={() => toggle(list.id)}
                            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-bg-hover transition-colors"
                        >
                            <div className="w-10 h-10 flex items-center justify-center shrink-0">
                                {getIcon(list)}
                            </div>
                            <span className="flex-1 text-[16px] text-text-primary text-left">
                                {list.label || list.name}
                            </span>
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shrink-0 ${
                                isChecked ? 'bg-accent' : 'border-2 border-border-main/50'
                            }`}>
                                {isChecked && <Icons.Check size={16} className="text-white" strokeWidth={3} />}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Done button */}
            <div className="px-4 pb-8 pt-4 shrink-0">
                <button
                    onClick={handleDone}
                    className="w-full py-4 rounded-full bg-accent text-white text-[16px] font-semibold hover:bg-accent/90 transition-all active:scale-95"
                >
                    Done
                </button>
            </div>
        </div>
    );

    /* ── Desktop: slide-in panel inside sidebar ── */
    if (isDesktop) {
        return (
            <div className="absolute inset-0 z-[500] flex flex-col bg-bg-surface animate-slide-in-right">
                {/* Back header */}
                <header className="flex items-center px-4 h-[56px] shrink-0 border-b border-border-main/10">
                    <button
                        onClick={onClose}
                        className="p-2 -ml-2 hover:bg-bg-hover rounded-full text-text-primary transition-colors"
                    >
                        <Icons.ArrowLeft size={22} />
                    </button>
                    <h2 className="ml-3 text-[17px] font-semibold text-text-primary">Add to list</h2>
                </header>
                <div className="flex-1 overflow-hidden flex flex-col">
                    {Content}
                </div>
            </div>
        );
    }

    /* ── Mobile: bottom sheet overlay ── */
    return (
        <div
            className="fixed inset-0 z-[9999] flex flex-col justify-end bg-black/40"
            onClick={onClose}
        >
            <div
                className="w-full bg-bg-surface rounded-t-3xl flex flex-col overflow-hidden animate-slide-up"
                style={{ maxHeight: '90dvh' }}
                onClick={e => e.stopPropagation()}
            >
                {Content}
            </div>
        </div>
    );
};

export default AddToListModal;
