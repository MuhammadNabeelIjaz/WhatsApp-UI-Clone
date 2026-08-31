import React from 'react';
import { Icons } from '@constants/icons';
import { motion } from 'framer-motion';
import HighlightedText from '@shared/ui/display/HighlightedText';

/**
 * WhatsApp Premium Clone - Text Bubble (Upgraded)
 * Handling Urdu fonts, Read Receipts, Floating Reaction Badges,
 * and in-chat search text highlighting .
 *
 * CoT: searchQuery is passed down from ChatDetail → renderBubble → TextBubble.
 * When the search bar is open and a query is active, HighlightedText wraps
 * matched substrings in a <mark> tag — zero impact when searchQuery is empty.
 */
const TextBubble = ({ text, time, isMine, status, isUrdu, reaction, searchQuery, senderName, senderColor, onSenderClick }) => {
    return (
        <div className={`relative flex flex-col ${isMine ? 'items-end' : 'items-start'} mb-2`}>
            <div
                className={`max-w-[85%] min-w-[80px] px-3 pt-2 pb-1 rounded-xl shadow-sm ring-1 ring-white/5 transition-all duration-300 flex flex-col relative
                    ${isMine
                        ? 'bg-bg-bubble-out text-text-primary rounded-tr-none'
                        : 'bg-bg-bubble-in text-text-primary rounded-tl-none'
                    }
                `}
            >
                {/* Sender Name (if provided) */}
                {senderName && (
                    <div 
                        className="text-[12.5px] font-semibold leading-tight mb-0.5 cursor-pointer hover:underline"
                        style={{ color: senderColor || (isMine ? '#34b7f1' : '#e53935') }}
                        onClick={onSenderClick}
                    >
                        {senderName}
                    </div>
                )}

                {/* Text Area with Urdu Support + Search Highlighting */}
                <p
                    className={`break-words leading-relaxed pr-2 ${isUrdu ? 'text-[19px] leading-[1.8] text-right' : 'text-[14.5px]'}`}
                    style={isUrdu ? { fontFamily: "'Jameel Noori Nastaleeq', 'Gulzar', serif" } : {}}
                >
                    <HighlightedText text={text} searchQuery={searchQuery} />
                </p>

                {/* Bottom Info Row (Time + Status) */}
                <div className="flex justify-end items-center gap-1 mt-0.5 -mb-0.5 ml-6">
                    <span className="text-[10px] opacity-60 font-medium whitespace-nowrap">
                        {time}
                    </span>

                    {/* Status Icons for Outgoing Messages Only */}
                    {isMine && (
                        <div className="flex items-center">
                            {status === 'read' ? (
                                <Icons.CheckCheck size={15} className="text-[#53bdeb]" strokeWidth={2.5} />
                            ) : status === 'delivered' ? (
                                <Icons.CheckCheck size={15} className="opacity-60" strokeWidth={2.5} />
                            ) : (
                                <Icons.Check size={15} className="opacity-60" strokeWidth={2.5} />
                            )}
                        </div>
                    )}
                </div>

                {/* --- Premium Reaction Badge --- */}
                {reaction && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`absolute -bottom-3 ${isMine ? 'right-4' : 'left-4'} bg-bg-surface border border-border-main rounded-full px-1.5 py-0.5 shadow-lg flex items-center gap-1 z-20`}
                    >
                        <span className="text-[13px]">{reaction}</span>
                        {/* Multiple reactions count placeholder */}
                        <span className="text-[10px] text-text-secondary font-bold">1</span>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default TextBubble;
