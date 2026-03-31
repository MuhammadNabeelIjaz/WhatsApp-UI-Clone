/**
 * ActiveCallScreen
 * Supports dynamic participant grid (Google Meet-style) and a participant list overlay.
 * Single-participant view: original avatar + pulse layout.
 * Multi-participant view: DynamicCallGrid with adaptive tiles.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Icons } from '@constants/icons';
import DynamicCallGrid from '../components/DynamicCallGrid';

// Dummy participants palette for "add participant" demo
const DUMMY_PARTICIPANTS = [
    { id: 'p2', name: 'Laiba Jax',    color: '#7e57c2' },
    { id: 'p3', name: 'Usman Khan',   color: '#26a69a' },
    { id: 'p4', name: 'Tahir Yr',     color: '#ec407a' },
    { id: 'p5', name: 'Anam Masood',  color: '#607d8b' },
    { id: 'p6', name: 'Heart Beat',   color: '#29b6f6' },
    { id: 'p7', name: 'Shahzey',      color: '#66bb6a' },
    { id: 'p8', name: 'A7 Lab',       color: '#f57c00' },
];

const ActiveCallScreen = ({ call, onEnd }) => {
    const [seconds,      setSeconds]      = useState(0);
    const [isMuted,      setIsMuted]      = useState(false);
    const [isSpeaker,    setIsSpeaker]    = useState(false);
    const [isVideo,      setIsVideo]      = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    
    const [participants, setParticipants] = useState([
        { id: 'p1', name: call?.name || 'Unknown', color: '#3d3470' },
    ]);
    const [showParticipantList, setShowParticipantList] = useState(false);
    const dummyIdx = participants.length - 1; // next dummy to add

    useEffect(() => {
        const timer = setInterval(() => setSeconds(s => s + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    const initials = (call?.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    const handleAddParticipant = useCallback(() => {
        const next = DUMMY_PARTICIPANTS[dummyIdx % DUMMY_PARTICIPANTS.length];
        if (!next) return;
        setParticipants(prev => [...prev, { ...next, id: `p${Date.now()}` }]);
        setShowMoreMenu(false);
    }, [dummyIdx]);

    const isMulti = participants.length > 1;

    return (
        <div
            className="absolute inset-0 z-[2000] flex flex-col"
            style={{ background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
        >
            {/* Doodle background */}
            <div className="absolute inset-0 opacity-5 overflow-hidden pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 400 800" fill="none">
                    {Array.from({ length: 30 }).map((_, i) => (
                        <text key={i} x={(i % 6) * 70 + 10} y={Math.floor(i / 6) * 120 + 40} fontSize="28" fill="white" opacity="0.3">
                            {['💬', '🎵', '🎨', '⭐', '🔔', '❤️'][i % 6]}
                        </text>
                    ))}
                </svg>
            </div>

            {/* Top bar */}
            <div className="relative z-10 flex items-center justify-between px-4 pt-10 pb-4 shrink-0">
                <button onClick={onEnd}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-all">
                    <Icons.ChevronDown size={22} className="text-white" />
                </button>
                <div className="text-center flex-1 min-w-0 px-3">
                    <p className="text-white text-[17px] font-semibold truncate">
                        {isMulti ? `Group Call (${participants.length})` : (call?.name || 'Unknown')}
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-0.5">
                        <Icons.Lock size={11} className="text-accent" />
                        <p className="text-white/60 text-[12px]">End-to-end encrypted</p>
                    </div>
                </div>
                
                <button
                    onClick={handleAddParticipant}
                    title="Add participant"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-all hover:bg-white/20">
                    <Icons.UserPlus size={20} className="text-white" />
                </button>
            </div>

            {/* More menu */}
            {showMoreMenu && (
                <div className="absolute bottom-36 left-1/2 z-20 w-[240px] -translate-x-1/2 rounded-3xl bg-bg-surface/95 backdrop-blur border border-border-main shadow-2xl p-3">
                    <button onClick={() => setShowMoreMenu(false)} className="text-text-secondary text-left text-[13px] mb-2 w-full">Close</button>
                    <div className="space-y-2">
                        <button onClick={() => { setShowMoreMenu(false); setIsMuted(m => !m); }}
                            className="w-full text-left rounded-xl px-3 py-3 hover:bg-bg-hover transition-colors text-text-primary text-[14px]">
                            {isMuted ? 'Unmute microphone' : 'Mute microphone'}
                        </button>
                        <button onClick={() => { setShowMoreMenu(false); setIsSpeaker(s => !s); }}
                            className="w-full text-left rounded-xl px-3 py-3 hover:bg-bg-hover transition-colors text-text-primary text-[14px]">
                            {isSpeaker ? 'Speaker off' : 'Speaker on'}
                        </button>
                        <button onClick={() => { setShowMoreMenu(false); setIsVideo(v => !v); }}
                            className="w-full text-left rounded-xl px-3 py-3 hover:bg-bg-hover transition-colors text-text-primary text-[14px]">
                            {isVideo ? 'Turn video off' : 'Turn video on'}
                        </button>
                        <button onClick={() => { setShowMoreMenu(false); handleAddParticipant(); }}
                            className="w-full text-left rounded-xl px-3 py-3 hover:bg-bg-hover transition-colors text-text-primary text-[14px]">
                            Add participant
                        </button>
                    </div>
                </div>
            )}

            {/* Participant list overlay */}
            {showParticipantList && (
                <div
                    className="absolute inset-0 z-30 bg-bg-surface/95 backdrop-blur flex flex-col animate-fade-in"
                    onClick={() => setShowParticipantList(false)}
                >
                    <div
                        className="flex flex-col bg-bg-surface rounded-t-3xl mt-auto max-h-[70%] overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="px-5 pt-5 pb-3 border-b border-border-main/10 flex items-center justify-between">
                            <h3 className="text-text-primary font-semibold text-[17px]">
                                Participants ({participants.length})
                            </h3>
                            <button onClick={() => setShowParticipantList(false)}
                                className="p-2 hover:bg-bg-hover rounded-full text-text-secondary">
                                <Icons.X size={20} />
                            </button>
                        </div>
                        <div className="overflow-y-auto custom-scrollbar pb-8">
                            {participants.map((p) => (
                                <div key={p.id} className="flex items-center gap-3 px-5 py-3 hover:bg-bg-hover transition-colors">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[14px] shrink-0"
                                        style={{ backgroundColor: p.color || '#607d8b' }}>
                                        {(p.name || 'U').slice(0, 2).toUpperCase()}
                                    </div>
                                    <span className="text-[15px] text-text-primary font-medium">{p.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Center: single vs grid */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center min-h-0">
                {!isMulti ? (
                    /* Single participant — original pulse avatar */
                    <>
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping scale-125" />
                            <div className="absolute inset-0 rounded-full bg-accent/10 animate-pulse scale-150" />
                            <div className="w-32 h-32 rounded-full bg-[#3d3470] flex items-center justify-center border-2 border-accent/30 shadow-2xl relative z-10">
                                <span className="text-[44px] font-bold text-[#9b8fe8]">{initials}</span>
                            </div>
                        </div>
                        <p className="text-white/50 text-[18px] font-medium mt-8 tabular-nums">{fmt(seconds)}</p>
                    </>
                ) : (
                    /* Multiple participants*/
                    <div className="w-full h-full flex flex-col px-2 py-2">
                        <DynamicCallGrid
                            participants={participants}
                            onOverflowClick={() => setShowParticipantList(true)}
                        />
                        <p className="text-white/40 text-[13px] text-center tabular-nums mt-2 shrink-0">
                            {fmt(seconds)}
                        </p>
                    </div>
                )}
            </div>

            {/* Bottom controls */}
            <div className="relative z-10 pb-8 px-4 shrink-0">
                <div className="bg-bg-surface/30 backdrop-blur rounded-3xl p-4 flex items-center justify-around">
                    <button onClick={() => setShowMoreMenu(v => !v)}
                        className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-all">
                        <Icons.MoreVertical size={20} className="text-white" />
                    </button>
                    <button onClick={() => setIsVideo(v => !v)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center active:scale-90 transition-all ${isVideo ? 'bg-accent' : 'bg-white/10'}`}>
                        <Icons.Video size={20} className="text-white" />
                    </button>
                    <button onClick={() => setIsSpeaker(s => !s)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center active:scale-90 transition-all ${isSpeaker ? 'bg-accent' : 'bg-white/10'}`}>
                        <Icons.Bell size={20} className="text-white" />
                    </button>
                    <button onClick={() => setIsMuted(m => !m)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center active:scale-90 transition-all ${isMuted ? 'bg-white/30' : 'bg-white/10'}`}>
                        {isMuted ? <Icons.MicOff size={20} className="text-white" /> : <Icons.Mic size={20} className="text-white" />}
                    </button>
                    <button onClick={onEnd}
                        className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center active:scale-90 transition-all shadow-lg">
                        <Icons.Phone size={20} className="text-white rotate-135" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActiveCallScreen;
