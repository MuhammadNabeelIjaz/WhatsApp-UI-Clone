// src/features/calls/components/DatePickerModal.jsx
import React, { useState } from 'react';
import { Icons } from '@constants/icons';
import ScheduleModal from './ScheduleModal';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const DatePickerModal = ({ value, onConfirm, onCancel, isDesktop }) => {
    const [selected, setSelected]   = useState(new Date(value));
    const [viewMonth, setViewMonth] = useState(new Date(value));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const year        = viewMonth.getFullYear();
    const month       = viewMonth.getMonth();
    const firstDay    = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return (
        <ScheduleModal isDesktop={isDesktop} onCancel={onCancel}>
            <div className="px-5 pt-5 pb-6">
                {!isDesktop && <div className="w-12 h-1 bg-border-main/40 rounded-full mx-auto mb-4" />}

                <div className="flex items-center justify-between px-1 mb-4">
                    <button onClick={() => setViewMonth(new Date(year, month - 1, 1))} className="p-2 hover:bg-bg-hover rounded-full">
                        <Icons.ChevronLeft size={20} className="text-text-primary" />
                    </button>
                    <span className="text-[16px] font-semibold text-text-primary">{MONTHS[month]} {year}</span>
                    <button onClick={() => setViewMonth(new Date(year, month + 1, 1))} className="p-2 hover:bg-bg-hover rounded-full">
                        <Icons.ChevronRight size={20} className="text-text-primary" />
                    </button>
                </div>

                <div className="grid grid-cols-7 mb-1">
                    {['S','M','T','W','T','F','S'].map((d, i) => (
                        <div key={i} className="text-center text-[12px] font-bold text-text-secondary py-1">{d}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-y-1 mb-5">
                    {cells.map((d, i) => {
                        if (!d) return <div key={i} />;
                        const thisDate = new Date(year, month, d);
                        const isPast   = thisDate < today;
                        const isSel    = d === selected.getDate() && month === selected.getMonth() && year === selected.getFullYear();
                        return (
                            <div
                                key={i}
                                onClick={() => !isPast && setSelected(new Date(year, month, d))}
                                className={`flex items-center justify-center h-9 rounded-full text-[14px] transition-colors
                                    ${isPast ? 'opacity-25 cursor-not-allowed' : 'cursor-pointer hover:bg-bg-hover'}
                                    ${isSel ? 'bg-accent text-white font-bold' : 'text-text-primary'}`}
                            >
                                {d}
                            </div>
                        );
                    })}
                </div>

                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-3 rounded-2xl border border-border-main/30 text-text-secondary text-[15px]">Cancel</button>
                    <button onClick={() => onConfirm(selected)} className="flex-1 py-3 rounded-2xl bg-accent text-white text-[15px] font-semibold">Set</button>
                </div>
            </div>
        </ScheduleModal>
    );
};

export default DatePickerModal;
