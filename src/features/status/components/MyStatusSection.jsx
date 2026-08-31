// src/features/status/components/MyStatusSection.jsx
// Displays the "My Status" bubble in the horizontal row + the "My Status detail view"
// when the user taps their own status entry.

import React from 'react';
import { useSelector } from 'react-redux';
import { selectProfile } from '@core/store/slices/settingsSlice';
import { Icons } from '@constants/icons';
import StatusRing from './StatusRing';

// ─── My Status Detail View ────────────────────────────────────────────────────

const MyStatusDetailView = ({ myStatuses, myStatusSeenCount, myStatusEntry, onOpenStatus, onDeleteAll, onClose, showDotMenu, setShowDotMenu, showToast, avatarUrl }) => (
    <section className="px-6 pb-6">
        <div className="flex items-center justify-between gap-4 mb-4">
            <div>
                <h2 className="text-[20px] font-semibold text-text-primary">My status</h2>
                <p className="text-[13px] text-text-secondary mt-1">Your updates and activity</p>
            </div>
            <button
                onClick={onClose}
                className="text-[14px] font-semibold text-accent hover:text-accent/80 transition"
            >
                Close
            </button>
        </div>

        {myStatuses.length > 0 ? (
            <div className="space-y-3">
                <button
                    onClick={() => onOpenStatus('me')}
                    className="w-full flex items-center gap-3 px-4 py-4 rounded-3xl border border-border-main/30 bg-bg-surface hover:bg-bg-hover transition"
                >
                    <div className="relative w-16 h-16 flex items-center justify-center overflow-visible">
                        <StatusRing total={myStatuses.length} seen={myStatusSeenCount} />
                        {myStatusEntry?.slides?.[0]?.type === 'text' ? (
                            <div
                                className="w-13.5 h-13.5 rounded-full flex items-center justify-center text-white text-[11px] font-bold overflow-hidden"
                                style={{ background: myStatuses[myStatuses.length - 1]?.bgColor }}
                            >
                                <Icons.Type size={22} />
                            </div>
                        ) : myStatuses[myStatuses.length - 1]?.type === 'media' ? (
                            <img src={myStatuses[myStatuses.length - 1].url} className="w-13.5 h-13.5 rounded-full object-cover" alt="My status" />
                        ) : (
                            <img src={avatarUrl} className="w-13.5 h-13.5 rounded-full object-cover ring-[1.5px] ring-border-main/30" alt="My status" />
                        )}
                    </div>
                    <div className="text-left flex-1 min-w-0">
                        <p className="text-[15px] font-semibold text-text-primary">My status</p>
                        <p className="text-[12px] text-text-secondary">
                            {myStatuses.length} update{myStatuses.length !== 1 ? 's' : ''} · {myStatusSeenCount} view{myStatusSeenCount !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="relative">
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowDotMenu(v => !v); }}
                            className="p-2 rounded-full text-text-secondary hover:bg-bg-hover transition"
                        >
                            <Icons.MoreVertical size={18} />
                        </button>
                        {showDotMenu && (
                            <div className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-border-main/30 bg-bg-surface shadow-2xl z-60 overflow-hidden">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setShowDotMenu(false); onDeleteAll(); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-bg-hover transition-colors"
                                >
                                    <Icons.Trash2 size={16} />
                                    <span className="text-[14px] font-medium">Delete status</span>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setShowDotMenu(false); showToast('Status info not available yet', 'info'); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-text-primary hover:bg-bg-hover transition-colors"
                                >
                                    <Icons.Eye size={16} className="text-text-secondary" />
                                    <span className="text-[14px]">Status info</span>
                                </button>
                            </div>
                        )}
                    </div>
                    <Icons.ChevronRight size={20} className="text-text-secondary" />
                </button>

                <div className="grid gap-3">
                    {myStatuses.map((status) => (
                        <button
                            key={status.id}
                            onClick={() => onOpenStatus('me')}
                            className="flex items-center gap-3 w-full rounded-3xl border border-border-main/20 bg-bg-surface p-3 hover:bg-bg-hover transition"
                        >
                            <div className="w-14 h-14 rounded-3xl overflow-hidden bg-bg-surface flex items-center justify-center">
                                {status.type === 'text' ? (
                                    <div
                                        className="w-full h-full flex items-center justify-center text-white text-[14px] font-semibold"
                                        style={{ background: status.bgColor || '#075e54' }}
                                    >
                                        Aa
                                    </div>
                                ) : (
                                    <img src={status.url} alt="Status preview" className="w-full h-full object-cover" />
                                )}
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-medium text-text-primary">{status.type === 'text' ? 'Text update' : 'Photo / video'}</p>
                                <p className="text-[12px] text-text-secondary truncate">{new Date(status.timestamp).toLocaleString()}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
                <div className="w-20 h-20 rounded-full bg-[#4a4a4a] flex items-center justify-center">
                    <span className="text-white text-[22px] font-light">U</span>
                </div>
                <p className="text-[15px] font-semibold text-text-primary">No status updates yet</p>
                <p className="text-[13px] text-text-secondary text-center max-w-sm">
                    Tap the buttons below to post your first status update.
                </p>
            </div>
        )}
    </section>
);

// ─── My Status Bubble (horizontal row item) ───────────────────────────────────

const MyStatusSection = ({
    myStatuses,
    myStatusSeenCount,
    myStatusEntry,
    showMyStatusView,
    setShowMyStatusView,
    showDotMenu,
    setShowDotMenu,
    onOpenStatus,
    onDeleteAll,
    onMyStatusClick,
    showToast,
}) => {
    const profile = useSelector(selectProfile);
    const myStatus = myStatuses[myStatuses.length - 1] || null;

    if (showMyStatusView) {
        return (
            <MyStatusDetailView
                myStatuses={myStatuses}
                myStatusSeenCount={myStatusSeenCount}
                myStatusEntry={myStatusEntry}
                onOpenStatus={onOpenStatus}
                onDeleteAll={onDeleteAll}
                onClose={() => setShowMyStatusView(false)}
                showDotMenu={showDotMenu}
                setShowDotMenu={setShowDotMenu}
                showToast={showToast}
                avatarUrl={profile.avatar}
            />
        );
    }

    // Default: My Status bubble inside the horizontal row
    return (
        <div
            className="flex flex-col items-center min-w-18 gap-2 cursor-pointer select-none"
            onClick={onMyStatusClick}
        >
            <div className="relative w-16 h-16 flex items-center justify-center overflow-visible">
                {myStatuses.length > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <StatusRing total={myStatuses.length} seen={myStatusSeenCount} />
                    </div>
                )}
                {myStatus?.type === 'text' ? (
                    <div
                        className="w-13.5 h-13.5 rounded-full flex items-center justify-center text-white text-[11px] font-bold overflow-hidden ring-2 ring-accent"
                        style={{ background: myStatus.bgColor }}
                    >
                        <Icons.Type size={22} />
                    </div>
                ) : myStatus?.type === 'media' ? (
                    <img src={myStatus.url} className="w-13.5 h-13.5 rounded-full object-cover ring-2 ring-accent" alt="My Status" />
                ) : (
                    <img
                        src={profile.avatar}
                        className="w-13.5 h-13.5 rounded-full object-cover ring-[1.5px] ring-border-main/30"
                        alt="My Status"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                )}
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-accent rounded-full flex items-center justify-center border-2 border-bg-surface">
                    <Icons.Plus size={11} className="text-white" strokeWidth={3} />
                </div>
            </div>
            <span className="text-xs text-center text-text-secondary">My Status</span>
        </div>
    );
};

export default MyStatusSection;
