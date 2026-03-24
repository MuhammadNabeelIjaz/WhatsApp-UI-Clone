/**
 * ChatDetailDialogs
 * Hosts all confirm / picker dialogs for ChatDetail:
 *   - DeleteConfirm     (delete 1 or many messages)
 *   - BlockConfirm      (block contact)
 *   - DisappearingMsg   (set message timer)
 *
 * Each dialog is shown conditionally via its `show` prop.
 */
import React from 'react';

// ─── Delete Confirm ───────────────────────────────────────────────────────────
export const DeleteConfirmDialog = ({ show, count, onDeleteForEveryone, onDeleteForMe, onCancel }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center animate-fade-in px-6">
            <div className="bg-bg-surface rounded-2xl shadow-2xl w-full max-w-[320px] overflow-hidden animate-zoom-in">
                <div className="px-6 pt-6 pb-4">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                <path d="M10 11v6" /><path d="M14 11v6" />
                                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-[17px] font-semibold text-text-primary text-center mb-1">
                        Delete {count} message{count > 1 ? 's' : ''}?
                    </h3>
                    <p className="text-[13px] text-text-secondary text-center">This action cannot be undone.</p>
                </div>
                <div className="h-px bg-border-main/20" />
                <div className="flex flex-col">
                    <button onClick={onDeleteForEveryone} className="w-full py-4 text-red-400 font-semibold text-[15px] hover:bg-red-500/10 transition-colors border-b border-border-main/10">
                        Delete for Everyone
                    </button>
                    <button onClick={onDeleteForMe} className="w-full py-4 text-red-400 font-medium text-[15px] hover:bg-red-500/10 transition-colors border-b border-border-main/10">
                        Delete for Me
                    </button>
                    <button onClick={onCancel} className="w-full py-4 text-text-secondary text-[15px] hover:bg-bg-hover transition-colors">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Block Confirm ────────────────────────────────────────────────────────────
export const BlockConfirmDialog = ({ show, contactName, onBlock, onCancel }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center animate-fade-in px-6">
            <div className="bg-bg-surface rounded-2xl shadow-2xl w-full max-w-[320px] overflow-hidden animate-zoom-in">
                <div className="px-6 pt-6 pb-4">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-[17px] font-semibold text-text-primary text-center mb-1">
                        Block {contactName}?
                    </h3>
                    <p className="text-[13px] text-text-secondary text-center">
                        Blocked contacts will no longer be able to call you or send you messages.
                    </p>
                </div>
                <div className="h-px bg-border-main/20" />
                <div className="flex flex-col">
                    <button onClick={onBlock} className="w-full py-4 text-red-400 font-semibold text-[15px] hover:bg-red-500/10 transition-colors border-b border-border-main/10">
                        Block
                    </button>
                    <button onClick={onCancel} className="w-full py-4 text-text-secondary text-[15px] hover:bg-bg-hover transition-colors">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Disappearing Messages ────────────────────────────────────────────────────
const TIMER_OPTIONS = [
    { label: 'Off',      value: 'off' },
    { label: '24 hours', value: '24h' },
    { label: '7 days',   value: '7d'  },
    { label: '90 days',  value: '90d' },
];

export const DisappearingMsgDialog = ({ show, value, onChange, onSave, onCancel }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center animate-fade-in px-6">
            <div className="bg-bg-surface rounded-2xl shadow-2xl w-full max-w-[320px] overflow-hidden animate-zoom-in">
                <div className="px-6 pt-6 pb-4">
                    <h3 className="text-[17px] font-semibold text-text-primary text-center mb-1">
                        Disappearing messages
                    </h3>
                    <p className="text-[13px] text-text-secondary text-center mb-4">
                        New messages will disappear after the selected duration.
                    </p>
                    {TIMER_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => onChange(opt.value)}
                            className="w-full flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-bg-hover transition-colors text-left"
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${value === opt.value ? 'border-accent bg-accent' : 'border-border-main'}`}>
                                {value === opt.value && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <span className="text-[15px] text-text-primary">{opt.label}</span>
                        </button>
                    ))}
                </div>
                <div className="h-px bg-border-main/20" />
                <div className="flex">
                    <button onClick={onCancel} className="flex-1 py-4 text-text-secondary text-[15px] hover:bg-bg-hover transition-colors border-r border-border-main/10">
                        Cancel
                    </button>
                    <button onClick={onSave} className="flex-1 py-4 text-accent font-semibold text-[15px] hover:bg-bg-hover transition-colors">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};
