// src/features/community/hooks/useCommunityActions.js
// Manages community action state: join, leave, mute, info panels.
// Backend ready: connect actions to communityService when backend is ready.

import { useState, useCallback } from 'react';

/**
 * @param {object}   community  - Current community object
 * @param {Function} onExit     - Called after user exits community
 * @returns {{ isMuted, showMenu, showQR, toggleMute, toggleMenu, toggleQR, handleExitCommunity }}
 */
export function useCommunityActions(community, onExit) {
    const [isMuted,   setIsMuted]   = useState(community?.isMuted ?? false);
    const [showMenu,  setShowMenu]  = useState(false);
    const [showQR,    setShowQR]    = useState(false);
    const [confirming, setConfirming] = useState(false);  // exit confirm dialog

    const toggleMute  = useCallback(() => setIsMuted(prev  => !prev),  []);
    const toggleMenu  = useCallback(() => setShowMenu(prev => !prev),  []);
    const toggleQR    = useCallback(() => setShowQR(prev   => !prev),  []);

    const promptExit   = useCallback(() => setConfirming(true),  []);
    const cancelExit   = useCallback(() => setConfirming(false), []);
    const handleExitCommunity = useCallback(() => {
        setConfirming(false);
        onExit?.();
    }, [onExit]);

    return {
        isMuted, showMenu, showQR, confirming,
        toggleMute, toggleMenu, toggleQR,
        promptExit, cancelExit, handleExitCommunity,
    };
}

export default useCommunityActions;
