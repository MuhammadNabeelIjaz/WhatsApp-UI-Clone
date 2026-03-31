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
        lg: 'text-[32px]',
        md: 'text-[22px]',
        sm: 'text-[16px]',
    };
    const initials = (participant?.name || 'U')
        .split(' ')
        .map(w => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="relative flex-1 min-w-0 rounded-xl overflow-hidden flex flex-col items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', minHeight: '80px' }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold"
                style={{ background: participant?.color || '#3d3470' }}>
                <span className={`${sizeClasses[size]} font-bold text-white`}>{initials}</span>
            </div>
            <p className="text-white/80 text-[11px] font-medium mt-1.5 truncate max-w-[80%]">
                {participant?.name || 'Unknown'}
            </p>
            {participant?.isMuted && (
                <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-red-500/80 flex items-center justify-center">
                    <Icons.MicOff size={10} className="text-white" />
                </div>
            )}
        </div>
    );
};

const OverflowTile = ({ count, onClick }) => (
    <div
        onClick={onClick}
        className="relative flex-1 min-w-0 rounded-xl overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:brightness-125 transition-all active:scale-95"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', minHeight: '80px' }}
    >
        <span className="text-white text-[24px] font-bold">+{count}</span>
        <p className="text-white/60 text-[11px] mt-1">more</p>
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
        <div className="flex flex-col gap-2 w-full h-full px-3 py-2">
            {rows.map((row, ri) => (
                <div key={ri} className="flex gap-2 flex-1">
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
