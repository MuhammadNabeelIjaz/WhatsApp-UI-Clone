import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icons } from '@constants/icons';

const StatusPlayer = ({ users, currentUserIndex, onClose, onUpdateSeen, onUserChange }) => {
    const statusData = users[currentUserIndex];

    // Reset slide index only when the user actually changes
    const [slideIndex, setSlideIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [loadingError, setLoadingError] = useState(false);

    const SLIDE_DURATION = 5000;
    const progressTimer = useRef(null);
    const videoRef = useRef(null);

    const menuRef = useRef(null);
    const [showMenu, setShowMenu] = useState(false);

    // Long press = pause; release = resume
    const longPressTimer = useRef(null);
    const isLongPressing = useRef(false);

    const handlePressStart = useCallback((e) => {
        // Don't trigger on nav zones or buttons
        if (e.target.closest('button') || e.target.closest('input')) return;
        longPressTimer.current = setTimeout(() => {
            isLongPressing.current = true;
            setIsPaused(true);
        }, 150); // 150ms threshold = feels instant, avoids accidental pause on tap
    }, []);

    const handlePressEnd = useCallback(() => {
        clearTimeout(longPressTimer.current);
        if (isLongPressing.current) {
            isLongPressing.current = false;
            setIsPaused(false);
        }
    }, []);


    // Components
    const MenuBtn = ({ icon, label, onClick }) => (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-4 px-4 py-2.5 hover:bg-bg-hover text-text-primary transition-colors group"
        >
            <span className="text-text-secondary group-hover:text-white-hover flex shrink-0">
                {icon}
            </span>
            <span className="text-[14.5px] font-normal whitespace-nowrap overflow-hidden text-ellipsis flex-1 text-left">
                {label}
            </span>
        </button>
    );
    // Sync slide index with seenCount when opening a new user
    const statusDataRef = useRef(statusData);
    statusDataRef.current = statusData;

    useEffect(() => {
        const { seenCount, totalSlides } = statusDataRef.current;
        const startIdx = seenCount < totalSlides ? seenCount : 0;
        setSlideIndex(startIdx);
        setProgress(0);
    }, [currentUserIndex, statusData.id]);

    const handleNext = useCallback(() => {
        setLoadingError(false);
        setProgress(0);

        if (slideIndex < statusData.totalSlides - 1) {
            setSlideIndex(prev => prev + 1);
        } else {
            if (currentUserIndex < users.length - 1) {
                onUserChange(currentUserIndex + 1);
            } else {
                onClose();
            }
        }
    }, [slideIndex, statusData, currentUserIndex, users.length, onUserChange, onClose]);

    const handlePrev = useCallback(() => {
        setLoadingError(false);
        setProgress(0);

        if (slideIndex > 0) {
            setSlideIndex(prev => prev - 1);
        } else if (currentUserIndex > 0) {
            onUserChange(currentUserIndex - 1);
        } else {
            setProgress(0);
        }
    }, [slideIndex, currentUserIndex, onUserChange]);

    // Update Seen Count in Parent
    useEffect(() => {
        onUpdateSeen(statusData.id, slideIndex + 1);
    }, [slideIndex, statusData.id, onUpdateSeen]);

    useEffect(() => {
        if (isPaused || loadingError) {
            clearInterval(progressTimer.current);
            return;
        }

        const step = 50;
        const currentSlide = statusData.slides[slideIndex];
        const duration = (currentSlide?.type === 'video' && videoRef.current)
            ? (videoRef.current.duration * 1000 || SLIDE_DURATION)
            : SLIDE_DURATION;

        const increment = (step / duration) * 100;

        progressTimer.current = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    handleNext();
                    return 100;
                }
                return prev + increment;
            });
        }, step);

        return () => clearInterval(progressTimer.current);
    }, [slideIndex, isPaused, handleNext, statusData.slides, loadingError, statusData.id]);

    const currentSlide = statusData.slides[slideIndex] || {};

    return (
        <div className="fixed inset-0 z-[500] bg-black flex items-center justify-center select-none overflow-hidden touch-none">
            <div className="absolute inset-0 bg-black/90 hidden md:block" onClick={onClose} />

            <div className="relative w-full h-full md:w-[420px] md:max-h-[850px] md:h-[95vh] md:rounded-2xl overflow-hidden bg-[#0b141a] shadow-2xl z-[510]">
                <div className="absolute top-4 left-0 right-0 px-3 flex gap-1.5 z-[550]">
                    {statusData.slides.map((_, index) => (
                        <div key={index} className="h-[2px] flex-1 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-white transition-all duration-100 ease-linear ${index < slideIndex ? 'w-full' : index > slideIndex ? 'w-0' : ''}`}
                                style={{ width: index === slideIndex ? `${progress}%` : undefined }}
                            />
                        </div>
                    ))}
                </div>

                <div className="absolute top-0 left-0 right-0 px-4 pt-8 pb-10 flex items-center justify-between z-[550] bg-gradient-to-b from-black/60 to-transparent">
                    <div className="flex items-center gap-3">
                        <img src={statusData.image} className="w-10 h-10 rounded-full object-cover border border-white/10" alt="Profile" />
                        <div className="text-white">
                            <h3 className="text-[15px] font-semibold">{statusData.name}</h3>
                            <p className="text-[11px] text-white/60 font-medium">Recently</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-white">

                        <div className="relative" ref={menuRef}>
                            <button onClick={() => setShowMenu(!showMenu)} className={`p-2 hover:bg-bg-hover rounded-full text-text-secondary ${showMenu ? 'bg-bg-hover' : ''}`}>
                                <Icons.MoreVertical size={20} />
                            </button>
                            {showMenu && (
                                <div className="absolute right-0 mt-2 w-52 bg-bg-surface border border-border-main rounded-lg shadow-xl z-[210] py-2 animate-zoom-in origin-top-right">
                                    <MenuBtn icon={<Icons.MessageSquare size={20} />} label="Message" />
                                    <MenuBtn icon={<Icons.Phone size={20} />} label="Voice call" />
                                    <MenuBtn icon={<Icons.Video size={20} />} label="Video call" />
                                    <MenuBtn icon={<Icons.User size={20} />} label="View contact" />
                                    <MenuBtn icon={<Icons.Bell size={20} />} label="Get notification" />
                                    <MenuBtn icon={<Icons.EyeOff size={20} />} label="Hide" />
                                    <MenuBtn icon={<Icons.Flag size={20} />} label="Report" />
                                </div>
                            )}
                        </div>
                        <Icons.X size={26} className="cursor-pointer opacity-80" onClick={onClose} />
                    </div>

                </div>

                <div
                    className="relative w-full h-full flex items-center justify-center"
                    onMouseDown={handlePressStart}
                    onMouseUp={handlePressEnd}
                    onMouseLeave={handlePressEnd}
                    onTouchStart={handlePressStart}
                    onTouchEnd={handlePressEnd}
                    onTouchCancel={handlePressEnd}
                >
                    <div className="absolute inset-y-0 left-0 w-1/4 z-[540] cursor-pointer" onClick={handlePrev} />
                    <div className="absolute inset-y-0 right-0 w-1/4 z-[540] cursor-pointer" onClick={handleNext} />

                    {/* Pause overlay — shown while long pressing */}
                    {isPaused && !loadingError && (
                        <div className="absolute inset-0 z-[545] flex items-center justify-center pointer-events-none">
                            <div className="bg-black/40 rounded-full p-4 backdrop-blur-sm">
                                <Icons.Pause size={36} className="text-white opacity-90" />
                            </div>
                        </div>
                    )}

                    {loadingError ? (
                        <div className="flex flex-col items-center text-white/40 gap-3">
                            <Icons.ImageOff size={48} />
                            <p className="text-sm italic">Skipping broken media...</p>
                        </div>
                    ) : currentSlide.type === 'image' ? (
                        <img src={currentSlide.url} className="w-full h-full object-contain" onError={() => setLoadingError(true)} alt="Status" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center px-10 text-center bg-[#5c4033]">
                            <p className="text-2xl text-white font-medium leading-relaxed">{currentSlide.content}</p>
                        </div>
                    )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 bg-gradient-to-t from-black/80 to-transparent z-[550]">
                    {statusData.id === 'me' ? (
                        <div className="flex items-center justify-center gap-2 py-2">
                            <Icons.Eye size={20} className="text-white/70" />
                            <span className="text-white/70 text-[15px] font-medium">
                                {statusData.slides[slideIndex]?.views?.length ?? 0} views
                            </span>
                        </div>
                    ) : (
                    <div className="flex items-center gap-2">
                        <div className="flex-1 flex items-center gap-3 bg-[#2a3942] rounded-full px-4 py-2.5">
                            <Icons.Smile size={22} className="text-white/50" />
                            <input type="text" placeholder="Reply" className="bg-transparent flex-1 outline-none text-white placeholder:text-white/40 text-sm" onFocus={() => setIsPaused(true)} onBlur={() => setIsPaused(false)} />
                            <Icons.Paperclip size={20} className="text-white/50 -rotate-45" />
                        </div>
                        <div className="w-11 h-11 bg-[#00a884] rounded-full flex items-center justify-center text-white shadow-lg">
                            <Icons.Send size={20} fill="currentColor" />
                        </div>
                    </div>
                    )}
                </div>
            </div>

            <button onClick={handlePrev} className="hidden md:flex absolute left-10 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center bg-white/5 hover:bg-white/10 rounded-full text-white transition-all z-[600]">
                <Icons.ChevronLeft size={32} />
            </button>
            <button onClick={handleNext} className="hidden md:flex absolute right-10 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center bg-white/5 hover:bg-white/10 rounded-full text-white transition-all z-[600]">
                <Icons.ChevronRight size={32} />
            </button>
        </div>
    );
};

export default StatusPlayer;