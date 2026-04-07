import React, { useState } from 'react';
import { Icons } from '@constants/icons';

/**
 * MuteSheet — center modal (not bottom sheet)
 * Props: chatName, onMute(duration), onClose
 */
const MUTE_OPTIONS = [
    { label: '8 hours', value: '8h' },
    { label: '1 week', value: '1w' },
    { label: 'Always', value: 'always' },
];

const MuteSheet = ({ chatName = 'this chat', onMute, onClose }) => {
    const [selected, setSelected] = useState('always');

    return (
        <>
            {/* Backdrop — fixed so it covers full screen */}
            <div
                className="fixed inset-0 z-[590] bg-black/60"
                onClick={onClose}
            />

            {/* Centered Modal */}
            <div
                className="fixed inset-0 z-[600] flex items-center justify-center px-6 pointer-events-none"
            >
                <div
                    className="w-full max-w-[320px] rounded-2xl shadow-2xl overflow-hidden animate-zoom-in pointer-events-auto"
                    style={{ backgroundColor: 'var(--bg-surface)' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-6 pt-6 pb-4">
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: 'rgba(var(--accent-rgb,0,168,132),0.12)' }}>
                                <Icons.BellOff size={22} style={{ color: 'var(--accent)' }} />
                            </div>
                        </div>
                        <p className="text-[17px] font-semibold text-center" style={{ color: 'var(--text-primary)' }}>
                            Mute {chatName}
                        </p>
                        <p className="text-[13px] text-center mt-1" style={{ color: 'var(--text-secondary)' }}>
                            Choose how long to mute notifications
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="h-px" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />

                    {/* Options */}
                    <div className="px-6 py-3">
                        {MUTE_OPTIONS.map(({ label, value }) => (
                            <label
                                key={value}
                                className="flex items-center gap-4 py-3 cursor-pointer group"
                                onClick={() => setSelected(value)}
                            >
                                {/* Radio */}
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${selected === value ? 'border-accent bg-accent' : 'border-border-main group-hover:border-accent/50'}`}>
                                    {selected === value && (
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                    )}
                                </div>
                                <span className="text-[15px]" style={{ color: 'var(--text-primary)' }}>
                                    {label}
                                </span>
                            </label>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="h-px mx-0" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />

                    {/* Action Buttons */}
                    <div className="flex">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 text-[15px] font-medium hover:bg-bg-hover transition-colors border-r"
                            style={{ color: 'var(--text-secondary)', borderColor: 'rgba(255,255,255,0.06)' }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onMute?.(selected)}
                            className="flex-1 py-4 text-[15px] font-semibold hover:opacity-90 transition-all active:scale-[0.98]"
                            style={{ color: 'var(--accent)' }}
                        >
                            Mute
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MuteSheet;
