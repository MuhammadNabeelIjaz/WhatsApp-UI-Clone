import React from 'react';
import { Icons } from '@constants/icons';
import { motion, AnimatePresence } from 'framer-motion';
import HighlightedText from '@shared/ui/display/HighlightedText';

/**
 * WhatsApp Premium Clone - Reply/Quote Bubble (Upgraded)
 * Exact match for group chat replies with contact colors and reaction support.
 * Added searchQuery prop for in-chat search highlighting.
 *
 * CoT: The main "message" body of a reply is searchable.
 * The quoted replyTo.text is NOT highlighted — it's context, not the matched message.
 */
const ReplyBubble = ({ sender, replyTo, message, time, isMine, color, reaction, hasImage, onQuoteClick, searchQuery, senderName, senderColor, onSenderClick }) => {
    return (
        <div className={`relative flex flex-col ${isMine ? 'items-end' : 'items-start'} mb-4 group`}>
            {/* Sender Name */}
            {senderName && (
                <div 
                    className="text-[12.5px] font-semibold leading-tight mb-1 cursor-pointer hover:underline"
                    style={{ color: senderColor || (isMine ? '#34b7f1' : '#e53935') }}
                    onClick={onSenderClick}
                >
                    {senderName}
                </div>
            )}

            <div className={`max-w-[85%] p-1.5 rounded-2xl shadow-md border border-border-main/20 transition-all
                ${isMine ? 'bg-bg-bubble-out rounded-tr-none' : 'bg-bg-bubble-in rounded-tl-none'}`}
            >
                {/* --- Quoted Message Box --- */}
                <div
                    role="button"
                    tabIndex={0}
                    onClick={onQuoteClick}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onQuoteClick?.(); } }}
                    className="bg-black/10 dark:bg-black/20 rounded-lg p-2 mb-1.5 border-l-[4px] cursor-pointer hover:bg-black/20 dark:hover:bg-black/30 transition-all flex justify-between gap-2 overflow-hidden"
                    style={{ borderColor: color || '#00a884' }}
                >
                    <div className="flex flex-col min-w-0">
                        <span className="text-[12.5px] font-bold truncate" style={{ color: color || '#00a884' }}>
                            {replyTo.name}
                        </span>
                        <p className="text-[13px] text-text-secondary truncate leading-relaxed">
                            {replyTo.text}
                        </p>
                    </div>

                    {/* Quoted Image Thumbnail (if reply is to an image) */}
                    {hasImage && (
                        <div className="w-10 h-10 rounded-md overflow-hidden shrink-0">
                            <img src="https://placehold.co/100x100/png" className="w-full h-full object-cover opacity-60" alt="thumb" />
                        </div>
                    )}
                </div>

                {/* --- Main Message Body with Search Highlighting --- */}
                <div className="px-1.5 pb-0.5">
                    <p className="text-[14.5px] text-text-primary leading-normal break-words">
                        <HighlightedText text={message} searchQuery={searchQuery} />
                    </p>

                    {/* Metadata Row */}
                    <div className="flex justify-end items-center gap-1 mt-1">
                        <span className="text-[10px] opacity-80 font-medium text-text-secondary uppercase">
                            {time}
                        </span>
                        {isMine && (
                            <Icons.CheckCheck size={15} className="text-[#53bdeb]" strokeWidth={2.5} />
                        )}
                    </div>
                </div>
            </div>

            {/* --- Premium Reaction Badge --- */}
            <AnimatePresence>
                {reaction && (
                    <motion.div
                        initial={{ scale: 0, y: -5 }}
                        animate={{ scale: 1, y: 0 }}
                        className={`absolute -bottom-2 ${isMine ? 'right-4' : 'left-4'} bg-bg-surface border border-border-main rounded-full px-2 py-0.5 shadow-xl flex items-center gap-1 z-30`}
                    >
                        <span className="text-[13px]">{reaction}</span>
                        <span className="text-[10px] text-text-secondary font-bold">1</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ReplyBubble;
