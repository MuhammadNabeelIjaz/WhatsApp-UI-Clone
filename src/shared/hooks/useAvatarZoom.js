/**
 * useAvatarZoom — reusable hook for DP expand/zoom across all tabs.
 * Returns { zoomChat, openZoom, closeZoom }
 * Pair with <ProfilePictureOverlay> component.
 */
import { useState, useCallback } from 'react';

const useAvatarZoom = () => {
    const [zoomChat, setZoomChat] = useState(null);

    const openZoom = useCallback((chat) => {
        if (!chat) return;
        setZoomChat(chat);
    }, []);

    const closeZoom = useCallback(() => {
        setZoomChat(null);
    }, []);

    return { zoomChat, openZoom, closeZoom };
};

export default useAvatarZoom;
