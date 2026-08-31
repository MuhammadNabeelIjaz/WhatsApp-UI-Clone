/**
 * DynamicCallGrid — Google Meet-inspired adaptive participant grid.
 * Calculates layout automatically based on participant count.
 * Shows overflow counter tile when participants exceed MAX_VISIBLE.
 */
import React from 'react';
import { Icons } from '@constants/icons';

const MAX_VISIBLE = 6;

const ParticipantTile = ({ participant, size = 'md' }) => {
    const sizeClasses = {
        lg: 'text-[40px] w-20 h-20',
        md: 'text-[32px] w-16 h-16',
        sm: 'text-[24px] w-12 h-12',
    };
    const initials = (participant?.name || 'U')
        .split(' ')
        .map(w => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="relative flex-1 min-w-0 rounded-2xl overflow-hidden flex flex-col items-center justify-center bg-[#202c33]"
            style={{ minHeight: '100px' }}>
            <div className={`rounded-full flex items-center justify-center font-bold ${sizeClasses[size].split(' ')[1]} ${sizeClasses[size].split(' ')[2]}`}
                style={{ background: participant?.color || '#3d3470' }}>
                <span className={`${sizeClasses[size].split(' ')[0]} font-bold text-white`}>{initials}</span>
            </div>
            
            {/* Overlay Name */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <span className="text-white text-[14px] font-medium truncate drop-shadow-md">
                    {participant?.name || 'Unknown'}
                </span>
                {participant?.isMuted && (
                    <div className="w-6 h-6 rounded-full bg-red-500/90 flex items-center justify-center shrink-0">
                        <Icons.MicOff size={14} className="text-white" />
                    </div>
                )}
            </div>
        </div>
    );
};

const OverflowTile = ({ count, onClick }) => (
    <div
        onClick={onClick}
        className="relative flex-1 min-w-0 rounded-2xl overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:brightness-110 transition-all active:scale-95 bg-[#202c33]"
        style={{ minHeight: '100px' }}
    >
        <span className="text-white text-[28px] font-bold">+{count}</span>
        <p className="text-white/60 text-[13px] mt-1 font-medium">more</p>
    </div>
);

const DynamicCallGrid = ({ participants = [], onOverflowClick }) => {
    const total = participants.length;
    const overflow = total > MAX_VISIBLE ? total - MAX_VISIBLE + 1 : 0;
    const visible = overflow > 0 ? participants.slice(0, MAX_VISIBLE - 1) : participants;

    // ── Layout rules ──────────────────────────────────────────────
    const getGridStyle = () => {
        if (total === 1)    return { rows: [[visible[0]]], size: 'lg' };
        if (total === 2)    return { rows: [visible], size: 'md' };
        if (total === 3)    return { rows: [visible.slice(0, 2), visible.slice(2)], size: 'md' };
        if (total === 4)    return { rows: [visible.slice(0, 2), visible.slice(2, 4)], size: 'md' };
        if (total <= 6)     return { rows: [visible.slice(0, 3), visible.slice(3)], size: 'sm' };
        // overflow
        const vis = [...visible];
        const r1 = vis.slice(0, 3);
        const r2 = vis.slice(3);
        return { rows: [r1, r2], size: 'sm', overflow: true };
    };

    const { rows, size, overflow: hasOverflow } = getGridStyle();

    return (
        <div className="flex flex-col gap-3 w-full h-full max-w-[900px] mx-auto px-4 pb-4">
            {rows.map((row, ri) => (
                <div key={ri} className="flex gap-3 flex-1 h-full">
                    {row.map((p, pi) => (
                        <ParticipantTile key={p?.id ?? pi} participant={p} size={size} />
                    ))}
                    {/* Overflow tile on last row */}
                    {hasOverflow && ri === rows.length - 1 && overflow > 0 && (
                        <OverflowTile count={overflow} onClick={onOverflowClick} />
                    )}
                </div>
            ))}
        </div>
    );
};

export default DynamicCallGrid;
