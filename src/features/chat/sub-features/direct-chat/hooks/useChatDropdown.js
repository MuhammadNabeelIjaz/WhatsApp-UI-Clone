/**
 * useChatDropdown — manages the header dropdown menu and all confirmation dialog state.
 *
 * Extracted from ChatDetail.jsx to reduce its state surface.
 * Controls: header dropdown open/close, delete confirm dialog,
 * block confirm dialog, disappearing messages dialog + timer value.
 */
import { useState, useCallback, useRef } from 'react';

export const useChatDropdown = () => {
    // ── Header dropdown ───────────────────────────────────────────────────────
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const openDropdown  = useCallback(() => setShowDropdown(true),  []);
    const closeDropdown = useCallback(() => setShowDropdown(false), []);
    const toggleDropdown = useCallback(() => setShowDropdown(p => !p), []);

    // ── Confirmation dialogs ──────────────────────────────────────────────────
    const [showDeleteConfirm,   setShowDeleteConfirm]   = useState(false);
    const [showBlockConfirm,    setShowBlockConfirm]    = useState(false);
    const [showDisappearingMsg, setShowDisappearingMsg] = useState(false);
    const [disappearingTimer,   setDisappearingTimer]   = useState('off');

    const openDeleteConfirm   = useCallback(() => { setShowDropdown(false); setShowDeleteConfirm(true);   }, []);
    const closeDeleteConfirm  = useCallback(() => setShowDeleteConfirm(false),  []);

    const openBlockConfirm    = useCallback(() => { setShowDropdown(false); setShowBlockConfirm(true);    }, []);
    const closeBlockConfirm   = useCallback(() => setShowBlockConfirm(false),   []);

    const openDisappearing    = useCallback(() => { setShowDropdown(false); setShowDisappearingMsg(true); }, []);
    const closeDisappearing   = useCallback(() => setShowDisappearingMsg(false), []);

    return {
        // Dropdown state + ref
        showDropdown,
        dropdownRef,
        openDropdown,
        closeDropdown,
        toggleDropdown,
        setShowDropdown,

        // Dialog state
        showDeleteConfirm,
        showBlockConfirm,
        showDisappearingMsg,
        disappearingTimer,
        setDisappearingTimer,

        // Dialog handlers
        openDeleteConfirm,  closeDeleteConfirm,
        openBlockConfirm,   closeBlockConfirm,
        openDisappearing,   closeDisappearing,
    };
};

export default useChatDropdown;
