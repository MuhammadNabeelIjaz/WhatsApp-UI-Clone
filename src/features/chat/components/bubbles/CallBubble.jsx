import React from 'react';
import { Icons } from '@constants/icons';
/**
 * WhatsApp Premium Clone - Call Log Bubble (Upgraded)
 * Exact match for "No answer" and "Missed call" logs from user video.
 */
const CallBubble = ({ type, time, isMine, isVideo, isMissed, senderName, senderColor, onSenderClick }) => {
    return (
        <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} mb-1`}>
            <div className={`max-w-[280px] p-3 rounded-2xl shadow-sm flex flex-col border border-white/5 transition-all
                ${isMine ? 'bg-bg-bubble-out rounded-tr-none' : 'bg-bg-bubble-in rounded-tl-none'}`}
            >
                {senderName && (
                    <div 
                        className="text-[12.5px] font-semibold leading-tight mb-2 w-full cursor-pointer hover:underline"
                        style={{ color: senderColor || (isMine ? '#34b7f1' : '#e53935') }}
                        onClick={onSenderClick}
                    >
                        {senderName}
                    </div>
                )}
                {/* --- Circular Icon Container --- */}
                <div className="flex items-center gap-4 w-full">
                <div className="w-11 h-11 rounded-full bg-black/20 flex items-center justify-center shrink-0">
                    {isMissed ? (
                        <Icons.PhoneMissed size={20} className="text-[#ef4444]" /> // Red for missed
                    ) : isVideo ? (
                        <Icons.Video size={20} className="text-[#8696a0]" />
                    ) : (
                        <Icons.Phone size={20} className="text-[#8696a0]" />
                    )}
                </div>

                {/* --- Call Text Details --- */}
                <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[15.5px] font-medium text-white truncate">
                            {type || (isVideo ? 'Video call' : 'Voice call')}
                        </span>
                        {/* Outgoing/Incoming Indicator */}
                        {isMine ? (
                            <Icons.ArrowUpRight size={14} className="text-[#8696a0]" />
                        ) : (
                            <Icons.ArrowDownLeft size={14} className="text-[#8696a0]" />
                        )}
                    </div>

                    <span className={`text-[13.5px] font-normal ${isMissed ? 'text-[#ef4444]/90' : 'text-[#8696a0]'}`}>
                        {isMissed ? 'Missed' : 'No answer'}
                    </span>
                </div>

                {/* --- Timestamp --- */}
                <span className="text-[10.5px] self-end opacity-60 text-white/70 whitespace-nowrap font-medium tracking-tight mt-auto">
                    {time}
                </span>
                </div>
            </div>
        </div>
    );
};

export default CallBubble;