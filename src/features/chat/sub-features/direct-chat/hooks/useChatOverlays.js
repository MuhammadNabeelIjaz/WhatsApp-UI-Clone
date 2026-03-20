/**
 * useChatOverlays — manages all overlay/panel visibility state for ChatDetail.
 *
 * Extracted from ChatDetail.jsx to reduce its state surface and improve traceability.
 * Controls: attachment menu, mute sheet, user info overlay, media gallery,
 * media/links/docs panel, kept messages, poll creation, event creation, list picker,
 * mute state, copy feedback, and message forwarding target.
 */
import { useState, useCallback } from 'react';

export const useChatOverlays = () => {
    // ── Attachment & compose overlays ─────────────────────────────────────────
    const [isAttachmentOpen,  setIsAttachmentOpen]  = useState(false);
    const [showPollCreation,  setShowPollCreation]  = useState(false);
    const [showEventCreation, setShowEventCreation] = useState(false);
    const [showChooseList,    setShowChooseList]    = useState(false);

    // ── Info panels & sub-screens ─────────────────────────────────────────────
    const [showUserInfo,      setShowUserInfo]      = useState(false);
    const [showMediaGallery,  setShowMediaGallery]  = useState(false);
    const [showMediaLinksDoc, setShowMediaLinksDoc] = useState(false);
    const [showKeptMessages,  setShowKeptMessages]  = useState(false);

    // ── Notification & mute ───────────────────────────────────────────────────
    const [showMuteSheet,     setShowMuteSheet]     = useState(false);
    const [isMuted,           setIsMuted]           = useState(false);

    // ── Transient feedback ────────────────────────────────────────────────────
    const [copyFeedback,      setCopyFeedback]      = useState(false);

    // ── Forwarding ────────────────────────────────────────────────────────────
    const [forwardingMessages, setForwardingMessages] = useState(null);

    // ── Stable handlers ───────────────────────────────────────────────────────
    const openAttachment   = useCallback(() => setIsAttachmentOpen(true),  []);
    const closeAttachment  = useCallback(() => setIsAttachmentOpen(false), []);
    const toggleAttachment = useCallback(() => setIsAttachmentOpen(p => !p), []);

    const openPollCreation  = useCallback(() => { setIsAttachmentOpen(false); setShowPollCreation(true);  }, []);
    const closePollCreation = useCallback(() => setShowPollCreation(false), []);

    const openEventCreation  = useCallback(() => { setIsAttachmentOpen(false); setShowEventCreation(true);  }, []);
    const closeEventCreation = useCallback(() => setShowEventCreation(false), []);

    const openChooseList  = useCallback(() => { setIsAttachmentOpen(false); setShowChooseList(true);  }, []);
    const closeChooseList = useCallback(() => setShowChooseList(false), []);

    const openUserInfo   = useCallback(() => setShowUserInfo(true),  []);
    const closeUserInfo  = useCallback(() => setShowUserInfo(false), []);

    const openMediaGallery  = useCallback(() => setShowMediaGallery(true),  []);
    const closeMediaGallery = useCallback(() => setShowMediaGallery(false), []);

    const openMediaLinksDoc  = useCallback(() => setShowMediaLinksDoc(true),  []);
    const closeMediaLinksDoc = useCallback(() => setShowMediaLinksDoc(false), []);

    const openKeptMessages  = useCallback(() => setShowKeptMessages(true),  []);
    const closeKeptMessages = useCallback(() => setShowKeptMessages(false), []);

    const openMuteSheet  = useCallback(() => setShowMuteSheet(true),  []);
    const closeMuteSheet = useCallback(() => setShowMuteSheet(false), []);
    const confirmMute    = useCallback(() => { setIsMuted(true); setShowMuteSheet(false); }, []);

    const showCopyFeedback = useCallback(() => {
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
    }, []);

    const openForward  = useCallback((ids) => setForwardingMessages(ids),  []);
    const closeForward = useCallback(()     => setForwardingMessages(null), []);

    return {
        // State
        isAttachmentOpen,
        showPollCreation,
        showEventCreation,
        showChooseList,
        showUserInfo,
        showMediaGallery,
        showMediaLinksDoc,
        showKeptMessages,
        showMuteSheet,
        isMuted,
        copyFeedback,
        forwardingMessages,

        // Handlers
        openAttachment, closeAttachment, toggleAttachment,
        openPollCreation, closePollCreation,
        openEventCreation, closeEventCreation,
        openChooseList, closeChooseList,
        openUserInfo, closeUserInfo,
        openMediaGallery, closeMediaGallery,
        openMediaLinksDoc, closeMediaLinksDoc,
        openKeptMessages, closeKeptMessages,
        openMuteSheet, closeMuteSheet, confirmMute,
        showCopyFeedback,
        openForward, closeForward,
    };
};

export default useChatOverlays;
