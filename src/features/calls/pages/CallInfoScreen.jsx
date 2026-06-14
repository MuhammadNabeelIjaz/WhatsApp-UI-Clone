import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '@constants/icons';
import Avatar from '@shared/ui/display/Avatar';

/**
 * CallInfo Screen — 3-dot menu with "Remove from call log" + "Block"
 * + BlockReason survey screen before actual block action.
 *
 * DECISION: Why a separate BlockReason sub-view inside this file?
 *   → BlockReason is only ever reached from CallInfo. It has no independent route.
 *   → Keeping it in one file avoids routing complexity and keeps the props chain simple.
 *
 * DECISION: Why disable Block button until a reason is selected?
 *   → WhatsApp's actual flow requires a reason for internal moderation/spam detection.
 *   → Prevents accidental blocks and ensures quality signal for the backend.
 *
 * DECISION: Why pass onRemoveCall back to parent?
 *   → The callLogs state lives in CallsScreen. CallInfo shouldn't own it.
 *   → This follows the "lift state up" principle for shared mutations.
 */

/* ─────────────── BLOCK REASON SCREEN ─────────────── */
const BlockReasonScreen = ({ contactName, onBack, onBlock }) => {
    const [selectedReason, setSelectedReason] = useState(null);
    const [reportToWA, setReportToWA] = useState(false);

    const REASONS = [
        { id: 'no_longer_needed', label: 'No longer needed' },
        { id: 'didnt_sign_up',    label: "Didn't sign up" },
        { id: 'spam',             label: 'Spam' },
        { id: 'offensive',        label: 'Offensive messages' },
        { id: 'other',            label: 'Other' },
    ];

    const canBlock = selectedReason !== null;

    return (
        <div className="absolute inset-0 bg-bg-surface z-[1100] flex flex-col animate-fade-in">
            {/* Header */}
            <header className="px-4 py-3 flex items-center gap-3 shrink-0 border-b border-border-main/20">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-bg-hover rounded-full text-text-secondary active:scale-90 transition-all"
                >
                    <Icons.ArrowLeft size={24} />
                </button>
                <span className="text-[18px] font-semibold text-text-primary">Block business</span>
            </header>

            {/* Sub-header */}
            <div className="px-5 pt-5 pb-4 border-b border-border-main/10">
                <p className="text-[14px] text-text-secondary leading-relaxed">
                    <span className="font-semibold text-text-primary">{contactName}</span>
                    {' '}won&apos;t be able to message or call you.
                </p>
            </div>

            {/* Question */}
            <div className="px-5 pt-5 pb-3">
                <p className="text-[15px] font-semibold text-text-primary">
                    Why are you blocking this contact/business?
                </p>
            </div>

            {/* Radio Buttons */}
            <div className="flex flex-col px-2 flex-1 overflow-y-auto">
                {REASONS.map(reason => (
                    <button
                        key={reason.id}
                        onClick={() => setSelectedReason(reason.id)}
                        className="flex items-center gap-4 px-3 py-3.5 rounded-xl hover:bg-bg-hover transition-colors text-left"
                    >
                        {/* Custom radio circle */}
                        <div
                            className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                            style={{
                                borderColor: selectedReason === reason.id ? 'var(--accent)' : 'var(--text-secondary)',
                                backgroundColor: selectedReason === reason.id ? 'var(--accent)' : 'transparent',
                            }}
                        >
                            {selectedReason === reason.id && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                        </div>
                        <span className="text-[15px] text-text-primary">{reason.label}</span>
                    </button>
                ))}

                {/* Report checkbox */}
                <div className="mt-4 mx-1 px-3 py-4 rounded-xl border border-border-main/20 bg-bg-surface">
                    <button
                        onClick={() => setReportToWA(p => !p)}
                        className="flex items-start gap-3 w-full text-left"
                    >
                        <div
                            className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all"
                            style={{
                                borderColor: reportToWA ? 'var(--accent)' : 'var(--text-secondary)',
                                backgroundColor: reportToWA ? 'var(--accent)' : 'transparent',
                            }}
                        >
                            {reportToWA && <Icons.Check size={12} className="text-white" strokeWidth={3} />}
                        </div>
                        <div>
                            <p className="text-[14px] font-semibold text-text-primary">Report to WhatsApp</p>
                            <p className="text-[12px] text-text-secondary mt-1 leading-relaxed">
                                The last 5 messages and basic info about the last 5 calls with this business will be sent to WhatsApp.
                            </p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Footer Block Button — disabled until reason selected */}
            <div className="px-5 py-5 border-t border-border-main/10 bg-bg-surface shrink-0">
                <button
                    onClick={() => canBlock && onBlock({ reason: selectedReason, report: reportToWA })}
                    disabled={!canBlock}
                    className="w-full py-3.5 rounded-xl text-[15px] font-semibold transition-all"
                    style={{
                        backgroundColor: canBlock ? '#e53935' : 'rgba(229,57,53,0.25)',
                        color: canBlock ? '#fff' : 'rgba(255,255,255,0.35)',
                        cursor: canBlock ? 'pointer' : 'not-allowed',
                    }}
                >
                    Block
                </button>
            </div>
        </div>
    );
};

