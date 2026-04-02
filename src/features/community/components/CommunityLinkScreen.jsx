import React, { useState, useCallback } from 'react';
import { Icons } from '@constants/icons';
import SectionLabel from '@shared/ui/list/SectionLabel';
import CommunityQRScreen from './CommunityQRScreen';
import { SendToScreen } from '@features/chat';
import ConfirmDialog from '@shared/ui/feedback/ConfirmDialog';

// Self-contained toast — no external dependency needed
const Toast = ({ msg }) => {
    if (!msg) return null;
    return (
        <div
            style={{ position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, pointerEvents: 'none' }}
            className="px-5 py-2.5 rounded-full bg-[#1f2937] text-white text-[13px] shadow-xl whitespace-nowrap"
        >
            {msg}
        </div>
    );
};

// Single action row — plain div so NO button-nesting issues
const Row = ({ iconName, label, onClick, danger }) => {
    const Icon = Icons[iconName];
    return (
        <div
            role="button"
            tabIndex={0}
            className="flex items-center gap-4 px-5 py-4 hover:bg-bg-hover active:bg-bg-hover/60 cursor-pointer transition-colors border-b border-border-main/10 last:border-0"
            onClick={onClick}
            onKeyDown={e => e.key === 'Enter' && onClick()}
        >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${danger ? 'bg-red-500/10' : 'bg-accent/10'}`}>
                {Icon && <Icon size={20} className={danger ? 'text-red-400' : 'text-accent'} />}
            </div>
            <span className={`flex-1 text-[15px] ${danger ? 'text-red-400' : 'text-text-primary'}`}>{label}</span>
            {!danger && iconName === 'QrCode' && <Icons.ChevronRight size={18} className="text-text-secondary" />}
        </div>
    );
};

const CommunityLinkScreen = ({ community, onBack }) => {
    const [toast, setToast] = useState('');
    const [showQR, setShowQR] = useState(false);
    const [showSendTo, setShowSendTo] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [inviteLink, setInviteLink] = useState(
        community?.inviteLink ||
        (community?.id
            ? `https://chat.whatsapp.com/${community.id.replace(/[^a-zA-Z0-9]/g, '').padEnd(8, 'X').slice(0, 22)}`
            : 'https://chat.whatsapp.com/Kcc9TSc0MasG6WtG5spCWi')
    );

    const communityName = community?.name || 'Community';
    const shareText = `Follow this link to join my WhatsApp community: ${inviteLink}`;

    const showMsg = useCallback((msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 2000);
    }, []);

    const copyToClipboard = useCallback((text) => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).catch(() => {});
            } else {
                // fallback for non-https
                const el = document.createElement('textarea');
                el.value = text;
                el.style.position = 'fixed';
                el.style.opacity = '0';
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
            }
        } catch (_) { /* intentional */ }
    }, []);

    if (showQR) return <CommunityQRScreen community={{ ...community, inviteLink }} onBack={() => setShowQR(false)} />;
    if (showSendTo) return <SendToScreen shareText={shareText} inviteLink={inviteLink} onBack={() => setShowSendTo(false)} />;

    const actions = [
        {
            iconName: 'Share2',
            label: 'Send link via WhatsApp',
            onClick: () => setShowSendTo(true),
        },
        {
            iconName: 'CircleDot',
            label: 'Share to my status',
            onClick: () => showMsg('Go to Status tab → tap + → paste link as text status'),
        },
        {
            iconName: 'Copy',
            label: 'Copy link',
            onClick: () => { copyToClipboard(inviteLink); showMsg('Link copied ✓'); },
        },
        {
            iconName: 'MessageSquare',
            label: 'Send link via SMS',
            onClick: () => {
                try { window.open(`sms:?body=${encodeURIComponent(shareText)}`, '_self'); } catch (_) { /* intentional */ }
                showMsg('Opening SMS…');
            },
        },
        {
            iconName: 'Mail',
            label: 'Send link via email',
            onClick: () => {
                const sub = encodeURIComponent(`Join my WhatsApp community: ${communityName}`);
                const body = encodeURIComponent(shareText);
                try { window.open(`mailto:?subject=${sub}&body=${body}`, '_blank'); } catch (_) { /* intentional */ }
                showMsg('Opening email…');
            },
        },
        {
            iconName: 'Globe',
            label: 'Share link',
            onClick: () => {
                if (navigator.share) {
                    navigator.share({ title: communityName, text: shareText, url: inviteLink }).catch(() => {});
                } else {
                    copyToClipboard(inviteLink);
                    showMsg('Link copied ✓');
                }
            },
        },
        {
            iconName: 'QrCode',
            label: 'QR code',
            onClick: () => setShowQR(true),
        },
        {
            iconName: 'RefreshCw',
            label: 'Reset link',
            danger: true,
            onClick: () => setShowResetConfirm(true),
        },
    ];

    return (
        <div className="flex flex-col h-full w-full bg-bg-surface select-none">

            {/* Header */}
            <header className="px-3 py-3 flex items-center gap-3 shrink-0 bg-bg-surface border-b border-border-main/10">
                <div
                    role="button"
                    tabIndex={0}
                    className="p-2 rounded-full hover:bg-bg-hover active:scale-95 transition-all text-text-primary cursor-pointer"
                    onClick={onBack}
                    onKeyDown={e => e.key === 'Enter' && onBack()}
                >
                    <Icons.ArrowLeft size={24} />
                </div>
                <h1 className="text-[18px] font-semibold text-text-primary flex-1">Community link</h1>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar">

                {/* Hint */}
                <p className="px-5 pt-5 pb-4 text-[13px] text-text-secondary leading-relaxed">
                    People with this link can join this community. Only share it with people you trust.
                </p>

                {/* Community card */}
                <div className="mx-4 rounded-2xl bg-bg-surface border border-border-main/15 overflow-hidden mb-2">
                    <div className="px-4 py-4 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-border-main/20 bg-accent/10 flex items-center justify-center">
                            {community?.image
                                ? <img src={community.image} alt="" className="w-full h-full object-cover"
                                    onError={e => { e.target.style.display = 'none'; }} />
                                : <span className="text-white text-[18px] font-bold">{communityName.slice(0, 2).toUpperCase()}</span>
                            }
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[16px] font-semibold text-text-primary leading-tight truncate">{communityName}</p>
                            <p
                                className="text-accent text-[13px] mt-1 truncate cursor-pointer"
                                onClick={() => { copyToClipboard(inviteLink); showMsg('Link copied ✓'); }}
                                title="Tap to copy"
                            >
                                {inviteLink}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mx-4 mt-3 rounded-2xl bg-bg-surface border border-border-main/15 overflow-hidden">
                    {actions.map(a => (
                        <Row
                            key={a.label}
                            iconName={a.iconName}
                            label={a.label}
                            onClick={a.onClick}
                            danger={a.danger}
                        />
                    ))}
                </div>

                {/* Share preview */}
                <div className="mx-4 mt-4 p-4 rounded-2xl bg-bg-surface border border-border-main/15">
                    <SectionLabel label="Share message preview" className="px-0 py-0 mb-2" />
                    <p className="text-[14px] text-text-primary leading-relaxed">{shareText}</p>
                    <div
                        role="button"
                        tabIndex={0}
                        className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 text-accent text-[13px] font-medium hover:bg-accent/10 active:scale-95 transition-all cursor-pointer"
                        onClick={() => { copyToClipboard(shareText); showMsg('Message copied ✓'); }}
                        onKeyDown={e => e.key === 'Enter' && copyToClipboard(shareText)}
                    >
                        <Icons.Copy size={14} />
                        Copy full message
                    </div>
                </div>

                <div className="h-10" />
            </div>

            <Toast msg={toast} />

            <ConfirmDialog
                isOpen={showResetConfirm}
                title="Reset community link?"
                message="Current link will stop working. Anyone with the old link won't be able to join."
                confirmLabel="Reset"
                cancelLabel="Cancel"
                confirmColor="red"
                onCancel={() => setShowResetConfirm(false)}
                onConfirm={() => {
                    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    const code = Array.from({ length: 22 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
                    setInviteLink(`https://chat.whatsapp.com/${code}`);
                    showMsg('Community link reset ✓');
                    setShowResetConfirm(false);
                }}
            />
        </div>
    );
};

export default CommunityLinkScreen;
