// src/features/calls/components/TimePickerModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import ScheduleModal from './ScheduleModal';

const pad = (n) => String(n).padStart(2, '0');

const Drum = ({ items, value, onChange, label }) => {
    const ITEM_H = 40;
    const VISIBLE = 5;
    const ref = useRef(null);
    const idx = items.indexOf(value);
    const initialIdx = useRef(idx);

    useEffect(() => {
        if (ref.current) {
            ref.current.scrollTop = Math.max(0, initialIdx.current - 2) * ITEM_H;
        }
    }, []);

    const handleScroll = () => {
        if (!ref.current) return;
        const i = Math.round(ref.current.scrollTop / ITEM_H);
        const clamped = Math.max(0, Math.min(i + 2, items.length - 1));
        onChange(items[clamped]);
    };

    return (
        <div className="flex flex-col items-center gap-1">
            <span className="text-[11px] text-text-secondary font-semibold uppercase tracking-widest mb-1">{label}</span>
            <div
                ref={ref}
                onScroll={handleScroll}
                className="overflow-y-scroll no-scrollbar"
                style={{ height: ITEM_H * VISIBLE, scrollSnapType: 'y mandatory' }}
            >
                {items.map((item, i) => {
                    const isSelected = item === value;
                    return (
                        <div
                            key={i}
                            onClick={() => onChange(item)}
                            style={{ height: ITEM_H, scrollSnapAlign: 'center' }}
                            className={`flex items-center justify-center cursor-pointer transition-all select-none
                                ${isSelected ? 'text-accent text-[22px] font-bold' : 'text-text-secondary text-[18px]'}`}
                        >
                            {typeof item === 'number' ? pad(item) : item}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const TimePickerModal = ({ value, onConfirm, onCancel, isDesktop }) => {
    const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
    const MINS  = Array.from({ length: 60 }, (_, i) => i);
    const AMPM  = ['am', 'pm'];
    const [h, setH]         = useState(() => value.h % 12 || 12);
    const [m, setM]         = useState(value.m);
    const [ampm, setAmpm]   = useState(value.h >= 12 ? 'pm' : 'am');

    const confirm = () => {
        let hour = h % 12;
        if (ampm === 'pm') hour += 12;
        onConfirm({ h: hour, m });
    };

    return (
        <ScheduleModal isDesktop={isDesktop} onCancel={onCancel}>
            <div className="px-6 pt-5 pb-6">
                {!isDesktop && <div className="w-12 h-1 bg-border-main/40 rounded-full mx-auto mb-5" />}
                <p className="text-center text-[16px] font-semibold text-text-primary mb-5">Select Time</p>
                <div className="flex items-center justify-center gap-4 mb-6">
                    <Drum items={HOURS} value={h} onChange={setH} label="Hour" />
                    <span className="text-[26px] font-bold text-text-primary mb-4">:</span>
                    <Drum items={MINS} value={m} onChange={setM} label="Min" />
                    <Drum items={AMPM} value={ampm} onChange={setAmpm} label="AM/PM" />
                </div>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-3 rounded-2xl border border-border-main/30 text-text-secondary text-[15px] font-medium hover:bg-bg-hover transition-colors">Cancel</button>
                    <button onClick={confirm}  className="flex-1 py-3 rounded-2xl bg-accent text-white text-[15px] font-semibold hover:opacity-90 transition-opacity">Set</button>
                </div>
            </div>
        </ScheduleModal>
    );
};

export default TimePickerModal;
