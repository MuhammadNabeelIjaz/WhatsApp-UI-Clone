import React from 'react';
import { Icons } from '@constants/icons';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * WhatsApp Premium Clone - Event Bubble (Upgraded)
 * Exact match for the "Hello" event from your video, including the "Edit event" button.
 */
const EventBubble = ({ name, time, date, month, isMine, reaction, goingCount }) => {
    return (
        <div className={`relative flex flex-col ${isMine ? 'items-end' : 'items-start'} mb-4 group`}>
            <div
                className={`max-w-[300px] rounded-2xl shadow-lg border border-white/5 flex flex-col overflow-hidden transition-all duration-300
                    ${isMine ? 'bg-bg-bubble-out rounded-tr-none' : 'bg-bg-bubble-in rounded-tl-none'}
                `}
            >
                {/* --- Top Event Info Section --- */}
                <div className="p-4 flex gap-4 items-center">
                    {/* Calendar Icon Style Box */}
                    <div className="w-12 h-12 rounded-xl bg-black/30 flex flex-col items-center justify-center border border-white/5 shadow-inner">
                        <span className="text-[10px] font-bold uppercase text-[#00a884]">
                            {month || 'MAR'}
                        </span>
                        <span className="text-[19px] font-extrabold leading-none text-white">
                            {date || '10'}
                        </span>
                    </div>

                    {/* Event Text Details */}
                    <div className="flex flex-col flex-1 min-w-0">
                        <h4 className="text-[16px] font-bold text-white leading-tight truncate">
                            {name || 'Hello'}
                        </h4>
                        <p className="text-[13px] text-[#8696a0] mt-0.5">
                            Today, {time || '3:00 pm'}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                            <div className="flex -space-x-1.5">
                                <img src="https://i.pravatar.cc/100?u=a" className="w-4 h-4 rounded-full border border-border-main" alt="user" />
                            </div>
                            <span className="text-[12px] text-[#8696a0] font-medium">
                                {goingCount || '1'} going
                            </span>
                        </div>
                    </div>

                    {/* Arrow for interaction */}
                    <Icons.ChevronRight size={18} className="text-[#8696a0] opacity-50" />
                </div>

                {/* --- Action Button --- */}
                <button className="w-full py-2.5 border-t border-white/5 text-[#00e676] text-[14.5px] font-bold hover:bg-white/5 active:bg-white/10 transition-colors flex items-center justify-center gap-2">
                    Edit event
                </button>
            </div>

            {/* --- Premium Reaction Badge --- */}
            <AnimatePresence>
                {reaction && (
                    <motion.div
                        initial={{ scale: 0, y: -5 }}
                        animate={{ scale: 1, y: 0 }}
                        className={`absolute -bottom-2 ${isMine ? 'right-4' : 'left-4'} bg-bg-surface border border-border-main rounded-full px-2 py-0.5 shadow-xl flex items-center gap-1 z-30`}
                    >
                        <span className="text-[13px] leading-none">{reaction}</span>
                        <span className="text-[10px] text-[#8696a0] font-bold">1</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EventBubble;