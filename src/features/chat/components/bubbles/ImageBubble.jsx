import React from 'react';
import { Icons } from '@constants/icons';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * WhatsApp Premium Clone - Image Bubble (Upgraded & Working)
 * Features: High-fidelity zoom, Glassmorphism download, and Reaction badges.
 */
const ImageBubble = ({ src, caption, time, isMine, status, reaction, senderName, senderColor, onSenderClick }) => {
    return (
        <div className={`relative flex flex-col ${isMine ? 'items-end' : 'items-start'} mb-6 group`}>
            <div
                className={`max-w-[320px] p-[3px] rounded-2xl shadow-lg ring-1 ring-white/5 overflow-hidden transition-all duration-300
                    ${isMine
                        ? 'bg-bg-bubble-out rounded-tr-none'
                        : 'bg-bg-bubble-in rounded-tl-none'
                    }
                `}
            >
                {/* Sender Name */}
                {senderName && (
                    <div 
                        className="text-[12.5px] font-semibold leading-tight mb-1 mt-1 ml-1 cursor-pointer hover:underline"
                        style={{ color: senderColor || (isMine ? '#34b7f1' : '#e53935') }}
                        onClick={onSenderClick}
                    >
                        {senderName}
                    </div>
                )}

                {/* --- Image Container --- */}
                <div className="relative rounded-xl overflow-hidden cursor-pointer group/img">
                    <img
                        src={src || "https://placehold.co/600x400/png"}
                        className="w-full object-cover max-h-[420px] min-h-[150px] transition-transform duration-700 group-hover/img:scale-105"
                        alt="Shared media"
                        loading="lazy"
                    />

                    {/* Gradient Overlay for Visibility (Time/Icons) */}
                    {!caption && (
                        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                    )}

                    {/* Download Button - Premium Glassmorphism */}
                    <button className="absolute top-2 right-2 p-2 bg-black/40 backdrop-blur-md rounded-full text-white opacity-0 group-hover/img:opacity-100 transition-all hover:bg-black/60 active:scale-90 shadow-xl border border-white/10">
                        <Icons.Download size={18} strokeWidth={2.5} />
                    </button>

                    {/* Metadata Overlay (Displayed if no caption exists) */}
                    {!caption && (
                        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 flex items-center gap-1 z-10">
                            <span className="text-[11px] text-white/90 font-medium tracking-tight">{time}</span>
                            {isMine && (
                                <div className="flex items-center">
                                    {status === 'read' ? (
                                        <Icons.CheckCheck size={15} className="text-[#53bdeb]" strokeWidth={2.5} />
                                    ) : (
                                        <Icons.CheckCheck size={15} className="text-white/70" strokeWidth={2.5} />
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* --- Caption Section --- */}
                {caption && (
                    <div className="px-2 py-2 flex flex-col relative min-w-[120px]">
                        <p className="text-[14.5px] text-white/95 leading-[1.4] break-words pr-1">
                            {caption}
                        </p>

                        <div className="flex justify-end items-center gap-1 mt-1 -mb-0.5">
                            <span className="text-[10px] opacity-60 font-semibold text-white/70 uppercase tracking-tighter">
                                {time}
                            </span>
                            {isMine && (
                                <div className="flex items-center">
                                    {status === 'read' ? (
                                        <Icons.CheckCheck size={15} className="text-[#53bdeb]" strokeWidth={2.5} />
                                    ) : (
                                        <Icons.CheckCheck size={15} className="opacity-60 text-white/70" strokeWidth={2.5} />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* --- Premium Reaction Badge --- */}
            <AnimatePresence>
                {reaction && (
                    <motion.div
                        initial={{ scale: 0, y: 10 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0, y: 10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className={`absolute -bottom-3 ${isMine ? 'right-4' : 'left-4'} bg-bg-surface border border-border-main rounded-full px-2 py-0.5 shadow-2xl flex items-center gap-1.5 z-30 ring-1 ring-black/20`}
                    >
                        <span className="text-[14px] leading-none select-none">{reaction}</span>
                        <span className="text-[11px] text-[#8696a0] font-bold">1</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ImageBubble;