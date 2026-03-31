import React, { useState } from 'react';
import { Icons } from '@constants/icons';
import ScreenHeader from '@shared/ui/layout/ScreenHeader';

const CreateCallLinkScreen = ({ onBack }) => {
    const [callType, setCallType] = useState('video');
    const [requireApproval, setRequireApproval] = useState(false);
    const [copied, setCopied] = useState(false);
    const link = 'https://call.whatsapp.com/video/SampleLink123';

    const handleCopyLink = () => {
        navigator.clipboard.writeText(link).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
            // Fallback for environments where clipboard API isn't available
            const el = document.createElement('textarea');
            el.value = link;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleShareViaApp = () => {
        // Route back so user can select a contact to send the link to
        onBack?.();
    };

    const handleAddToCalendar = () => {
        const start = new Date();
        const end = new Date(start.getTime() + 60 * 60 * 1000);
        const fmt = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const icsContent = [
            'BEGIN:VCALENDAR', 'VERSION:2.0',
            'BEGIN:VEVENT',
            `DTSTART:${fmt(start)}`,
            `DTEND:${fmt(end)}`,
            'SUMMARY:WhatsApp Call',
            `DESCRIPTION:Join via: ${link}`,
            'END:VEVENT', 'END:VCALENDAR'
        ].join('\r\n');
        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'whatsapp-call.ics'; a.click();
        URL.revokeObjectURL(url);
    };

    const handleShareLink = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: 'WhatsApp Call', text: 'Join my WhatsApp call:', url: link });
            } catch (_) { /* user cancelled */ }
        } else {
            handleCopyLink();
        }
    };

    return (
        <div className="absolute inset-0 bg-bg-surface z-[1000] flex flex-col animate-fade-in">
            <ScreenHeader title="Create call link" onBack={onBack} />

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Info banner */}
                <p className="px-5 pt-5 pb-4 text-[13.5px] text-text-secondary leading-relaxed">
                    Anyone with WhatsApp can use this link to join this call. Only share it with people you trust.
                </p>

                {/* Link preview */}
                <div className="mx-4 flex items-center gap-3 p-4 bg-bg-surface rounded-xl border border-border-main/30 mb-4">
                    <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center shrink-0">
                        <Icons.Video size={20} className="text-white" />
                    </div>
                    <span className="text-accent text-[13.5px] font-medium break-all flex-1">{link}</span>
                </div>

                {/* Call type selector */}
                <div className="mx-4 bg-bg-surface rounded-xl border border-border-main/30 mb-4 overflow-hidden">
                    <div className="p-4">
                        <p className="text-[15px] text-text-primary font-medium mb-1">Call type</p>
                        <div className="flex gap-3 mt-2">
                            {['audio', 'video'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setCallType(type)}
                                    className={`flex-1 py-2 rounded-full text-[14px] font-semibold capitalize transition-all
                                        ${callType === type ? 'bg-accent text-white' : 'bg-bg-input text-text-secondary border border-border-main/30'}`}
                                >
                                    {type === 'audio' ? <span className="flex items-center justify-center gap-2"><Icons.Phone size={15} />{type}</span>
                                        : <span className="flex items-center justify-center gap-2"><Icons.Video size={15} />{type}</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Require approval toggle */}
                <div className="mx-4 flex items-center gap-3 py-4 px-4 bg-bg-surface rounded-xl border border-border-main/30 mb-6">
                    <Icons.UserPlus size={20} className="text-text-secondary shrink-0" />
                    <span className="flex-1 text-[15px] text-text-primary">Require approval to join</span>
                    <button
                        onClick={() => setRequireApproval(p => !p)}
                        className={`relative w-12 h-6 rounded-full transition-all ${requireApproval ? 'bg-accent' : 'bg-bg-input border border-border-main/50'}`}
                    >
                        <div className={`absolute top-[2px] w-5 h-5 rounded-full bg-white shadow transition-all ${requireApproval ? 'left-[26px]' : 'left-[2px]'}`} />
                    </button>
                </div>

                {/* Action rows */}
                <div className="mx-4 bg-bg-surface rounded-xl border border-border-main/30 overflow-hidden">
                    {[
                        { icon: <Icons.Share2 size={20} />, label: 'Send link via WhatsApp', onClick: handleShareViaApp },
                        { icon: copied ? <Icons.Check size={20} className="text-accent" /> : <Icons.Copy size={20} />, label: copied ? 'Copied!' : 'Copy link', onClick: handleCopyLink },
                        { icon: <Icons.Calendar size={20} />, label: 'Add to calendar', onClick: handleAddToCalendar },
                        { icon: <Icons.Share2 size={20} />, label: 'Share link', onClick: handleShareLink },
                    ].map((item, i, arr) => (
                        <button
                            key={item.label}
                            onClick={item.onClick}
                            className={`w-full flex items-center gap-4 px-4 py-4 hover:bg-bg-hover active:bg-bg-hover/80 transition-colors text-left
                                ${i < arr.length - 1 ? 'border-b border-border-main/20' : ''}`}
                        >
                            <span className="text-text-secondary">{item.icon}</span>
                            <span className="text-[15px] text-text-primary">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CreateCallLinkScreen;
