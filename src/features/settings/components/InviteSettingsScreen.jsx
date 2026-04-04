import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import EmptyState from '@shared/ui/display/EmptyState';
import SectionHeader from '@shared/ui/settings/SectionHeader';
import ReactDOM from 'react-dom';
import { Icons } from '@constants/icons';
import { selectContacts } from '@core/store/slices/contactSlice';

const ShareModal = ({ onClose }) =>
    ReactDOM.createPortal(
        <div
            className="fixed inset-0 flex items-end justify-center z-[99999] bg-black/60 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg rounded-t-3xl bg-bg-surface shadow-2xl pb-8 animate-slide-in-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="w-12 h-1 bg-border-main/20 rounded-full mx-auto mt-3 mb-6" />
                <h2 className="text-[18px] font-bold text-text-primary px-6 mb-6">Share WhatsApp link</h2>

                {/* Link row */}
                <div className="px-6 py-3 flex items-center gap-4 bg-bg-hover/50 mx-4 rounded-2xl mb-6">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                        <Icons.MessageSquare size={18} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-text-secondary text-[13px]">WhatsApp invite link</p>
                        <p className="text-accent text-[14px] font-medium truncate">https://wa.me/923047662828</p>
                    </div>
                    <button
                        className="p-2 hover:bg-bg-hover rounded-full text-text-secondary active:scale-90 transition-all"
                        onClick={() => navigator.clipboard?.writeText('https://wa.me/923047662828')}
                    >
                        <Icons.Copy size={18} />
                    </button>
                </div>

                {/* Share options */}
                <div className="flex justify-around px-6">
                    {[
                        { icon: Icons.MessageSquare, label: 'Message', color: '#25D366' },
                        { icon: Icons.Mail,          label: 'Email',   color: '#EA4335' },
                        { icon: Icons.Share2,        label: 'More',    color: '#5865F2' },
                    ].map(({ icon: Ic, label, color }) => (
                        <button key={label} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
                            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
                                <Ic size={24} style={{ color }} />
                            </div>
                            <span className="text-[12px] text-text-secondary">{label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>,
        document.body
    );

const InviteSettingsScreen = ({ onBack }) => {
    const contacts = useSelector(selectContacts);
    const [query, setQuery]         = useState('');
    const [showShare, setShowShare] = useState(false);
    const [invited, setInvited]     = useState(new Set());

    const filtered = query.trim()
        ? contacts.filter(c =>
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            (c.phone || '').includes(query)
          )
        : contacts;

    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-bg-surface">
            <header className="px-4 py-3 flex items-center justify-between shrink-0 border-b border-border-main/5 bg-bg-surface">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full transition-all active:scale-90 text-text-primary">
                        <Icons.ArrowLeft size={24} />
                    </button>
                    <h1 className="text-[20px] font-bold text-text-primary">Invite a friend</h1>
                </div>
                <button className="p-2 hover:bg-bg-hover rounded-full text-text-primary">
                    <Icons.Search size={22} />
                </button>
            </header>

            {/* Search bar */}
            <div className="px-4 py-2 border-b border-border-main/5">
                <div className="flex items-center gap-3 bg-bg-hover rounded-xl px-4 py-2">
                    <Icons.Search size={18} className="text-text-secondary opacity-50" />
                    <input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search contacts..."
                        className="flex-1 bg-transparent text-text-primary text-[15px] outline-none"
                    />
                    {query && <button onClick={() => setQuery('')}><Icons.X size={16} className="text-text-secondary" /></button>}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Share link row */}
                <div
                    onClick={() => setShowShare(true)}
                    className="px-4 py-4 flex items-center gap-4 hover:bg-bg-hover cursor-pointer active:opacity-80 transition-all group"
                >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-accent text-white shadow-sm group-hover:scale-105 transition-transform">
                        <Icons.Share2 size={22} />
                    </div>
                    <div>
                        <span className="text-[17px] font-semibold text-text-primary">Share link</span>
                        <p className="text-[13px] text-text-secondary opacity-70">Invite via link</p>
                    </div>
                </div>

                <SectionHeader label={`From contacts (${filtered.length})`} />

                <div className="pb-10">
                    {filtered.map((c) => (
                        <div key={c.id} className="px-4 py-3 flex items-center justify-between hover:bg-bg-hover cursor-pointer transition-colors group">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="w-12 h-12 shrink-0 rounded-full flex items-center justify-center bg-border-main/10 text-text-secondary">
                                    <Icons.UserRound size={26} />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[16px] font-medium text-text-primary truncate">{c.name}</span>
                                    <span className="text-[13px] text-text-secondary opacity-70 truncate">{c.phone || c.status || ''}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setInvited(p => { const s = new Set(p); s.has(c.id) ? s.delete(c.id) : s.add(c.id); return s; })}
                                className={`text-[14px] font-bold px-4 py-1.5 rounded-full border transition-all active:scale-95
                                    ${invited.has(c.id) ? 'border-accent/30 text-accent bg-accent/10' : 'border-accent/30 text-accent hover:bg-accent/10'}`}
                            >
                                {invited.has(c.id) ? 'Invited ✓' : 'Invite'}
                            </button>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <EmptyState title="No contacts found" className="py-10" />
                    )}
                </div>
            </div>

            {showShare && <ShareModal onClose={() => setShowShare(false)} />}
        </div>
    );
};

export default InviteSettingsScreen;
