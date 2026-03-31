// src/features/calls/hooks/useActiveCall.js
// Manages active call session state (mute, speaker, hold, timer).
// Backend ready: integrate with WebRTC / signalling layer here.

import { useState, useEffect, useRef } from 'react';

/**
 * @returns {{ isMuted, isSpeaker, isOnHold, duration, toggleMute, toggleSpeaker, toggleHold }}
 */
export function useActiveCall() {
    const [isMuted,   setIsMuted]   = useState(false);
    const [isSpeaker, setIsSpeaker] = useState(false);
    const [isOnHold,  setIsOnHold]  = useState(false);
    const [duration,  setDuration]  = useState(0);   // seconds elapsed

    const timerRef = useRef(null);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setDuration(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, []);

    const toggleMute    = () => setIsMuted(prev   => !prev);
    const toggleSpeaker = () => setIsSpeaker(prev => !prev);
    const toggleHold    = () => setIsOnHold(prev  => !prev);

    return { isMuted, isSpeaker, isOnHold, duration, toggleMute, toggleSpeaker, toggleHold };
}

export default useActiveCall;
