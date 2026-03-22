import React, { useState } from 'react';
import { Icons } from '@constants/icons';
import { motion } from 'framer-motion';
import ToggleSwitch from '@shared/ui/buttons/ToggleSwitch';

/**
 * EventCreation — full-screen "Create event" form.
 * Theme-aware: uses CSS vars (bg-bg-surface, text-text-primary, etc.)
 * Matches the reference screen exactly.
 */
const EventCreation = ({ onClose, onSend }) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    const [eventName, setEventName]     = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation]       = useState('');
    const [waCallLink, setWaCallLink]   = useState(false);
    const [allowGuests, setAllowGuests] = useState(false);

    const canSend = eventName.trim().length > 0;

    const handleSend = () => {
        if (!canSend) return;
        const d = new Date();
        onSend?.({
            name: eventName.trim(),
            description: description.trim(),
            date: d.getDate(),
            month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
            time: timeStr,
            location: location.trim(),
            goingCount: '1',
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[700] flex items-center justify-center bg-black/60 px-4 py-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="w-full max-w-md bg-bg-surface rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
            {/* Header */}
            <header className="flex items-center gap-3 px-3 py-3 border-b border-border-main shrink-0 bg-bg-surface">
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-bg-hover active:bg-bg-hover transition-colors"
                >
                    <Icons.ArrowLeft size={22} className="text-text-primary" />
                </button>
                <h1 className="text-[17px] font-medium text-text-primary">Create event</h1>
            </header>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-bg-surface">

                {/* Event name + description */}
                <div className="px-5 pt-6 pb-5 border-b border-border-main/30">
                    <div className="flex items-start gap-3">
                        {/* Green cursor accent bar */}
                        <div className="w-[3px] rounded-full shrink-0 mt-1 bg-accent" style={{ minHeight: 32 }} />
                        <div className="flex-1">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Event name"
                                value={eventName}
                                onChange={e => setEventName(e.target.value)}
                                className="w-full outline-none text-[24px] font-bold text-text-primary placeholder:text-text-secondary/50 bg-transparent"
                                style={{ caretColor: 'var(--accent)' }}
                            />
                            <input
                                type="text"
                                placeholder="Description (Optional)"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full outline-none text-[15px] text-text-secondary placeholder:text-text-secondary/40 bg-transparent mt-1"
                                style={{ caretColor: 'var(--accent)' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Date & Time */}
                <div className="px-5 py-4 border-b border-border-main/20 flex items-center gap-5">
                    <Icons.Calendar size={22} className="text-text-secondary shrink-0" />
                    <div className="flex-1 flex items-center justify-between">
                        <span className="text-[15px] text-text-primary">{dateStr}</span>
                        <span className="text-[15px] text-text-primary">{timeStr}</span>
                    </div>
                </div>

                {/* Add end time */}
                <div className="px-5 py-4 border-b border-border-main/20 pl-[72px]">
                    <button className="text-[15px] text-text-secondary hover:text-text-primary transition-colors">
                        Add end time
                    </button>
                </div>

                {/* Location */}
                <div className="px-5 py-4 border-b border-border-main/20 flex items-center gap-5">
                    <Icons.MapPin size={22} className="text-text-secondary shrink-0" />
                    <input
                        type="text"
                        placeholder="Add location"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        className="flex-1 outline-none text-[15px] text-text-primary placeholder:text-text-secondary/40 bg-transparent"
                        style={{ caretColor: 'var(--accent)' }}
                    />
                </div>

                {/* WhatsApp Call Link */}
                <div className="px-5 py-4 border-b border-border-main/30 flex items-center gap-5">
                    <Icons.Video size={22} className="text-text-secondary shrink-0" />
                    <span className="flex-1 text-[15px] text-text-primary">WhatsApp call link</span>
                    <ToggleSwitch checked={waCallLink} onChange={() => setWaCallLink(v => !v)} />
                </div>

                {/* Thick divider */}
                <div className="h-2 bg-bg-hover/50" />

                {/* Reminder */}
                <div className="px-5 py-4 border-b border-border-main/20 flex items-center gap-5">
                    <Icons.Bell size={22} className="text-text-secondary shrink-0" />
                    <div className="flex-1">
                        <p className="text-[15px] text-text-primary font-medium">Reminder</p>
                        <p className="text-[13px] text-text-secondary mt-0.5">1 hour before</p>
                    </div>
                </div>

                {/* Allow guests */}
                <div className="px-5 py-4 flex items-center gap-5">
                    <div className="w-[22px] shrink-0" />
                    <div className="flex-1">
                        <p className="text-[15px] text-text-primary font-medium">Allow guests</p>
                        <p className="text-[13px] text-text-secondary mt-0.5">Allow people to bring one additional guest</p>
                    </div>
                    <ToggleSwitch checked={allowGuests} onChange={() => setAllowGuests(v => !v)} />
                </div>

                {/* Bottom padding for FAB */}
                <div className="h-6" />
            </div>

            {/* Footer Send button */}
            <div className="px-4 py-3 border-t border-border-main/20 flex justify-end shrink-0">
                <button
                    disabled={!canSend}
                    onClick={handleSend}
                    className={`px-6 py-2.5 rounded-full font-semibold text-[15px] bg-accent text-white transition-all active:scale-95 ${
                        canSend ? 'opacity-100' : 'opacity-40 cursor-not-allowed'
                    }`}
                >
                    Send
                </button>
            </div>
            </motion.div>
        </motion.div>
    );
};

export default EventCreation;
