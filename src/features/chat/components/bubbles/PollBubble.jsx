import React, { useState } from 'react';
import { Icons } from '@constants/icons';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * PollBubble — multi-select, animated progress on click, WA reference match.
 */
const PollBubble = ({ question, options, time, isMine, reaction, senderName, senderColor, onSenderClick, allowMultiple = false }) => {
    const [selected, setSelected] = useState(new Set());
    const [voted, setVoted] = useState(false);

    const toggle = (index) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(index)) {
                next.delete(index);
            } else {
                if (!allowMultiple) {
                    next.clear();
                }
                next.add(index);
            }
            return next;
        });
        if (!voted) setVoted(true);
    };

    // Compute totals for percentage display
    const totalVotes = options.reduce((sum, o) => sum + (o.count || parseInt(o.votes) || 0), 0) + selected.size;

    const getPercent = (option, index) => {
        const base = o => o.count || parseInt(o.votes) || 0;
        const myVote = selected.has(index) ? 1 : 0;
        const total = totalVotes || 1;
        return Math.round(((base(option) + myVote) / total) * 100);
    };

    return (
        <div className={`relative flex flex-col ${isMine ? 'items-end' : 'items-start'} mb-5 group`}>
            <div className={`max-w-[85%] sm:max-w-[420px] p-3 rounded-2xl shadow-md border border-border-main/20
                ${isMine ? 'bg-bg-bubble-out rounded-tr-none' : 'bg-bg-bubble-in rounded-tl-none'}`}
            >
                {/* Sender Name */}
                {senderName && (
                    <div 
                        className="text-[12.5px] font-semibold leading-tight mb-2 cursor-pointer hover:underline"
                        style={{ color: senderColor || (isMine ? '#34b7f1' : '#e53935') }}
                        onClick={onSenderClick}
                    >
                        {senderName}
                    </div>
                )}
                {/* Question */}
                <h4 className="text-[16.5px] font-semibold text-text-primary mb-1.5 leading-tight">
                    {question}
                </h4>

                {/* Sub-header */}
                {allowMultiple && (
                    <div className="flex items-center gap-1.5 mb-4 opacity-70">
                        <Icons.Info size={12} className="text-text-secondary" />
                        <span className="text-[12px] text-text-secondary font-medium">Select one or more</span>
                    </div>
                )}

                {/* Options */}
                <div className="flex flex-col gap-4">
                    {options.map((option, index) => {
                        const isChosen = selected.has(index);
                        const pct = voted ? getPercent(option, index) : 0;
                        return (
                            <div
                                key={index}
                                onClick={() => toggle(index)}
                                className="relative cursor-pointer select-none"
                            >
                                <div className="flex items-center justify-between mb-2 z-10 relative px-1">
                                    <div className="flex items-center gap-3">
                                        {/* Radio circle */}
                                        <div className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-all duration-200
                                            ${isChosen ? 'border-[#00a884]' : 'border-gray-500'}`}>
                                            {isChosen && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="w-3 h-3 rounded-full bg-[#00a884]"
                                                />
                                            )}
                                        </div>
                                        <span className="text-[15px] text-text-primary font-medium">
                                            {option.text}
                                        </span>
                                    </div>
                                    {voted && (
                                        <span className="text-[13px] opacity-70 text-text-primary/90 font-semibold ml-2">
                                            {pct}%
                                        </span>
                                    )}
                                </div>

                                {/* Progress bar — always visible after first vote */}
                                <div className="h-[6px] w-full bg-black/30 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: voted ? `${pct}%` : '0%' }}
                                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                                        className={`h-full rounded-full transition-colors duration-300 ${isChosen ? 'bg-[#00a884]' : 'bg-text-secondary/40'}`}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-1 flex flex-col gap-1">
                    <button className="w-full py-2 text-[#53bdeb] text-[14.5px] font-bold hover:bg-white/5 rounded-md transition-colors border-t border-border-main/20">
                        View votes
                    </button>
                    <div className="flex justify-end items-center gap-1.5 px-1 mt-1">
                        <span className="text-[10px] text-text-secondary font-semibold">{time}</span>
                        {isMine && <Icons.CheckCheck size={16} className="text-[#53bdeb]" strokeWidth={2.5} />}
                    </div>
                </div>
            </div>

            {/* Reaction badge */}
            <AnimatePresence>
                {reaction && (
                    <motion.div
                        initial={{ scale: 0, y: -5 }}
                        animate={{ scale: 1, y: 0 }}
                        className={`absolute -bottom-2 ${isMine ? 'right-4' : 'left-4'} bg-bg-surface border border-border-main rounded-full px-2 py-0.5 shadow-xl flex items-center gap-1.5 z-30`}
                    >
                        <span className="text-[14px] leading-none">{reaction}</span>
                        <span className="text-[11px] text-text-secondary font-bold">1</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PollBubble;