/* ─────────────── CALL INFO SCREEN ─────────────── */
const CallInfoScreen = ({ call, onBack, onCall, onVideoCall, onMessage, onRemoveCall, onInfo }) => {
    const isMissed = call?.status === 'missed';
    const isIncoming = call?.direction === 'incoming';

    const callDate = call?.time?.includes('June') || call?.time?.includes('March')
        ? call.time.replace(/, \d+:\d+ [apm]+/i, '')
        : 'Today';

    const callTime = call?.time?.match(/\d+:\d+ [apm]+/i)?.[0] || call?.time || '';

    const StatusIcon = isIncoming ? Icons.ArrowDownLeft : Icons.ArrowUpRight;

    // Dropdown state
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Block reason screen state
    const [showBlockReason, setShowBlockReason] = useState(false);

    // Close dropdown on outside click
    useEffect(() => {
        if (!showDropdown) return;
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [showDropdown]);

    // If block reason screen is shown, render it on top
    if (showBlockReason) {
        return (
            <BlockReasonScreen
                contactName={call?.name || 'Contact'}
                onBack={() => setShowBlockReason(false)}
                onBlock={({ reason: _reason, report: _report }) => {
                    // Pass reason + report flag to the parent handler for API/mutation,
                    // then navigate back to calls list
                    // Block action dispatched via parent or redux in a real implementation
                    setShowBlockReason(false);
                    onBack();
                }}
            />
        );
    }

    return (
        <div className="absolute inset-0 bg-bg-surface z-[1000] flex flex-col animate-fade-in">
            {/* Header */}
            <header className="px-4 py-3 flex items-center justify-between shrink-0 border-b border-border-main/20">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-bg-hover rounded-full text-text-secondary active:scale-90 transition-all"
                    >
                        <Icons.ArrowLeft size={24} />
                    </button>
                    <span className="text-[18px] font-semibold text-text-primary">Call info</span>
                </div>

                {/* 3-dot menu*/}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropdown(p => !p)}
                        className="p-2 hover:bg-bg-hover rounded-full text-text-secondary active:scale-90 transition-all"
                    >
                        <Icons.MoreVertical size={22} />
                    </button>

                    {showDropdown && (
                        <div className="absolute right-0 top-full mt-1 w-52 bg-bg-surface border border-border-main/30 rounded-xl shadow-2xl z-[100] py-1.5 animate-zoom-in origin-top-right overflow-hidden">
                            {/* Remove from call log */}
                            <button
                                onClick={() => {
                                    setShowDropdown(false);
                                    onRemoveCall?.(call?.id);
                                    onBack();
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-hover transition-colors text-left"
                            >
                                <Icons.Trash2 size={17} className="text-text-secondary" />
                                <span className="text-[14px] text-text-primary">Remove from call log</span>
                            </button>

                            {/* Block */}
                            <button
                                onClick={() => {
                                    setShowDropdown(false);
                                    setShowBlockReason(true);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-hover transition-colors text-left"
                            >
                                <Icons.Ban size={17} className="text-red-400" />
                                <span className="text-[14px] text-red-400">Block</span>
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Profile */}
            <div className="flex flex-col items-center pt-8 pb-6 px-4">
                <button
                    className="mb-4 rounded-full active:scale-95 transition-transform"
                    onClick={() => onInfo?.({ id: call?.id, name: call?.name, avatar: call?.avatar || '' })}
                >
                    <Avatar src={call?.avatar} name={call?.name || 'U'} size={96} shape="circle" />
                </button>
                <h2 className="text-[22px] font-semibold text-text-primary mb-1">{call?.name || 'Unknown'}</h2>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 px-6 mb-6">
                <button
                    onClick={onMessage}
                    className="flex-1 flex flex-col items-center gap-2 py-3 rounded-xl bg-bg-surface border border-border-main/20 hover:bg-bg-hover active:scale-95 transition-all"
                >
                    <Icons.MessageSquare size={22} className="text-accent" />
                    <span className="text-[13px] text-text-primary">Message</span>
                </button>
                <button
                    onClick={onCall}
                    className="flex-1 flex flex-col items-center gap-2 py-3 rounded-xl bg-bg-surface border border-border-main/20 hover:bg-bg-hover active:scale-95 transition-all"
                >
                    <Icons.Phone size={22} className="text-accent" />
                    <span className="text-[13px] text-text-primary">Audio</span>
                </button>
                <button
                    onClick={onVideoCall}
                    className="flex-1 flex flex-col items-center gap-2 py-3 rounded-xl bg-bg-surface border border-border-main/20 hover:bg-bg-hover active:scale-95 transition-all"
                >
                    <Icons.Video size={22} className="text-accent" />
                    <span className="text-[13px] text-text-primary">Video</span>
                </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-border-main/20 mx-0" />

            {/* Call History Entry */}
            <div className="px-4 pt-4">
                <p className="text-[13px] text-text-secondary font-medium mb-3">{callDate}</p>
                <div className="flex items-center gap-3 py-2">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isMissed ? 'bg-red-500/15' : 'bg-accent/15'}`}>
                        <StatusIcon size={18} className={isMissed ? 'text-red-500' : 'text-accent'} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                        <p className={`text-[15px] font-medium ${isMissed ? 'text-red-500' : 'text-text-primary'}`}>
                            {isMissed ? 'Missed' : isIncoming ? 'Incoming' : 'Outgoing'}
                        </p>
                        <p className="text-[13px] text-text-secondary">{callTime}</p>
                    </div>
                    {!isMissed && (
                        <span className="text-[13px] text-text-secondary">
                            {call?.duration || (isIncoming ? '' : 'Not answered')}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CallInfoScreen;
