import React from 'react';
import { Icons } from '@constants/icons';

const PLATFORMS = [
    {
        key: 'instagram',
        label: 'Instagram',
        icon: () => (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
            </svg>
        ),
    },
    {
        key: 'facebook',
        label: 'Facebook',
        icon: () => (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M15 8h-2a2 2 0 0 0-2 2v2H9v3h2v6h3v-6h2l1-3h-3v-1a1 1 0 0 1 1-1h2V8z" />
            </svg>
        ),
    },
];

const LinksScreen = ({ onBack }) => (
    <div className="flex flex-col h-full w-full select-none bg-bg-surface animate-fade-in">
        {/* Header */}
        <header className="px-4 py-3 flex items-center sticky top-0 z-[100] bg-bg-surface">
            <button
                onClick={onBack}
                className="p-2 hover:bg-bg-hover rounded-full transition-all active:scale-90 text-text-primary cursor-pointer"
            >
                <Icons.ArrowLeft size={24} />
            </button>
            <h1 className="ml-4 text-[20px] font-bold text-text-primary flex-1">Links</h1>
        </header>

        {/* Content */}
        <div className="px-6 pt-4 flex-1">
            <p className="text-[14px] text-text-secondary mb-6 leading-snug">
                Adding links to your WhatsApp profile helps your contacts easily visit your other profiles.
            </p>

            <div className="flex flex-col gap-1">
                {PLATFORMS.map((p) => (
                    <button
                        key={p.key}
                        className="flex items-center justify-between px-4 py-4 hover:bg-bg-hover rounded-xl active:scale-[0.99] transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-text-secondary group-hover:text-accent transition-colors">
                                <p.icon />
                            </span>
                            <span className="text-[16px] text-text-primary">{p.label}</span>
                        </div>
                        <Icons.Plus size={20} className="text-text-secondary group-hover:text-accent transition-colors" />
                    </button>
                ))}
            </div>

            <p className="text-[13px] text-text-secondary mt-6 leading-snug">
                To manage who can see your links, go to{' '}
                <span className="text-accent font-medium cursor-pointer hover:underline">privacy settings</span>.
            </p>
        </div>
    </div>
);

export default LinksScreen;
