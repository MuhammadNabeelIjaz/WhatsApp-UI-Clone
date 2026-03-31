// src/features/calls/components/ScheduleCallScreen.jsx
// Orchestrator — ~200 lines. Pickers and modal wrapper live in separate files.
import React, { useState } from 'react';
import { Icons } from '@constants/icons';
import useIsDesktop from '@shared/hooks/useIsDesktop';
import ScheduleModal from './ScheduleModal';
import DatePickerModal from './DatePickerModal';
import TimePickerModal from './TimePickerModal';

/* ─── helpers ─── */
const pad = (n) => String(n).padStart(2, '0');
const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const formatDate = (d) =>
    d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
const fmt12 = (h, m) => {
    const ampm = h >= 12 ? 'pm' : 'am';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${pad(m)} ${ampm}`;
};

/* ─── Options Picker (call type / reminder) ─── */
const OptionsPicker = ({ title, options, value, onSelect, onCancel, isDesktop }) => (
    <ScheduleModal isDesktop={isDesktop} onCancel={onCancel}>
        <div className="py-4">
            {!isDesktop && <div className="w-12 h-1 bg-border-main/40 rounded-full mx-auto mb-3" />}
            <p className="text-center text-[15px] font-semibold text-text-primary mb-2 px-6">{title}</p>
            {options.map(opt => (
                <button
                    key={opt.value}
                    onClick={() => onSelect(opt.value)}
                    className={`w-full flex items-center justify-between px-6 py-4 hover:bg-bg-hover transition-colors text-left ${opt.value === value ? 'text-accent font-semibold' : 'text-text-primary'}`}
                >
                    <span className="text-[15px]">{opt.label}</span>
                    {opt.value === value && <Icons.Check size={18} className="text-accent" />}
                </button>
            ))}
            {isDesktop && (
                <div className="px-6 pt-2">
                    <button onClick={onCancel} className="w-full py-3 rounded-xl border border-border-main/30 text-text-secondary text-[15px] hover:bg-bg-hover transition-colors">
                        Cancel
                    </button>
                </div>
            )}
        </div>
    </ScheduleModal>
);

/* ─── Toggle ─── */
const Toggle = ({ on, onToggle }) => (
    <button
        onClick={onToggle}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${on ? 'bg-accent' : 'bg-border-main/40'}`}
    >
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${on ? 'left-6' : 'left-0.5'}`} />
    </button>
);

/* ─── Scheduled Call Preview Bubble ─── */
const ScheduledBubble = ({ title, startDate, startTime, endTime, callType }) => {
    const month     = MONTHS[startDate.getMonth()];
    const day       = startDate.getDate();
    const isToday   = startDate.toDateString() === new Date().toDateString();
    const dateLabel = isToday ? 'Today' : startDate.toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: '2-digit' });
    const timeRange = `${fmt12(startTime.h, startTime.m)} – ${fmt12(endTime.h, endTime.m)}`;
    return (
        <div className="mx-6 mb-6 rounded-2xl overflow-hidden shadow-xl border border-white/5" style={{ background: 'var(--bg-bubble-out)' }}>
            <div className="p-4 flex gap-3 items-start">
                <div className="w-11 h-11 rounded-xl bg-black/30 border border-white/10 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[9px] font-extrabold text-[#00a884]">{month}</span>
                    <span className="text-[17px] font-extrabold leading-none text-white">{pad(day)}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold text-white leading-tight">{title || 'Call title'}</p>
                    <p className="text-[12px] text-[#8696a0] mt-0.5">{dateLabel}, {timeRange}</p>
                    <p className="text-[12px] text-[#8696a0]">WhatsApp {callType === 'video' ? 'Video' : 'Voice'} Call</p>
                    <div className="flex items-center gap-1.5 mt-1">
                        <img src="https://i.pravatar.cc/100?u=nb" className="w-4 h-4 rounded-full border border-bg-bubble-out" alt="" />
                        <span className="text-[11px] text-[#8696a0]">1 going</span>
                    </div>
                </div>
            </div>
            <div className="border-t border-white/10 grid grid-cols-2 divide-x divide-white/10">
                <button className="py-2.5 text-[13.5px] font-bold text-[#00e676] hover:bg-white/5 transition-colors">Join call</button>
                <button className="py-2.5 text-[13.5px] font-bold text-[#00e676] hover:bg-white/5 transition-colors">Add to calendar</button>
            </div>
        </div>
    );
};

/* ─── REMINDER / CALL TYPE OPTIONS ─── */
const REMINDER_OPTIONS = [
    { value: 'none', label: 'None' },
    { value: '5',    label: '5 minutes before' },
    { value: '10',   label: '10 minutes before' },
    { value: '15',   label: '15 minutes before' },
    { value: '30',   label: '30 minutes before' },
    { value: '60',   label: '1 hour before' },
    { value: '1440', label: '1 day before' },
];
const CALL_TYPE_OPTIONS = [
    { value: 'voice', label: 'Voice call' },
    { value: 'video', label: 'Video call' },
];

/* ────────────────── MAIN ORCHESTRATOR ────────────────── */
const ScheduleCallScreen = ({ onBack }) => {
    const isDesktop = useIsDesktop();
    const now   = new Date();
    const later = new Date(now.getTime() + 30 * 60000);

    const [callTitle, setCallTitle]     = useState("Muhammad Nabeel Ijaz's call");
    const [description, setDescription] = useState('');
    const [startDate, setStartDate]     = useState(new Date());
    const [startTime, setStartTime]     = useState({ h: now.getHours(), m: 30 });
    const [endDate, setEndDate]         = useState(new Date());
    const [endTime, setEndTime]         = useState({ h: later.getHours(), m: 0 });
    const [hasEndTime, setHasEndTime]   = useState(true);
    const [picker, setPicker]           = useState(null);
    const [callType, setCallType]       = useState('video');
    const [reminder, setReminder]       = useState('15');
    const [requestApproval, setRequestApproval] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const reminderLabel  = REMINDER_OPTIONS.find(r => r.value === reminder)?.label ?? '15 minutes before';
    const callTypeLabel  = CALL_TYPE_OPTIONS.find(c => c.value === callType)?.label ?? 'Video call';

    return (
        <div className="flex flex-col h-full w-full select-none overflow-hidden animate-fade-in z-[400] bg-bg-surface relative">

            <header className="px-4 py-4 flex items-center justify-between shrink-0 border-b border-border-main/10">
                <button onClick={onBack} className="p-2 rounded-full active:bg-bg-hover text-text-secondary">
                    <Icons.X size={24} />
                </button>
                <h1 className="text-[18px] font-bold text-text-primary">Schedule call</h1>
                <div className="w-10" />
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar pb-32">
                {/* Title & Description */}
                <div className="px-6 pt-6 pb-1 mb-2 border-b border-border-main/20 mx-6 mt-4">
                    <div className="flex items-center gap-2">
                        <input type="text" value={callTitle} onChange={e => setCallTitle(e.target.value)}
                            className="flex-1 bg-transparent text-[21px] outline-none font-light text-text-primary placeholder:opacity-40"
                            placeholder="Call title" />
                        {callTitle && (
                            <button onClick={() => setCallTitle('')} className="text-text-secondary opacity-50 hover:opacity-90">
                                <Icons.X size={18} />
                            </button>
                        )}
                    </div>
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)}
                        className="w-full bg-transparent text-[14px] outline-none text-text-secondary mt-1 pb-1 placeholder:opacity-50"
                        placeholder="Description (Optional)" />
                </div>

                {/* Date & Time */}
                <div className="px-6 py-4 border-b border-border-main/10">
                    <div className="flex items-center gap-4 py-2">
                        <Icons.Calendar size={20} className="text-text-secondary shrink-0" />
                        <button className="flex-1 text-[15.5px] text-text-primary font-medium text-left hover:text-accent transition-colors" onClick={() => setPicker('start-date')}>
                            {formatDate(startDate)}
                        </button>
                        <button className="text-[15px] text-text-primary hover:text-accent transition-colors font-medium" onClick={() => setPicker('start-time')}>
                            {fmt12(startTime.h, startTime.m)}
                        </button>
                    </div>
                    <div className="ml-[10px] h-6 border-l-2 border-dotted border-text-secondary/25 my-0.5" />
                    {hasEndTime && (
                        <div className="flex items-center gap-4 py-2">
                            <Icons.Calendar size={20} className="text-text-secondary shrink-0 opacity-0" />
                            <button className="flex-1 text-[15.5px] text-text-primary font-medium text-left hover:text-accent transition-colors" onClick={() => setPicker('end-date')}>
                                {formatDate(endDate)}
                            </button>
                            <button className="text-[15px] text-text-primary hover:text-accent transition-colors font-medium" onClick={() => setPicker('end-time')}>
                                {fmt12(endTime.h, endTime.m)}
                            </button>
                        </div>
                    )}
                    <button onClick={() => setHasEndTime(p => !p)} className="ml-9 mt-3 text-[13.5px] font-bold text-accent text-left hover:underline">
                        {hasEndTime ? 'Remove end time' : '+ Add end time'}
                    </button>
                </div>

                {/* Call Type */}
                <button onClick={() => setPicker('call-type')}
                    className="w-full flex items-center gap-5 px-6 py-5 border-b border-border-main/10 hover:bg-bg-hover/50 transition-colors text-left">
                    {callType === 'video' ? <Icons.Video size={22} className="text-text-secondary shrink-0" /> : <Icons.Phone size={22} className="text-text-secondary shrink-0" />}
                    <div className="flex flex-col flex-1">
                        <span className="text-[15.5px] text-text-primary font-medium">Call type</span>
                        <span className="text-[13px] text-text-secondary opacity-70">{callTypeLabel}</span>
                    </div>
                    <Icons.ChevronRight size={18} className="text-text-secondary opacity-40" />
                </button>

                {/* Reminder */}
                <button onClick={() => setPicker('reminder')}
                    className="w-full flex items-center gap-5 px-6 py-5 border-b border-border-main/10 hover:bg-bg-hover/50 transition-colors text-left">
                    <Icons.Bell size={22} className="text-text-secondary shrink-0" />
                    <div className="flex flex-col flex-1">
                        <span className="text-[15.5px] text-text-primary font-medium">Reminder</span>
                        <span className="text-[13px] text-text-secondary opacity-70">{reminderLabel}</span>
                    </div>
                    <Icons.ChevronRight size={18} className="text-text-secondary opacity-40" />
                </button>

                {/* Request Approval */}
                <div className="flex items-center gap-5 px-6 py-5 border-b border-border-main/10">
                    <Icons.Users size={22} className="text-text-secondary shrink-0" />
                    <div className="flex flex-col flex-1">
                        <span className="text-[15.5px] text-text-primary font-medium">Request approval to join</span>
                        <span className="text-[13px] text-text-secondary opacity-70">
                            {requestApproval ? 'Participants need host approval' : 'Anyone with the link can join'}
                        </span>
                    </div>
                    <Toggle on={requestApproval} onToggle={() => setRequestApproval(p => !p)} />
                </div>

                {/* Preview */}
                <button onClick={() => setShowPreview(p => !p)}
                    className="w-full flex items-center gap-5 px-6 py-4 hover:bg-bg-hover/50 transition-colors text-left border-b border-border-main/10">
                    <Icons.Eye size={20} className="text-text-secondary shrink-0" />
                    <span className="text-[14px] text-text-secondary">{showPreview ? 'Hide preview' : 'Preview invite'}</span>
                </button>
                {showPreview && (
                    <div className="pt-5 pb-2 bg-bg-surface/50">
                        <p className="text-[11px] uppercase tracking-wider text-text-secondary text-center mb-3 opacity-60">Preview</p>
                        <ScheduledBubble title={callTitle} startDate={startDate} startTime={startTime} endTime={endTime} callType={callType} />
                    </div>
                )}
            </div>

            {/* FAB */}
            <div className="absolute bottom-10 right-6">
                <button onClick={onBack} className="w-[56px] h-[56px] rounded-[18px] flex items-center justify-center shadow-xl bg-status-success active:scale-90 transition-all hover:brightness-110">
                    <Icons.Send size={24} className="text-[#0b141a]" strokeWidth={2.5} />
                </button>
            </div>

            {/* Pickers */}
            {picker === 'start-date' && <DatePickerModal value={startDate} onConfirm={(d) => { setStartDate(d); setPicker(null); }} onCancel={() => setPicker(null)} isDesktop={isDesktop} />}
            {picker === 'start-time' && <TimePickerModal value={startTime} onConfirm={(t) => { setStartTime(t); setPicker(null); }} onCancel={() => setPicker(null)} isDesktop={isDesktop} />}
            {picker === 'end-date'   && <DatePickerModal value={endDate}   onConfirm={(d) => { setEndDate(d);   setPicker(null); }} onCancel={() => setPicker(null)} isDesktop={isDesktop} />}
            {picker === 'end-time'   && <TimePickerModal value={endTime}   onConfirm={(t) => { setEndTime(t);   setPicker(null); }} onCancel={() => setPicker(null)} isDesktop={isDesktop} />}
            {picker === 'reminder'   && <OptionsPicker title="Reminder"  options={REMINDER_OPTIONS}  value={reminder}  onSelect={(v) => { setReminder(v);  setPicker(null); }} onCancel={() => setPicker(null)} isDesktop={isDesktop} />}
            {picker === 'call-type'  && <OptionsPicker title="Call type" options={CALL_TYPE_OPTIONS} value={callType}  onSelect={(v) => { setCallType(v);  setPicker(null); }} onCancel={() => setPicker(null)} isDesktop={isDesktop} />}
        </div>
    );
};

export default ScheduleCallScreen;
