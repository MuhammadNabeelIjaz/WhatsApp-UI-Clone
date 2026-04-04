import React, { useState } from 'react';
import { Icons } from '@constants/icons';

const EmailAddressSettings = ({ onBack }) => {
    const [email, setEmail] = useState('nnabeelijaznabinoor@gmail.com');
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(email);
    const [verified, setVerified] = useState(true);
    const [showVerifyNote, setShowVerifyNote] = useState(false);

    const handleSave = () => {
        if (!draft.trim() || !draft.includes('@')) return;
        setEmail(draft.trim());
        setEditing(false);
        if (draft.trim() !== email) {
            setVerified(false);
            setShowVerifyNote(true);
        }
    };

    const handleCancel = () => {
        setDraft(email);
        setEditing(false);
        setShowVerifyNote(false);
    };

    return (
        <div className="flex flex-col h-full w-full animate-fade-in bg-bg-surface">
            {/* Header */}
            <header className="px-4 py-5 flex items-center gap-6 sticky top-0 z-50 shadow-sm bg-bg-surface">
                <button onClick={onBack} className="p-1 hover:bg-bg-hover rounded-full transition-colors active:scale-95 text-text-primary">
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="text-[20px] font-medium text-text-primary flex-1">Email address</h1>
                {editing && (
                    <button
                        onClick={handleSave}
                        className={`text-[15px] font-semibold transition-opacity ${draft.includes('@') ? 'text-accent' : 'text-accent/30'}`}
                        disabled={!draft.includes('@')}
                    >
                        Save
                    </button>
                )}
            </header>

            <div className="flex-1 px-6 py-8">
                <p className="text-[14.5px] leading-relaxed mb-8 opacity-70 text-text-primary">
                    Email helps you access your account. It isn't visible to others.
                </p>

                <div className="flex flex-col gap-1 w-full">
                    <label className="text-[13px] font-medium mb-2 text-text-secondary">Email</label>

                    {editing ? (
                        <div className="border-b-2 border-accent pb-1 flex items-center gap-2">
                            <input
                                autoFocus
                                type="email"
                                value={draft}
                                onChange={e => setDraft(e.target.value)}
                                className="flex-1 bg-transparent text-[16px] text-text-primary outline-none"
                                onKeyDown={e => e.key === 'Enter' && handleSave()}
                            />
                            <button onClick={handleCancel} className="text-text-secondary hover:text-text-primary p-1">
                                <Icons.X size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between group">
                            <span className="text-[17px] font-normal tracking-wide truncate pr-4 text-text-primary">
                                {email}
                            </span>
                            <button
                                onClick={() => { setDraft(email); setEditing(true); }}
                                className="p-2 hover:bg-bg-hover rounded-full transition-colors"
                            >
                                <Icons.Pencil size={18} className="text-text-secondary" />
                            </button>
                        </div>
                    )}

                    {/* Verified / unverified status */}
                    <div className="flex items-center gap-2 mt-2">
                        {verified ? (
                            <>
                                <Icons.CheckCircle2 size={16} className="text-[#00a884]" />
                                <span className="text-[14px] font-medium text-[#00a884]">Verified</span>
                            </>
                        ) : (
                            <>
                                <Icons.AlertCircle size={16} className="text-yellow-500" />
                                <span className="text-[14px] font-medium text-yellow-500">Pending verification</span>
                            </>
                        )}
                    </div>

                    {showVerifyNote && (
                        <div className="mt-4 p-3 bg-accent/5 rounded-xl border border-accent/20">
                            <p className="text-[13px] text-text-secondary leading-relaxed">
                                A verification link has been sent to <span className="text-text-primary font-medium">{email}</span>. Check your inbox to verify.
                            </p>
                            <button
                                onClick={() => { setVerified(true); setShowVerifyNote(false); }}
                                className="mt-2 text-[13px] text-accent font-semibold hover:underline"
                            >
                                Mark as verified (demo)
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailAddressSettings;
