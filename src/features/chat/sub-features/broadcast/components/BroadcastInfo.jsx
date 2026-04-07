/**
 * BroadcastInfo — dedicated info screen for broadcast chats.
 * Mirrors the structure of GroupInfo / UserInfoPanel but is broadcast-specific.
 * Handles both mobile overlay and desktop right-panel usage.
 */
import React, { useState } from 'react';
import { useFakeLoading } from '@shared/hooks';
import { Icons } from '@constants/icons';
import SectionLabel from '@shared/ui/list/SectionLabel';
import ConfirmDialog from '@shared/ui/feedback/ConfirmDialog';
import { useDispatch } from 'react-redux';
import { showToast } from '@core/store/slices/uiSlice';

const BroadcastInfo = ({ chat, onBack }) => {
    const dispatch = useDispatch();
    const [isMuted, setIsMuted]   = useState(chat?.isMuted || false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const isLoading = useFakeLoading(300, chat?.id);

    const members = chat?.members || [];

    if (isLoading) {
        return (
            <div className="flex flex-col h-full bg-bg-surface animate-fade-in">
                <header className="px-4 py-3 flex items-center gap-3 shrink-0 border-b border-border-main/10 h-[64px]">
                    <div className="skeleton-bone w-9 h-9 rounded-full" />
                    <div className="skeleton-bone h-5 w-32 rounded" />
                </header>
                <div className="flex flex-col items-center pt-10 gap-3">
                    <div className="skeleton-bone w-[88px] h-[88px] rounded-full" />
                    <div className="skeleton-bone h-5 w-40 rounded" />
                    <div className="skeleton-bone h-4 w-24 rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-bg-surface animate-fade-in overflow-y-auto custom-scrollbar">
            {/* Header */}
            <header className="px-4 py-3 flex items-center gap-3 shrink-0 border-b border-border-main/10 sticky top-0 bg-bg-surface z-10">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-bg-hover rounded-full text-text-secondary active:scale-90 transition-all"
                >
                    <Icons.ArrowLeft size={22} />
                </button>
                <h1 className="text-[17px] font-semibold text-text-primary">Broadcast Info</h1>
            </header>

            {/* Avatar + Name */}
            <div className="flex flex-col items-center py-8 px-4 border-b border-border-main/10">
                <div className="w-[88px] h-[88px] rounded-full bg-orange-500/20 flex items-center justify-center mb-4 shadow-lg">
                    <Icons.Megaphone size={38} className="text-orange-400" />
                </div>
                <h2 className="text-[20px] font-bold text-text-primary text-center">{chat?.name || 'Broadcast'}</h2>
                <p className="text-[13px] text-text-secondary mt-1">
                    Broadcast · {members.length} recipient{members.length !== 1 ? 's' : ''}
                </p>
                {chat?.createdAt && (
                    <p className="text-[12px] text-text-secondary/60 mt-1">
                        Created {new Date(chat.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                )}
            </div>

            {/* Info banner */}
            <div className="mx-4 my-4 px-4 py-3 rounded-xl bg-orange-500/10 border border-orange-500/20 flex gap-3 items-start">
                <Icons.Info size={16} className="text-orange-400 mt-0.5 shrink-0" />
                <p className="text-[13px] text-text-secondary leading-relaxed">
                    Only contacts who have you saved in their address book will receive your broadcast messages.
                </p>
            </div>

            {/* Settings */}
            <div className="border-b border-border-main/10 pb-2">
                <SectionLabel label="Settings" />

                {/* Mute notifications */}
                <div
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-bg-hover transition-all cursor-pointer"
                    onClick={() => {
                        setIsMuted(m => !m);
                        dispatch(showToast(isMuted ? 'Notifications unmuted' : 'Notifications muted'));
                    }}
                >
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: 'rgba(100,100,100,0.15)' }}>
                        <Icons.BellOff size={18} className="text-text-secondary" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[14px] font-medium text-text-primary">Mute notifications</p>
                    </div>
                    <div
                        className="w-11 h-6 rounded-full flex items-center px-1 transition-all cursor-pointer"
                        style={{ backgroundColor: isMuted ? 'var(--accent)' : 'var(--bg-hover)' }}
                    >
                        <div className="w-4 h-4 rounded-full bg-white shadow transition-transform"
                            style={{ transform: isMuted ? 'translateX(20px)' : 'translateX(0)' }} />
                    </div>
                </div>

                {/* Media, Links, Docs */}
                <div
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-bg-hover transition-all cursor-pointer"
                    onClick={() => dispatch(showToast('Media, links & docs coming soon', 'info'))}
                >
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: 'rgba(59,130,246,0.15)' }}>
                        <Icons.Image size={18} className="text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[14px] font-medium text-text-primary">Media, links and docs</p>
                    </div>
                    <Icons.ChevronRight size={17} className="text-text-secondary opacity-50" />
                </div>
            </div>

            {/* Recipients */}
            {members.length > 0 && (
                <div className="border-b border-border-main/10 pb-2">
                    <SectionLabel label={`${members.length} Recipient${members.length !== 1 ? 's' : ''}`} />
                    {members.map((member, idx) => (
                        <div key={member.id ?? idx}
                            className="flex items-center gap-4 px-5 py-3 hover:bg-bg-hover transition-colors">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[13px] shrink-0"
                                style={{ backgroundColor: member.color || '#607d8b' }}
                            >
                                {member.initials || member.name?.[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[15px] font-medium text-text-primary truncate">{member.name}</p>
                                {member.status && (
                                    <p className="text-[12px] text-text-secondary truncate">{member.status}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Danger zone */}
            <div className="pb-8 pt-2">
                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-red-500/10 transition-all"
                >
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: 'rgba(239,68,68,0.15)' }}>
                        <Icons.Trash2 size={18} className="text-red-400" />
                    </div>
                    <p className="text-[14px] font-medium text-red-400">Delete broadcast</p>
                </button>
            </div>

            {/* Delete confirm dialog */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                title="Delete broadcast?"
                message="This will permanently delete this broadcast list. You cannot undo this action."
                confirmLabel="Delete"
                confirmColor="red"
                onConfirm={() => {
                    dispatch(showToast('Broadcast deleted'));
                    setShowDeleteConfirm(false);
                    onBack?.();
                }}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </div>
    );
};

export default BroadcastInfo;
