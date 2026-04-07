import React, { useState } from 'react';
import { Icons } from '@constants/icons';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * WhatsApp Premium Clone - Voice Note Bubble (Upgraded)
 * Featuring Playback Speed, Blue Mic logic, and Reaction support.
 */
const VoiceBubble = ({ duration, time, isMine, status, avatar, reaction }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1); // 1, 1.5, 2

    const toggleSpeed = () => {
        if (speed === 1) setSpeed(1.5);
        else if (speed === 1.5) setSpeed(2);
        else setSpeed(1);
    };

    return (
        <div className={`relative flex flex-col ${isMine ? 'items-end' : 'items-start'} mb-4`}>
            <div className={`p-2 rounded-2xl shadow-md flex items-center gap-3 relative border border-white/5 min-w-[280px]
                ${isMine ? 'bg-bg-bubble-out rounded-tr-none' : 'bg-bg-bubble-in rounded-tl-none'}
            `}>
                {/* Sender Avatar with Blue Mic Overlay */}
                <div className="relative flex-shrink-0">
                    <img
                        src={avatar || "https://i.pravatar.cc/150"}
                        className="w-12 h-12 rounded-full border border-white/10 object-cover"
                        alt="voice-sender"
                    />
                    <div className={`absolute -bottom-1 -right-1 rounded-full p-[2.5px] border border-[#111b21] shadow-sm
                        ${status === 'read' ? 'bg-[#53bdeb]' : 'bg-[#8696a0]'}
                    `}>
                        <Icons.Mic size={12} strokeWidth={3} className="text-[#111b21]" />
                    </div>
                </div>

                {/* Controls & Waveform */}
                <div className="flex-1 flex flex-col pt-1">
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="text-white/90 transition-transform active:scale-90"
                        >
                            {isPlaying ? <Icons.Pause size={28} fill="currentColor" /> : <Icons.Play size={28} fill="currentColor" />}
                        </button>

                        {/* Animated Waveform */}
                        <div className="h-8 flex-1 flex items-center gap-[1.5px] px-1">
                            {[...Array(22)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: "30%" }}
                                    animate={{
                                        height: isPlaying ? [`${Math.random() * 80 + 20}%`, `${Math.random() * 80 + 20}%`] : "40%",
                                        backgroundColor: isPlaying ? (isMine ? "#fff" : "#53bdeb") : (isMine ? "rgba(255,255,255,0.4)" : "rgba(134,150,160,0.4)")
                                    }}
                                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                                    className="w-[2.5px] rounded-full"
                                />
                            ))}
                        </div>

                        {/* Playback Speed Badge (WhatsApp Premium Style) */}
                        <button
                            onClick={toggleSpeed}
                            className="bg-black/20 hover:bg-black/40 text-[11px] font-bold text-white px-1.5 py-0.5 rounded-full transition-colors min-w-[32px]"
                        >
                            {speed}x
                        </button>
                    </div>

                    {/* Footer Metadata */}
                    <div className="flex justify-between items-center px-1 mt-0.5">
                        <span className="text-[11px] font-medium text-white/70">
                            {duration}
                        </span>
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] text-white/60">
                                {time}
                            </span>
                            {isMine && (
                                <Icons.CheckCheck size={15} className={status === 'read' ? "text-[#53bdeb]" : "text-white/40"} strokeWidth={2.5} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Premium Reaction Badge --- */}
            <AnimatePresence>
                {reaction && (
                    <motion.div
                        initial={{ scale: 0, y: -5 }}
                        animate={{ scale: 1, y: 0 }}
                        className={`absolute -bottom-2 ${isMine ? 'right-4' : 'left-4'} bg-bg-surface border border-border-main rounded-full px-1.5 py-0.5 shadow-xl flex items-center gap-1 z-30`}
                    >
                        <span className="text-[13px]">{reaction}</span>
                        <span className="text-[10px] text-[#8696a0] font-bold">1</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VoiceBubble;