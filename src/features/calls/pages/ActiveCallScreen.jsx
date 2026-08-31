/**
 * ActiveCallScreen
 * Supports dynamic participant grid (Google Meet-style) and a participant list overlay.
 * Single-participant view: original avatar + pulse layout.
 * Multi-participant view: DynamicCallGrid with adaptive tiles.
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Icons } from '@constants/icons';
import { useIsDesktop } from '@shared/hooks';
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
    const [seconds, setSeconds] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideo, setIsVideo] = useState(false); // Default to off as requested

    const localVideoRef = useRef(null);
    const streamRef = useRef(null);

    
    const [participants, setParticipants] = useState([
        { id: 'p1', name: call?.name || 'Unknown', color: '#3d3470' },
    ]);
    const [showParticipantList, setShowParticipantList] = useState(false);
    
    // New interaction states
    const [isRemoteVideo, setIsRemoteVideo] = useState(false); // Default to off
    const [isHandRaised, setIsHandRaised] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [showEmojiMenu, setShowEmojiMenu] = useState(false);
    const [showChatMenu, setShowChatMenu] = useState(false);
    const [showDeviceMenu, setShowDeviceMenu] = useState(null); // 'camera' or 'mic'
    const dummyIdx = participants.length - 1; // next dummy to add

    useEffect(() => {
        const timer = setInterval(() => setSeconds(s => s + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const stopMediaTracks = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }, []);

    // Handle real camera access
    useEffect(() => {
        if (isVideo) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(stream => {
                    streamRef.current = stream;
                    // Mute audio track if currently muted state
                    stream.getAudioTracks().forEach(track => {
                        track.enabled = !isMuted;
                    });
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = stream;
                    }
                })
                .catch(err => {
                    console.error("Error accessing camera:", err);
                    setIsVideo(false);
                    // Add alert for user if permission denied
                    if (err.name === 'NotAllowedError') {
                        alert("Camera access was denied. Please allow permissions in your browser.");
                    }
                });
        } else {
            stopMediaTracks();
        }

        return () => stopMediaTracks();
    }, [isVideo]); // Re-run when video toggles

    // Toggle audio track when mute state changes
    useEffect(() => {
        if (streamRef.current) {
            streamRef.current.getAudioTracks().forEach(track => {
                track.enabled = !isMuted;
            });
        }
    }, [isMuted]);

    const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    const remoteInitials = (call?.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    
    // Hardcode local initials based on user preference (Nabeel)
    const localInitials = "NA";

    const handleAddParticipant = useCallback(() => {
        const next = DUMMY_PARTICIPANTS[dummyIdx % DUMMY_PARTICIPANTS.length];
        if (!next) return;
        setParticipants(prev => [...prev, { ...next, id: `p${Date.now()}` }]);
    }, [dummyIdx]);

    const isMulti = participants.length > 1;
    const isDesktop = useIsDesktop();

    const callContent = (
        <>
            {/* Main Video Area */}
            <div className="absolute inset-0 bg-bg-hover flex items-center justify-center overflow-hidden">
                {!isMulti ? (
                    /* 1-on-1 Call: Remote video fullscreen + Local PiP */
                    <>
                        {isRemoteVideo ? (
                            <img 
                                src={call?.avatar || "https://picsum.photos/seed/remoteuser/1280/720"} 
                                alt={call?.name} 
                                className="w-full h-full object-cover opacity-90"
                            />
                        ) : (
                            <div className="w-full h-full bg-bg-hover flex items-center justify-center">
                                <div className="w-32 h-32 rounded-full bg-[#607d8b] flex items-center justify-center shadow-lg">
                                    <span className="text-text-primary text-[48px] font-bold">{remoteInitials}</span>
                                </div>
                            </div>
                        )}
                        
                        {/* Status indicators over remote video (hand raise / screen share) */}
                        <div className="absolute top-20 left-6 flex flex-col gap-2 z-20">
                            {isScreenSharing && (
                                <div className="bg-black/60 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2 text-text-primary">
                                    <Icons.Monitor size={16} className="text-[#25D366]" />
                                    <span className="text-sm font-medium">You are sharing your screen</span>
                                </div>
                            )}
                        </div>

                        {/* PiP Local Video */}
                        <div className="absolute bottom-[90px] right-6 w-[200px] aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border border-white/10 z-20">
                            <div className="absolute top-0 right-0 w-full h-full bg-bg-surface">
                                <video 
                                    ref={localVideoRef} 
                                    autoPlay 
                                    playsInline 
                                    muted // Always mute local video playback to avoid feedback
                                    className={`w-full h-full object-cover ${isVideo ? 'block' : 'hidden'}`} 
                                    style={{ transform: 'scaleX(-1)' }} // Mirror the local video
                                />
                                {!isVideo && (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-md"
                                            style={{ backgroundColor: '#10b981' }}>
                                            <span className="text-text-primary text-2xl font-bold">{localInitials}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Hand Raised indicator in local video */}
                            {isHandRaised && (
                                <div className="absolute top-2 left-2 bg-black/50 p-1.5 rounded-full">
                                    <Icons.Hand size={14} className="text-[#ffca28]" />
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    /* Multiple participants: Grid View */
                    <div className="w-full h-[calc(100%-80px)] px-4 py-4 pt-12">
                        <DynamicCallGrid
                            participants={participants}
                            onOverflowClick={() => setShowParticipantList(true)}
                        />
                    </div>
                )}
            </div>

            {/* Top Info Bar (Optional/Hover) */}
            <div className="absolute top-0 left-0 w-full px-6 py-4 flex items-center justify-between z-30 bg-bg-surface/60 backdrop-blur-md border-b border-border-main/30">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center">
                        <Icons.Phone size={16} className="text-text-primary" />
                    </div>
                    <span className="text-text-primary font-medium drop-shadow-md">WhatsApp</span>
                </div>
                <div className="px-3 py-1 bg-bg-hover/80 rounded-md">
                    <p className="text-text-primary text-[13px] font-mono tracking-widest">{fmt(seconds)}</p>
                </div>
            </div>

            {/* Participant list overlay - updated z-index to 60 to cover bottom bar */}
            {showParticipantList && (
                <div
                    className="absolute inset-0 z-[60] bg-bg-surface/95 backdrop-blur flex flex-col animate-fade-in"
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
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-text-primary font-bold text-[14px] shrink-0"
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

            {/* Bottom Toolbar matching media_1 / media_2 */}
            <div className="absolute bottom-0 left-0 w-full h-[80px] bg-bg-surface/90 backdrop-blur-md flex items-center justify-between px-6 z-30 border-t border-border-main/30 shadow-xl">
                
                {/* Left controls: Video, Mic */}
                <div className="flex items-center gap-2 relative">
                    <div className="flex items-center bg-bg-hover rounded-full overflow-hidden h-10">
                        <button onClick={() => setIsVideo(v => !v)} className="flex items-center justify-center w-12 h-full hover:bg-bg-skeleton transition-colors">
                            {isVideo ? <Icons.Video size={20} className="text-text-primary" /> : <Icons.VideoOff size={20} className="text-[#f15c6d]" />}
                        </button>
                        <div className="w-[1px] h-4 bg-white/10" />
                        <button onClick={() => setShowDeviceMenu(showDeviceMenu === 'camera' ? null : 'camera')} className="flex items-center justify-center w-8 h-full hover:bg-bg-skeleton transition-colors">
                            <Icons.ChevronDown size={16} className="text-text-primary" />
                        </button>
                    </div>
                    
                    {showDeviceMenu === 'camera' && (
                        <div className="absolute bottom-14 left-0 bg-bg-hover border border-white/10 rounded-xl py-2 w-48 shadow-xl">
                            <div className="px-4 py-2 text-sm text-text-secondary font-medium">Select Camera</div>
                            <button className="w-full px-4 py-2 text-left text-text-primary text-sm hover:bg-white/10 flex items-center justify-between">
                                Default Camera <Icons.Check size={14} className="text-[#25D366]" />
                            </button>
                        </div>
                    )}

                    <div className="flex items-center bg-bg-hover rounded-full overflow-hidden h-10">
                        <button onClick={() => setIsMuted(m => !m)} className="flex items-center justify-center w-12 h-full hover:bg-bg-skeleton transition-colors">
                            {!isMuted ? <Icons.Mic size={20} className="text-text-primary" /> : <Icons.MicOff size={20} className="text-[#f15c6d]" />}
                        </button>
                        <div className="w-[1px] h-4 bg-white/10" />
                        <button onClick={() => setShowDeviceMenu(showDeviceMenu === 'mic' ? null : 'mic')} className="flex items-center justify-center w-8 h-full hover:bg-bg-skeleton transition-colors">
                            <Icons.ChevronDown size={16} className="text-text-primary" />
                        </button>
                    </div>
                    
                    {showDeviceMenu === 'mic' && (
                        <div className="absolute bottom-14 left-24 bg-bg-hover border border-white/10 rounded-xl py-2 w-48 shadow-xl">
                            <div className="px-4 py-2 text-sm text-text-secondary font-medium">Select Microphone</div>
                            <button className="w-full px-4 py-2 text-left text-text-primary text-sm hover:bg-white/10 flex items-center justify-between">
                                Default Microphone <Icons.Check size={14} className="text-[#25D366]" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Center controls: Emoji, Raise Hand, Screen Share, Participants, Chat */}
                <div className="flex items-center gap-2 relative">
                    <div className="relative">
                        <button 
                            onClick={() => setShowEmojiMenu(!showEmojiMenu)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showEmojiMenu ? 'bg-bg-skeleton' : 'hover:bg-bg-hover'}`}
                        >
                            <Icons.Smile size={20} className="text-text-primary" />
                        </button>
                        {showEmojiMenu && (
                            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-bg-hover border border-white/10 rounded-full px-4 py-2 flex items-center gap-3 shadow-xl">
                                {['👍', '❤️', '😂', '😮', '😢', '👏'].map(emoji => (
                                    <button key={emoji} onClick={() => setShowEmojiMenu(false)} className="text-2xl hover:scale-125 transition-transform">
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <button 
                        onClick={() => setIsHandRaised(!isHandRaised)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isHandRaised ? 'bg-[#25D366]/20 text-[#25D366]' : 'hover:bg-bg-hover text-text-primary'}`}
                    >
                        <Icons.Hand size={20} className={isHandRaised ? 'text-[#25D366]' : 'text-text-primary'} />
                    </button>
                    
                    <button 
                        onClick={() => setIsScreenSharing(!isScreenSharing)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isScreenSharing ? 'bg-[#25D366]/20 text-[#25D366]' : 'hover:bg-bg-hover text-text-primary'}`}
                    >
                        <Icons.Monitor size={20} className={isScreenSharing ? 'text-[#25D366]' : 'text-text-primary'} />
                    </button>
                    
                    <button 
                        onClick={() => setShowParticipantList(true)}
                        className="w-10 h-10 rounded-full hover:bg-bg-hover flex items-center justify-center transition-colors relative"
                    >
                        <Icons.Users size={20} className="text-text-primary" />
                        {isMulti && (
                            <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#25D366] rounded-full text-[#111b21] text-[9px] font-bold flex items-center justify-center">
                                {participants.length}
                            </div>
                        )}
                    </button>
                    
                    <div className="relative">
                        <button 
                            onClick={() => setShowChatMenu(!showChatMenu)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showChatMenu ? 'bg-bg-skeleton' : 'hover:bg-bg-hover'}`}
                        >
                            <Icons.MessageSquare size={20} className="text-text-primary" />
                        </button>
                        {showChatMenu && (
                            <div className="absolute bottom-14 right-0 bg-bg-hover border border-white/10 rounded-xl w-64 shadow-xl overflow-hidden">
                                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                                    <span className="text-text-primary font-medium text-sm">In-call Messages</span>
                                    <button onClick={() => setShowChatMenu(false)}>
                                        <Icons.X size={16} className="text-text-secondary hover:text-text-primary" />
                                    </button>
                                </div>
                                <div className="p-4 h-32 flex items-center justify-center">
                                    <span className="text-text-secondary/80 text-sm">No messages yet.</span>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Remote video toggle (debug) */}
                    {!isMulti && (
                        <button onClick={() => setIsRemoteVideo(v => !v)} title="Toggle Remote Camera" className="w-10 h-10 rounded-full hover:bg-bg-hover flex items-center justify-center transition-colors">
                            {isRemoteVideo ? <Icons.Video size={20} className="text-text-secondary" /> : <Icons.VideoOff size={20} className="text-text-secondary" />}
                        </button>
                    )}
                    
                    {/* Add participant (debug) */}
                    <button onClick={handleAddParticipant} title="Add dummy participant" className="w-10 h-10 rounded-full hover:bg-bg-hover flex items-center justify-center transition-colors">
                        <Icons.UserPlus size={20} className="text-text-secondary/60" />
                    </button>
                </div>

                {/* Right controls: End call */}
                <div className="flex items-center">
                    <button onClick={() => { stopMediaTracks(); onEnd(); }}
                        className="h-10 px-6 rounded-full bg-[#f15c6d] flex items-center justify-center hover:bg-[#f67683] transition-colors shadow-lg group">
                        <Icons.Phone size={20} className="text-white rotate-[135deg]" />
                    </button>
                </div>
            </div>
        </>
    );

    if (isDesktop) {
        return (
            <div className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/70 animate-fade-in backdrop-blur-sm">
                <div 
                    className="w-[720px] max-w-[95vw] h-[540px] max-h-[95vh] rounded-3xl overflow-hidden shadow-2xl relative flex flex-col animate-zoom-in"
                    
                >
                    {callContent}
                </div>
            </div>
        );
    }

    return (
        <div
            className="absolute inset-0 z-[2000] flex flex-col"
            
        >
            {callContent}
        </div>
    );
};

export default ActiveCallScreen;
