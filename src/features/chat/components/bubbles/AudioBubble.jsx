import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '@constants/icons';

/**
 * AudioBubble — play/pause with animated progress bar.
 */
const AudioBubble = ({ fileName, fileSize, duration, time, isMine, status }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0); // 0-100
    const intervalRef = useRef(null);

    // Parse duration string like "0:06" to seconds
    const parseDuration = (d) => {
        if (!d) return 6;
        const parts = d.split(':').map(Number);
        return parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0];
    };
    const totalSec = parseDuration(duration);

    const progressRef = useRef(progress);
    progressRef.current = progress;

    const togglePlay = () => {
        if (isPlaying) {
            clearInterval(intervalRef.current);
            setIsPlaying(false);
        } else {
            if (progress >= 100) setProgress(0);
            setIsPlaying(true);
        }
    };

    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(intervalRef.current);
                        setIsPlaying(false);
                        return 100;
                    }
                    return prev + (100 / (totalSec * 10));
                });
            }, 100);
        }
        return () => clearInterval(intervalRef.current);
    }, [isPlaying, totalSec]);

    // Current time display
    const currentSec = Math.floor((progress / 100) * totalSec);
    const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        setProgress(pct);
    };

    return (
        <div className={`max-w-[85%] sm:max-w-[340px] p-2 rounded-2xl shadow-md border border-white/5
            ${isMine ? 'self-end bg-bg-bubble-out rounded-tr-none' : 'self-start bg-bg-bubble-in rounded-tl-none'}`}
        >
            <div className="flex items-center gap-3">
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-[#ff7a19] flex items-center justify-center text-white shrink-0 shadow-lg">
                    <Icons.Headphones size={24} />
                </div>

                {/* Controls */}
                <div className="flex-1 flex flex-col min-w-0 gap-1.5">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={togglePlay}
                            className="transition-transform active:scale-90 shrink-0"
                        >
                            {isPlaying
                                ? <Icons.Pause size={22} fill={isMine ? 'white' : '#8696a0'} className={isMine ? 'text-white' : 'text-[#8696a0]'} />
                                : <Icons.Play  size={22} fill={isMine ? 'white' : '#8696a0'} className={isMine ? 'text-white' : 'text-[#8696a0]'} />
                            }
                        </button>

                        {/* Seekable progress bar */}
                        <div
                            className="h-[4px] flex-1 bg-white/20 rounded-full overflow-hidden cursor-pointer relative"
                            onClick={handleSeek}
                        >
                            <div
                                className="h-full bg-accent rounded-full transition-none"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <span className="text-[10px] text-white/50 shrink-0 min-w-[30px] text-right">
                            {fmt(currentSec)}
                        </span>
                    </div>

                    <div className="px-1">
                        <h4 className="text-[13px] font-medium text-white truncate">
                            {fileName || 'AUD-20260310-WA0003.mp3'}
                        </h4>
                        <div className="flex items-center gap-2 opacity-60 text-[11px] text-white/80">
                            <span>{duration || '0:06'}</span>
                            <span>•</span>
                            <span>{fileSize || '16 KB'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end items-center gap-1 mt-1 px-1">
                <span className="text-[10px] opacity-60 text-white/70 font-medium">{time}</span>
                {isMine && (
                    status === 'read'
                        ? <Icons.CheckCheck size={15} className="text-[#53bdeb]" strokeWidth={2.5} />
                        : <Icons.CheckCheck size={15} className="opacity-60 text-white/70" strokeWidth={2.5} />
                )}
            </div>
        </div>
    );
};

export default AudioBubble;
